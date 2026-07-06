"use client";

import { useState } from "react";
import { useCart } from "@/stores/cart";

type Variant = { id: string; name: string; priceCents: number };

export default function AddToCart({
  productSlug,
  name,
  image,
  variants,
}: {
  productSlug: string;
  name: string;
  image: string;
  variants: Variant[];
}) {
  const add = useCart((s) => s.add);
  const [variantId, setVariantId] = useState(variants[0]?.id);
  const [qty, setQty] = useState(1);
  const variant = variants.find((v) => v.id === variantId) ?? variants[0];

  return (
    <div className="flex flex-col gap-md">
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setVariantId(v.id)}
              className={`px-md py-2 rounded-full border text-sm ${
                v.id === variantId
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant text-on-surface-variant"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-md">
        <div className="flex items-center border border-outline-variant rounded-md">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10">−</button>
          <span className="w-10 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10">+</button>
        </div>
        <button
          onClick={() =>
            add(
              {
                variantId: variant.id,
                productSlug,
                name,
                variantName: variant.name,
                priceCents: variant.priceCents,
                image,
              },
              qty,
            )
          }
          className="flex-1 bg-primary text-white font-medium py-md rounded-md hover:bg-primary-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">add_shopping_cart</span>
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
