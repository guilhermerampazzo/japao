"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/stores/cart";
import { formatBRL } from "@/lib/money";
import { createOrder } from "./actions";

type ShipOption = { id: string; name: string; priceCents: number; deliveryDays: number };

export default function CheckoutClient() {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [pending, startTransition] = useTransition();

  const [addr, setAddr] = useState({
    cep: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
  });
  const [shipOptions, setShipOptions] = useState<ShipOption[]>([]);
  const [shipId, setShipId] = useState<string>("");
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [discountCents, setDiscountCents] = useState(0);
  const [error, setError] = useState("");

  const subtotal = subtotalCents();
  const shipping = shipOptions.find((o) => o.id === shipId);
  const shippingCents = shipping?.priceCents ?? 0;
  const total = Math.max(0, subtotal - discountCents) + shippingCents;

  function set(field: keyof typeof addr, value: string) {
    setAddr((a) => ({ ...a, [field]: value }));
  }

  async function onCepBlur() {
    const cep = addr.cep.replace(/\D/g, "");
    if (cep.length !== 8) return;
    try {
      const via = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then((r) => r.json());
      if (!via.erro) {
        setAddr((a) => ({
          ...a,
          street: via.logradouro ?? a.street,
          district: via.bairro ?? a.district,
          city: via.localidade ?? a.city,
          state: via.uf ?? a.state,
        }));
      }
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cep, subtotalCents: subtotal, weightGrams: 300 * items.length }),
      }).then((r) => r.json());
      if (res.options) {
        setShipOptions(res.options);
        setShipId(res.options[0]?.id ?? "");
      }
    } catch {
      /* ignore */
    }
  }

  async function applyCoupon() {
    setCouponMsg("");
    const res = await fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon, subtotalCents: subtotal }),
    }).then((r) => r.json());
    if (res.valid) {
      setDiscountCents(res.discountCents);
      setCouponMsg(`Cupom aplicado: -${formatBRL(res.discountCents)}`);
    } else {
      setDiscountCents(0);
      setCouponMsg(res.reason ?? "Cupom inválido");
    }
  }

  function submit() {
    setError("");
    if (!shipId) {
      setError("Informe o CEP e escolha o frete");
      return;
    }
    startTransition(async () => {
      const result = await createOrder({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        address: addr,
        shippingOptionId: shipId,
        couponCode: discountCents > 0 ? coupon : undefined,
      });
      if (result.ok) {
        clear();
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          router.push(`/pedido/${result.orderId}`);
        }
      } else {
        setError(result.error);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-xl">
        <p className="text-on-surface-variant mb-md">Seu carrinho está vazio.</p>
        <Link href="/" className="text-primary font-medium">Explorar produtos</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg lg:gap-xl">
      {/* Endereço + frete */}
      <div className="lg:col-span-2 flex flex-col gap-lg">
        <section className="bg-white rounded-lg product-card-shadow p-md sm:p-lg">
          <h2 className="font-display text-xl font-bold mb-md">Endereço de Entrega</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <Input label="CEP" value={addr.cep} onChange={(v) => set("cep", v)} onBlur={onCepBlur} />
            <div className="hidden sm:block" />
            <Input label="Logradouro" value={addr.street} onChange={(v) => set("street", v)} className="sm:col-span-2" />
            <Input label="Número" value={addr.number} onChange={(v) => set("number", v)} />
            <Input label="Complemento" value={addr.complement} onChange={(v) => set("complement", v)} />
            <Input label="Bairro" value={addr.district} onChange={(v) => set("district", v)} />
            <Input label="Cidade" value={addr.city} onChange={(v) => set("city", v)} />
            <Input label="UF" value={addr.state} onChange={(v) => set("state", v)} />
          </div>
        </section>

        {shipOptions.length > 0 && (
          <section className="bg-white rounded-lg product-card-shadow p-md sm:p-lg">
            <h2 className="font-display text-xl font-bold mb-md">Frete</h2>
            <div className="flex flex-col gap-2">
              {shipOptions.map((o) => (
                <label key={o.id} className="flex flex-col sm:flex-row sm:items-center gap-sm sm:gap-md border border-outline-variant rounded-md px-md py-sm cursor-pointer">
                  <input type="radio" name="ship" checked={shipId === o.id} onChange={() => setShipId(o.id)} />
                  <span className="flex-1">{o.name} · até {o.deliveryDays} dias úteis</span>
                  <span className="font-semibold text-primary">
                    {o.priceCents === 0 ? "Grátis" : formatBRL(o.priceCents)}
                  </span>
                </label>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Resumo */}
      <aside className="bg-white rounded-lg product-card-shadow p-md sm:p-lg h-fit flex flex-col gap-md">
        <h2 className="font-display text-xl font-bold">Resumo do Pedido</h2>
        <div className="flex flex-col gap-sm">
          {items.map((i) => (
            <div key={i.variantId} className="flex gap-sm items-center min-w-0">
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-surface-container shrink-0">
                <Image src={i.image} alt={i.name} fill sizes="48px" className="object-cover" />
              </div>
              <span className="flex-1 text-sm min-w-0">{i.name} × {i.quantity}</span>
              <span className="text-sm font-medium">{formatBRL(i.priceCents * i.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Cupom"
            className="flex-1 border border-outline-variant rounded-md px-md py-2 text-sm"
          />
          <button onClick={applyCoupon} className="bg-secondary-container text-on-secondary-container px-md py-2 rounded-md text-sm font-medium">
            Aplicar
          </button>
        </div>
        {couponMsg && <p className="text-xs text-on-surface-variant">{couponMsg}</p>}

        <div className="border-t border-outline-variant pt-md flex flex-col gap-1 text-sm">
          <Row label="Subtotal" value={formatBRL(subtotal)} />
          {discountCents > 0 && <Row label="Desconto" value={`-${formatBRL(discountCents)}`} />}
          <Row label="Frete" value={shippingCents === 0 ? (shipping ? "Grátis" : "—") : formatBRL(shippingCents)} />
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span>
            <span className="text-primary">{formatBRL(total)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-on-error-container bg-error-container rounded-md px-md py-2">{error}</p>}

        <button
          onClick={submit}
          disabled={pending}
          className="bg-primary text-white font-medium py-md rounded-md hover:bg-primary-container transition-colors disabled:opacity-60"
        >
          {pending ? "Processando..." : "Confirmar e pagar"}
        </button>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-on-surface-variant">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  onBlur,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-sm text-on-surface-variant">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="border border-outline-variant rounded-md px-md py-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
