export const dynamic = "force-dynamic";

import Link from "next/link";
import { searchProducts } from "@/lib/catalog";
import ProductGrid from "@/components/ProductGrid";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const products = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-xl">
      <form action="/busca" className="mb-lg flex flex-col sm:flex-row gap-sm max-w-[36rem]">
        <input
          name="q"
          defaultValue={query}
          placeholder="Buscar produtos..."
          className="flex-1 border border-outline-variant rounded-md px-md py-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button className="bg-primary text-white px-lg py-sm sm:py-0 rounded-md font-medium">Buscar</button>
      </form>

      {!query ? (
        <p className="text-on-surface-variant">Digite algo para buscar produtos.</p>
      ) : products.length > 0 ? (
        <>
          <p className="text-on-surface-variant mb-md">
            {products.length} resultado(s) para <strong>&ldquo;{query}&rdquo;</strong>
          </p>
          <ProductGrid products={products} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-md py-xl text-center">
          <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
          <p className="text-on-surface-variant">
            Nenhum produto encontrado para <strong>&ldquo;{query}&rdquo;</strong>.
          </p>
          <Link href="/" className="text-primary font-medium">Voltar para a home</Link>
        </div>
      )}
    </div>
  );
}
