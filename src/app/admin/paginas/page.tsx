import { prisma } from "@/lib/prisma";
import { PageHeader, LinkButton, Card, Table, Th, Td, Badge, EmptyState } from "@/components/admin/ui";
import { ConfirmSubmitButton } from "@/components/admin/FormControls";
import { deletePage } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPages() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <PageHeader
        title="Páginas"
        description={`${pages.length} página(s) de conteúdo.`}
        action={
          <LinkButton href="/admin/paginas/novo" icon="add">
            Nova página
          </LinkButton>
        }
      />
      <Card className="p-lg">
        {pages.length === 0 ? (
          <EmptyState
            icon="article"
            title="Nenhuma página criada"
            description="Crie páginas como Sobre, Termos ou Privacidade."
            action={
              <LinkButton href="/admin/paginas/novo" icon="add">
                Nova página
              </LinkButton>
            }
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Título</Th>
                <Th>URL</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p.id}>
                  <Td className="font-medium">{p.title}</Td>
                  <Td className="text-on-surface-variant font-mono text-xs">/pagina/{p.slug}</Td>
                  <Td>
                    <Badge tone={p.published ? "success" : "neutral"}>
                      {p.published ? "Publicada" : "Rascunho"}
                    </Badge>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-3">
                      <a href={`/admin/paginas/${p.id}`} className="text-primary text-sm font-medium hover:underline">
                        Editar
                      </a>
                      <form action={deletePage}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmitButton confirmMessage={`Remover a página "${p.title}"?`}>
                          Remover
                        </ConfirmSubmitButton>
                      </form>
                    </div>
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
