import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findUnique({ where: { id }, include: { variants: true, images: { orderBy: { order: "asc" } } } }),
  ]);
  if (!product) notFound();
  const v = product.variants[0];

  return (
    <div>
      <Link href="/admin/produtos" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-md">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para produtos
      </Link>
      <PageHeader title="Editar Produto" description={product.name} />
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          descriptionHtml: product.descriptionHtml ?? `<p>${product.description}</p>`,
          categoryId: product.categoryId,
          featured: product.featured,
          origin: product.origin,
          priceCents: v?.priceCents ?? 0,
          compareAtCents: v?.compareAtCents ?? null,
          stock: v?.stock ?? 0,
          image: product.images[0]?.url ?? "",
        }}
      />
    </div>
  );
}
