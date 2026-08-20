export const dynamic = "force-dynamic";

import Image from "next/image";
import { notFound } from "next/navigation";
import { FiTruck, FiMapPin } from "react-icons/fi";
import { getProductBySlug } from "@/lib/catalog";
import { discountPercent } from "@/lib/money";
import { RichText } from "@/lib/richtext";
import AddToCart from "@/components/AddToCart";
import PriceShow from "@/components/PriceShow";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const variant = product.variants[0];
  const discount = variant.compareAtCents
    ? discountPercent(variant.compareAtCents, variant.priceCents)
    : 0;

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg md:gap-xl">
        {/* Galeria */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-container">
          {product.images[0] && (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          )}
          {discount > 0 && (
            <div className="absolute top-md right-md bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-md">
          <span className="text-sm text-on-surface-variant uppercase tracking-wider">
            {product.category.name}
          </span>
          <h1 className="font-display text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-1 text-primary">
            {"★★★★★".split("").map((s, i) => (
              <span key={i}>{s}</span>
            ))}
            <span className="text-on-surface-variant text-sm ml-2">
              {product.ratingAvg.toFixed(1)} ({product.reviews.length} avaliações)
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <PriceShow
              priceCents={variant.priceCents}
              compareAtCents={variant.compareAtCents}
              className="text-primary font-semibold text-3xl"
            />
          </div>
          {product.origin === "BRASIL" ? (
            <span className="inline-flex items-center gap-2 self-start bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
              <FiMapPin className="w-3.5 h-3.5" />
              Pronta entrega no Brasil
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 self-start bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
              <FiTruck className="w-3.5 h-3.5" />
              Direto do Japão
            </span>
          )}
          {product.descriptionHtml ? (
            <RichText html={product.descriptionHtml} />
          ) : (
            <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
          )}

          <AddToCart
            productSlug={product.slug}
            name={product.name}
            image={product.images[0]?.url ?? ""}
            origin={product.origin}
            variants={product.variants.map((v) => ({
              id: v.id,
              name: v.name,
              priceCents: v.priceCents,
            }))}
          />
        </div>
      </div>

      {/* Avaliações */}
      {product.reviews.length > 0 && (
        <section className="mt-xl">
          <h2 className="font-display text-2xl font-bold mb-lg">Avaliações</h2>
          <div className="flex flex-col gap-md">
            {product.reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-lg p-md product-card-shadow">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.user.name}</span>
                  <span className="text-primary">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-on-surface-variant mt-1">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
