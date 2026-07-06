import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, Card, Table, Th, Td, EmptyState } from "@/components/admin/ui";
import { ORDER_STATUS_LABELS } from "@/lib/labels";
import { updateOrderStatus } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } }, items: true },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Pedidos" description={`${orders.length} pedido(s) no total.`} />
      <Card className="p-lg">
        {orders.length === 0 ? (
          <EmptyState icon="receipt_long" title="Nenhum pedido ainda" description="Assim que uma venda for feita, ela aparece aqui." />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Pedido</Th>
                <Th>Cliente</Th>
                <Th className="text-center">Itens</Th>
                <Th>Total</Th>
                <Th>Data</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <Td>
                    <Link href={`/admin/pedidos/${o.id}`} className="text-primary font-medium hover:underline">
                      #{o.number}
                    </Link>
                  </Td>
                  <Td>
                    <div className="font-medium">{o.user.name}</div>
                    <div className="text-xs text-on-surface-variant">{o.user.email}</div>
                  </Td>
                  <Td className="text-center">{o.items.length}</Td>
                  <Td className="font-semibold text-primary">{formatBRL(o.totalCents)}</Td>
                  <Td className="text-on-surface-variant">{o.createdAt.toLocaleDateString("pt-BR")}</Td>
                  <Td>
                    <form action={updateOrderStatus} className="flex items-center gap-2">
                      <input type="hidden" name="orderId" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="border border-outline-variant rounded-md px-2 py-1 text-xs bg-white"
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <button className="text-primary hover:bg-surface-container rounded p-1" title="Atualizar status">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </button>
                    </form>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}

