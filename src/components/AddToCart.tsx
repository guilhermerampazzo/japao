"use client";

import { useState } from "react";
import { FiMapPin, FiTruck } from "react-icons/fi";
import { useCart } from "@/stores/cart";

type Variant = { id: string; name: string; priceCents: number };

const ORIGINS = [
  {
    value: "BRASIL" as const,
    label: "Pronta entrega no Brasil",
    hint: "Envio rápido do nosso estoque no Brasil",
    Icon: FiMapPin,
  },
  {
    value: "JAPAO" as const,
    label: "Direto do Japão",
    hint: "Importado a pedido, entrega em ~15-30 dias",
    Icon: FiTruck,
  },
];

export default function AddToCart({
  productSlug,
  name,
  image,
  origin,
  variants,
}: {
  productSlug: string;
  name: string;
  image: string;
  origin: "BRASIL" | "JAPAO";
  variants: Variant[];
}) {
  const add = useCart((s) => s.add);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [qty, setQty] = useState(1);
  const [chosenOrigin, setChosenOrigin] = useState<"BRASIL" | "JAPAO">(
    origin === "BRASIL" ? "BRASIL" : "JAPAO",
  );
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];

  return (
    <div className="flex flex-col gap-md">
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`px-md py-2 rounded-full border text-sm ${
                v.id === variantId
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      {/* Escolha de entrega (Brasil x Japão) — só quando o produto tem estoque no Brasil */}
      {origin === "BRASIL" && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-on-surface">Opção de entrega</span>
          {ORIGINS.map((o) => (
            <label
              key={o.value}
              className={`flex items-start gap-3 border rounded-lg px-md py-sm cursor-pointer transition-colors ${
                chosenOrigin === o.value
                  ? "border-primary bg-primary/5"
                  : "border-outline-variant hover:bg-surface-container"
              }`}
            >
              <input
                type="radio"
                name="origin"
                checked={chosenOrigin === o.value}
                onChange={() => setChosenOrigin(o.value)}
                className="mt-1 accent-[var(--color-primary)]"
              />
              <o.Icon className="w-5 h-5 mt-0.5 text-primary shrink-0" />
              <span className="flex flex-col">
                <span className="text-sm font-medium text-on-surface">{o.label}</span>
                <span className="text-xs text-on-surface-variant">{o.hint}</span>
              </span>
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center gap-md">
        <div className="flex items-center border border-outline-variant rounded-md">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10">−</button>
          <span className="w-10 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10">+</button>
        </div>
        <button
          onClick={() =>
            add(
              {
                variantId: variant.id,
                productSlug,
                name,
                variantName: variant.name,
                priceCents: variant.priceCents,
                image,
                origin: chosenOrigin,
              },
              qty,
            )
          }
          className="flex-1 bg-primary text-white font-medium py-md rounded-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
