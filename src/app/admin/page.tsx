import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, Card, CardSection, Badge, EmptyState } from "@/components/admin/ui";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/labels";

export const dynamic = "force-dynamic";

const STATUS_ORDER = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"];

export default async function AdminDashboard() {
  const [revenueAgg, orderCountByStatus, lowStock, recentOrders, totalOrders] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { totalCents: true }, _count: true }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { name: true } } },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
    prisma.order.count(),
  ]);

  const revenueCents = revenueAgg._sum.totalCents ?? 0;
  const paidCount = revenueAgg._count;
  const avgTicketCents = paidCount > 0 ? Math.round(revenueCents / paidCount) : 0;
  const statusMap = Object.fromEntries(orderCountByStatus.map((s) => [s.status, s._count]));
  const maxStatusCount = Math.max(1, ...STATUS_ORDER.map((s) => statusMap[s] ?? 0));

  return (
    <div className="flex flex-col gap-lg">
      <PageHeader title="Dashboard" description="Visão geral da loja em tempo real." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <MetricCard icon="payments" label="Faturamento (pago)" value={formatBRL(revenueCents)} />
        <MetricCard icon="task_alt" label="Pedidos pagos" value={String(paidCount)} />
        <MetricCard icon="trending_up" label="Ticket médio" value={formatBRL(avgTicketCents)} />
        <MetricCard icon="receipt_long" label="Total de pedidos" value={String(totalOrders)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <CardSection title="Pedidos por status">
          <div className="flex flex-col gap-3">
            {STATUS_ORDER.map((status) => {
              const count = statusMap[status] ?? 0;
              return (
                <div key={status} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm text-on-surface-variant sm:w-40 shrink-0">
                    {ORDER_STATUS_LABELS[status]}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold sm:w-6 sm:text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </CardSection>

        <CardSection title="Estoque baixo" description="Produtos com 5 unidades ou menos.">
          {lowStock.length === 0 ? (
            <EmptyState icon="inventory" title="Estoque saudável" description="Nenhum produto com estoque baixo no momento." />
          ) : (
            <div className="flex flex-col gap-2">
              {lowStock.map((v) => (
                <div key={v.id} className="flex justify-between items-center gap-sm text-sm py-1">
                  <span className="text-on-surface">{v.product.name}</span>
                  <Badge tone="danger">{v.stock} un.</Badge>
                </div>
              ))}
            </div>
          )}
        </CardSection>
      </div>

      <Card className="p-lg">
        <div className="flex justify-between items-center mb-md">
          <h2 className="font-display text-lg font-bold">Últimos pedidos</h2>
          <Link href="/admin/pedidos" className="text-primary text-sm font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <EmptyState icon="receipt_long" title="Nenhum pedido ainda" description="Assim que uma venda for feita, ela aparece aqui." />
        ) : (
          <div className="flex flex-col divide-y divide-outline-variant/50">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/pedidos/${o.id}`}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm py-2.5 px-2 -mx-2 rounded-lg hover:bg-surface-container transition-colors"
              >
                <div>
                  <span className="font-medium">#{o.number}</span>
                  <span className="text-on-surface-variant"> — {o.user.name}</span>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <Badge tone={ORDER_STATUS_TONE[o.status] ?? "neutral"}>{ORDER_STATUS_LABELS[o.status]}</Badge>
                  <span className="font-semibold text-primary w-24 text-right">{formatBRL(o.totalCents)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function MetricCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <Card className="p-md flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <div className="text-xs text-on-surface-variant uppercase tracking-wide leading-tight">{label}</div>
        <div className="text-xl font-bold text-on-surface mt-1">{value}</div>
      </div>
    </Card>
  );
}
