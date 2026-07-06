import ProductCard, { type ProductCardData } from "./ProductCard";

export default function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
      {products.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
