import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { PageHeader, CardSection, Field, Input, EmptyState } from "@/components/admin/ui";
import { SaveButton, ConfirmSubmitButton } from "@/components/admin/FormControls";
import MediaPicker from "@/components/admin/MediaPicker";
import { upsertCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <PageHeader title="Categorias" description={`${categories.length} categoria(s) cadastrada(s).`} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-start">
        <CardSection title="Categorias existentes">
          {categories.length === 0 ? (
            <EmptyState icon="category" title="Nenhuma categoria ainda" description="Crie a primeira categoria ao lado." />
          ) : (
            <div className="flex flex-col divide-y divide-outline-variant/50">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center gap-3 py-2.5">
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-surface-container shrink-0">
                    {c.image && <Image src={c.image} alt={c.name} fill sizes="44px" className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    <div className="text-xs text-on-surface-variant">{c._count.products} produto(s)</div>
                  </div>
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    {c._count.products > 0 ? (
                      <span className="text-xs text-on-surface-variant" title="Remova os produtos desta categoria primeiro">
                        Em uso
                      </span>
                    ) : (
                      <ConfirmSubmitButton confirmMessage={`Remover a categoria "${c.name}"?`}>
                        Remover
                      </ConfirmSubmitButton>
                    )}
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardSection>

        <CardSection title="Nova categoria">
          <form action={upsertCategory} className="flex flex-col gap-md">
            <Field label="Nome">
              <Input name="name" required placeholder="Ex: Proteção Solar" />
            </Field>
            <MediaPicker name="image" label="Imagem (opcional)" />
            <SaveButton label="Criar categoria" />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
