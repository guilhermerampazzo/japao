"use client";

import Link from "next/link";
import Image from "next/image";
import { formatBRL, discountPercent } from "@/lib/money";
import { useCart } from "@/stores/cart";

export type ProductCardData = {
  slug: string;
  name: string;
  category: string;
  image: string;
  variantId: string;
  variantName: string;
  priceCents: number;
  compareAtCents: number | null;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const add = useCart((s) => s.add);
  const discount = product.compareAtCents
    ? discountPercent(product.compareAtCents, product.priceCents)
    : 0;

  return (
    <div className="bg-white rounded-lg overflow-hidden product-card-shadow group cursor-pointer flex flex-col">
      <Link href={`/produto/${product.slug}`} className="relative aspect-square block">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover"
        />
        {discount > 0 && (
          <div className="absolute top-sm right-sm bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}
      </Link>
      <div className="p-sm sm:p-md flex flex-col gap-1 flex-1">
        <span className="text-[12px] text-on-surface-variant uppercase tracking-wider">{product.category}</span>
        <Link href={`/produto/${product.slug}`}>
          <h3 className="font-bold text-on-surface leading-tight min-h-10 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-1">
          <span className="text-primary font-semibold text-lg sm:text-xl">{formatBRL(product.priceCents)}</span>
          {product.compareAtCents && (
            <span className="text-xs text-on-surface-variant line-through">
              {formatBRL(product.compareAtCents)}
            </span>
          )}
        </div>
        <button
          onClick={() =>
            add({
              variantId: product.variantId,
              productSlug: product.slug,
              name: product.name,
              variantName: product.variantName,
              priceCents: product.priceCents,
              image: product.image,
            })
          }
          className="mt-auto bg-primary text-white text-sm font-medium py-2 rounded-md hover:bg-primary-container transition-colors flex items-center justify-center gap-1 min-h-10"
        >
          <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          Adicionar
        </button>
      </div>
    </div>
  );
}
