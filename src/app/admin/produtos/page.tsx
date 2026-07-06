import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import { PageHeader, LinkButton, Card, Table, Th, Td, Badge, EmptyState } from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/FormControls";
import { deleteProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { category: true, variants: true, images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Produtos"
        description={`${products.length} produto(s) ativo(s).`}
        action={
          <LinkButton href="/admin/produtos/novo" icon="add">
            Novo produto
          </LinkButton>
        }
      />
      <Card className="p-lg">
        {products.length === 0 ? (
          <EmptyState
            icon="inventory_2"
            title="Nenhum produto cadastrado"
            description="Crie o primeiro produto da sua loja."
            action={
              <LinkButton href="/admin/produtos/novo" icon="add">
                Novo produto
              </LinkButton>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Produto</Th>
                <Th>Categoria</Th>
                <Th>Preço</Th>
                <Th>Estoque</Th>
                <Th>Destaque</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const v = p.variants[0];
                return (
                  <tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-surface-container shrink-0">
                          {p.images[0] && (
                            <Image src={p.images[0].url} alt={p.name} fill sizes="40px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </Td>
                    <Td className="text-on-surface-variant">{p.category.name}</Td>
                    <Td className="text-primary font-semibold">{v ? formatBRL(v.priceCents) : "—"}</Td>
                    <Td>
                      <Badge tone={(v?.stock ?? 0) <= 5 ? "danger" : "neutral"}>{v?.stock ?? 0} un.</Badge>
                    </Td>
                    <Td>{p.featured ? <Badge tone="success">Sim</Badge> : <span className="text-on-surface-variant">—</span>}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <a href={`/admin/produtos/${p.id}`} className="text-primary text-sm font-medium hover:underline">
                          Editar
                        </a>
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={p.id} />
                          <ConfirmSubmitButton confirmMessage={`Remover "${p.name}"? Ele deixará de aparecer na loja.`}>
                            Remover
                          </ConfirmSubmitButton>
                        </form>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
