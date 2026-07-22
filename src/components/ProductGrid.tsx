import ProductCard, { type ProductCardData } from "./ProductCard";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md md:gap-gutter">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
