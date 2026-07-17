import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, CardSection, Field, Input, Select, Badge, EmptyState, Table, Th, Td } from "@/components/admin/ui";
import { SaveButton, ConfirmSubmitButton } from "@/components/admin/FormControls";
import { createAffiliateCoupon, toggleAffiliateCoupon, deleteAffiliateCoupon } from "./actions";

export const dynamic = "force-dynamic";

const COUNTED_STATUSES = ["PAID", "SHIPPED", "DELIVERED"] as const;

export default async function AfiliadosPage() {
  const coupons = await prisma.coupon.findMany({
    where: { affiliateName: { not: null } },
    include: {
      orders: {
        where: { status: { in: [...COUNTED_STATUSES] } },
        select: { totalCents: true },
      },
    },
    orderBy: { affiliateName: "asc" },
  });

  const rows = coupons.map((c) => {
    const salesCount = c.orders.length;
    const revenueCents = c.orders.reduce((sum, o) => sum + o.totalCents, 0);
    const commissionCents = c.commissionPercent
      ? Math.round((revenueCents * c.commissionPercent) / 100)
      : 0;
    return { ...c, salesCount, revenueCents, commissionCents };
  });

  return (
    <div>
      <PageHeader
        title="Afiliados"
        description={`${coupons.length} cupom(ns) de afiliado cadastrado(s).`}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-start">
        <CardSection title="Cupons de afiliado" description="Vendas e comissão calculadas sobre pedidos pagos.">
          {rows.length === 0 ? (
            <EmptyState icon="diversity_3" title="Nenhum afiliado ainda" description="Crie o primeiro cupom de afiliado ao lado." />
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Afiliado / Cupom</Th>
                  <Th>Comissão</Th>
                  <Th>Vendas</Th>
                  <Th>Faturamento</Th>
                  <Th>A repassar</Th>
                  <Th>Status</Th>
                  <Th>{" "}</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <Td>
                      <div className="font-medium text-on-surface">{c.affiliateName}</div>
                      <div className="text-xs text-primary font-bold">{c.code}</div>
                    </Td>
                    <Td>{c.commissionPercent ? `${c.commissionPercent}%` : "—"}</Td>
                    <Td>{c.salesCount}</Td>
                    <Td>{formatBRL(c.revenueCents)}</Td>
                    <Td className="font-medium">{formatBRL(c.commissionCents)}</Td>
                    <Td>
                      <form action={toggleAffiliateCoupon}>
                        <input type="hidden" name="id" value={c.id} />
                        <input type="hidden" name="active" value={String(c.active)} />
                        <button>
                          <Badge tone={c.active ? "success" : "neutral"}>{c.active ? "Ativo" : "Inativo"}</Badge>
                        </button>
                      </form>
                    </Td>
                    <Td>
                      <form action={deleteAffiliateCoupon}>
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmSubmitButton confirmMessage={`Remover o cupom de afiliado "${c.code}"?`}>
                          Remover
                        </ConfirmSubmitButton>
                      </form>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </CardSection>

        <CardSection title="Novo cupom de afiliado">
          <form action={createAffiliateCoupon} className="flex flex-col gap-md">
            <Field label="Nome do afiliado">
              <Input name="affiliateName" placeholder="Ex: Maria Influencer" required />
            </Field>
            <Field label="Código do cupom">
              <Input name="code" placeholder="maria10" required />
            </Field>
            <Field label="Tipo de desconto">
              <Select name="type">
                <option value="PERCENT">Percentual (%)</option>
                <option value="FIXED">Valor fixo (R$)</option>
              </Select>
            </Field>
            <Field label="Valor do desconto" hint="Percentual ou reais, conforme o tipo escolhido acima">
              <Input name="value" type="number" step="0.01" required />
            </Field>
            <Field label="Comissão do afiliado (%)" hint="Sobre o faturamento gerado pelo cupom">
              <Input name="commissionPercent" type="number" min="0" max="100" />
            </Field>
            <Field label="Valor mínimo do pedido (R$)" hint="Opcional">
              <Input name="minValue" type="number" step="0.01" />
            </Field>
            <Field label="Usos máximos" hint="Opcional">
              <Input name="maxUses" type="number" />
            </Field>
            <Field label="Validade" hint="Opcional">
              <Input name="expiresAt" type="date" />
            </Field>
            <SaveButton label="Criar cupom de afiliado" />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
