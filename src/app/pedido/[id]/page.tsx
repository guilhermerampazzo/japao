import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Aguardando pagamento", color: "bg-secondary-container text-on-secondary-container" },
  PAID: { label: "Pagamento confirmado", color: "bg-tertiary-container/30 text-tertiary" },
  SHIPPED: { label: "Enviado", color: "bg-secondary-container text-on-secondary-container" },
  DELIVERED: { label: "Entregue", color: "bg-tertiary-container/30 text-tertiary" },
  CANCELED: { label: "Cancelado", color: "bg-error-container text-on-error-container" },
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order || order.userId !== session.user.id) notFound();

  const st = STATUS[order.status] ?? STATUS.PENDING;

  return (
    <div className="max-w-[720px] mx-auto px-lg py-xl">
      <div className="bg-white rounded-xl product-card-shadow p-lg text-center">
        <span className="material-symbols-outlined text-6xl text-tertiary">check_circle</span>
        <h1 className="font-display text-3xl font-bold mt-2">Pedido confirmado!</h1>
        <p className="text-on-surface-variant">
          Pedido <strong>#{order.number}</strong>
        </p>
        <span className={`inline-block mt-md text-sm px-3 py-1 rounded-full ${st.color}`}>{st.label}</span>

        <div className="mt-lg text-left border-t border-outline-variant pt-md flex flex-col gap-2">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span>{i.productName} × {i.quantity}</span>
              <span>{formatBRL(i.priceCents * i.quantity)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm text-on-surface-variant mt-2">
            <span>Frete</span><span>{order.shippingCents === 0 ? "Grátis" : formatBRL(order.shippingCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between text-sm text-on-surface-variant">
              <span>Desconto</span><span>-{formatBRL(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total</span><span className="text-primary">{formatBRL(order.totalCents)}</span>
          </div>
        </div>

        <div className="mt-lg flex gap-md justify-center">
          <Link href="/conta" className="text-primary font-medium">Ver meus pedidos</Link>
          <Link href="/" className="text-on-surface-variant">Continuar comprando</Link>
        </div>
      </div>
    </div>
  );
}
