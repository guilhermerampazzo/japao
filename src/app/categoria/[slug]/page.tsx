export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getByCategory } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getByCategory(slug);
  if (!data) notFound();

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-xl">
      <div className="mb-lg">
        <h1 className="font-display text-3xl font-bold text-on-background">{data.category.name}</h1>
        <div className="h-1 w-20 bg-primary mt-2" />
        <p className="text-on-surface-variant mt-2">
          {data.products.length} produto(s) encontrado(s)
        </p>
      </div>
      {data.products.length > 0 ? (
        <ProductGrid products={data.products} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
          <span className="material-symbols-outlined text-6xl text-outline">inventory_2</span>
          <p className="text-on-surface-variant">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
}
