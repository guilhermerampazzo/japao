import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProduct() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-md">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para produtos
      </Link>
      <PageHeader title="Novo Produto" description="Preencha as informações abaixo para criar um produto." />
      <ProductForm categories={categories} product={null} />
    </div>
  );
}
