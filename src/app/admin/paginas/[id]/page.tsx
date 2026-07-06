import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import PageForm from "../PageForm";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <Link href="/admin/paginas" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-md">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para páginas
      </Link>
      <PageHeader title="Editar Página" description={page.title} />
      <PageForm page={page} />
    </div>
  );
}
