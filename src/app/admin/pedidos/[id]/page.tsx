import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, CardSection, Badge } from "@/components/admin/ui";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE, PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/labels";
import { updateOrderStatus } from "../../actions";

export const dynamic = "force-dynamic";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      items: true,
      payment: true,
      coupon: true,
    },
  });
  if (!order) notFound();

  return (
    <div className="max-w-[48rem]">
      <Link href="/admin/pedidos" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-md">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para pedidos
      </Link>

      <PageHeader
        title={`Pedido #${order.number}`}
        description={`Criado em ${order.createdAt.toLocaleDateString("pt-BR")}`}
        action={
          <div className="flex items-center gap-2">
            <Badge tone={ORDER_STATUS_TONE[order.status] ?? "neutral"}>{ORDER_STATUS_LABELS[order.status]}</Badge>
            <form action={updateOrderStatus} className="flex gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select name="status" defaultValue={order.status} className="border border-outline-variant rounded-lg px-3 py-2 text-sm bg-white">
                {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-container">
                Atualizar
              </button>
            </form>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-lg">
        <CardSection title="Cliente">
          <p className="text-sm font-medium">{order.user.name}</p>
          <p className="text-sm text-on-surface-variant">{order.user.email}</p>
          {order.user.phone && <p className="text-sm text-on-surface-variant">{order.user.phone}</p>}
        </CardSection>

        <CardSection title="Endereço de Entrega">
          <p className="text-sm">{order.shipStreet}, {order.shipNumber} {order.shipComplement}</p>
          <p className="text-sm text-on-surface-variant">{order.shipDistrict} — {order.shipCity}/{order.shipState}</p>
          <p className="text-sm text-on-surface-variant">CEP {order.shipCep}</p>
        </CardSection>
      </div>

      <CardSection title="Itens do pedido" >
        <div className="flex flex-col divide-y divide-outline-variant/50">
          {order.items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm py-2">
              <span>{i.productName} <span className="text-on-surface-variant">({i.variantName})</span> × {i.quantity}</span>
              <span className="font-medium">{formatBRL(i.priceCents * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-outline-variant mt-3 pt-3 flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>Subtotal</span><span>{formatBRL(order.subtotalCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between text-on-surface-variant">
              <span>Desconto {order.coupon ? `(${order.coupon.code})` : ""}</span>
              <span>-{formatBRL(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-on-surface-variant">
            <span>Frete</span><span>{formatBRL(order.shippingCents)}</span>
          </div>
          <div className="flex justify-between font-bold text-base mt-1 pt-1 border-t border-outline-variant">
            <span>Total</span><span className="text-primary">{formatBRL(order.totalCents)}</span>
          </div>
        </div>
      </CardSection>

      <div className="mt-lg">
        <CardSection title="Pagamento">
          {order.payment ? (
            <div className="text-sm flex flex-col gap-1">
              <div className="flex justify-between"><span className="text-on-surface-variant">Método</span><span>{PAYMENT_METHOD_LABELS[order.payment.method]}</span></div>
              <div className="flex justify-between"><span className="text-on-surface-variant">Status</span><span>{PAYMENT_STATUS_LABELS[order.payment.status]}</span></div>
              {order.payment.providerPaymentId && (
                <div className="flex justify-between"><span className="text-on-surface-variant">ID no provedor</span><span className="font-mono text-xs">{order.payment.providerPaymentId}</span></div>
              )}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Nenhum pagamento registrado ainda.</p>
          )}
        </CardSection>
      </div>
    </div>
  );
}
