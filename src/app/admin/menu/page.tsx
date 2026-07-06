import { getNavItems } from "@/lib/settings";
import { PageHeader, CardSection, Field, Input, EmptyState } from "@/components/admin/ui";
import { SaveButton, ConfirmSubmitButton } from "@/components/admin/FormControls";
import { createNavItem, deleteNavItem, moveNavItem } from "../config/actions";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const items = await getNavItems();

  return (
    <div className="max-w-[42rem]">
      <PageHeader title="Menu do Topo" description="Os links exibidos no cabeçalho da loja, na ordem abaixo." />

      <div className="flex flex-col gap-lg">
        <CardSection title="Itens atuais">
          {items.length === 0 ? (
            <EmptyState icon="menu" title="Nenhum item no menu" description="Adicione o primeiro item abaixo." />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/50">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-on-surface-variant font-mono truncate">{item.href}</div>
                  </div>
                  <div className="flex gap-1">
                    <form action={moveNavItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        disabled={idx === 0}
                        className="w-7 h-7 rounded-md border border-outline-variant disabled:opacity-30 flex items-center justify-center hover:bg-surface-container"
                        title="Mover para cima"
                      >
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_up</span>
                      </button>
                    </form>
                    <form action={moveNavItem}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        disabled={idx === items.length - 1}
                        className="w-7 h-7 rounded-md border border-outline-variant disabled:opacity-30 flex items-center justify-center hover:bg-surface-container"
                        title="Mover para baixo"
                      >
                        <span className="material-symbols-outlined text-[16px]">keyboard_arrow_down</span>
                      </button>
                    </form>
                  </div>
                  <form action={deleteNavItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmitButton confirmMessage={`Remover "${item.label}" do menu?`}>
                      Remover
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardSection>

        <CardSection title="Adicionar item">
          <form action={createNavItem} className="flex flex-col gap-md">
            <Field label="Rótulo">
              <Input name="label" placeholder="Ex: Promoções" required />
            </Field>
            <Field label="Link">
              <Input name="href" placeholder="/categoria/kits" required />
            </Field>
            <SaveButton label="Adicionar" />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
