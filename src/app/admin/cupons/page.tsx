import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, CardSection, Field, Input, Select, Badge, EmptyState } from "@/components/admin/ui";
import { SaveButton, ConfirmSubmitButton } from "@/components/admin/FormControls";
import { createCoupon, toggleCoupon, deleteCoupon } from "./actions";

export const dynamic = "force-dynamic";

export default async function CuponsPage() {
  const coupons = await prisma.coupon.findMany({
    where: { affiliateName: null },
    orderBy: { code: "asc" },
  });

  return (
    <div>
      <PageHeader title="Cupons" description={`${coupons.length} cupom(ns) cadastrado(s).`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-start">
        <CardSection title="Cupons existentes">
          {coupons.length === 0 ? (
            <EmptyState icon="sell" title="Nenhum cupom ainda" description="Crie o primeiro cupom ao lado." />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/50">
              {coupons.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-primary">{c.code}</div>
                    <div className="text-xs text-on-surface-variant">
                      {c.type === "PERCENT" ? `${c.value}%` : formatBRL(c.value)}
                      {c.minCents > 0 && ` · mín. ${formatBRL(c.minCents)}`}
                      {c.maxUses && ` · ${c.usedCount}/${c.maxUses} usos`}
                      {c.expiresAt && ` · até ${c.expiresAt.toLocaleDateString("pt-BR")}`}
                    </div>
                  </div>
                  <form action={toggleCoupon}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="active" value={String(c.active)} />
                    <button>
                      <Badge tone={c.active ? "success" : "neutral"}>{c.active ? "Ativo" : "Inativo"}</Badge>
                    </button>
                  </form>
                  <form action={deleteCoupon}>
                    <input type="hidden" name="id" value={c.id} />
                    <ConfirmSubmitButton confirmMessage={`Remover o cupom "${c.code}"?`}>
                      Remover
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardSection>

        <CardSection title="Novo cupom">
          <form action={createCoupon} className="flex flex-col gap-md">
            <Field label="Código">
              <Input name="code" placeholder="bemvindo10" required />
            </Field>
            <Field label="Tipo">
              <Select name="type">
                <option value="PERCENT">Percentual (%)</option>
                <option value="FIXED">Valor fixo (R$)</option>
              </Select>
            </Field>
            <Field label="Valor" hint="Percentual ou reais, conforme o tipo escolhido acima">
              <Input name="value" type="number" step="0.01" required />
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
            <SaveButton label="Criar cupom" />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
