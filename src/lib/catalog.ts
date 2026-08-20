import { prisma } from "@/lib/prisma";
import type { ProductCardData } from "@/components/ProductCard";

type ProductWithRels = {
  slug: string;
  name: string;
  description: string;
  origin: "BRASIL" | "JAPAO";
  category: { name: string };
  images: { url: string }[];
  variants: { id: string; name: string; priceCents: number; compareAtCents: number | null }[];
};

export function toCard(p: ProductWithRels): ProductCardData {
  const v = p.variants[0];
  return {
    slug: p.slug,
    name: p.name,
    category: p.category.name,
    origin: p.origin,
    image: p.images[0]?.url ?? "",
    variantId: v?.id ?? "",
    variantName: v?.name ?? "",
    priceCents: v?.priceCents ?? 0,
    compareAtCents: v?.compareAtCents ?? null,
  };
}

const include = {
  category: true,
  images: { orderBy: { order: "asc" as const } },
  variants: { orderBy: { priceCents: "asc" as const } },
};

export async function getFeatured(limit = 8) {
  const products = await prisma.product.findMany({
    where: { active: true, featured: true },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCard);
}

export async function getNewest(limit = 8) {
  const products = await prisma.product.findMany({
    where: { active: true },
    include,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCard);
}

export async function getByCategory(slug: string) {
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return null;
  const products = await prisma.product.findMany({
    where: { active: true, categoryId: category.id },
    include,
    orderBy: { createdAt: "desc" },
  });
  return { category, products: products.map(toCard) };
}

export async function searchProducts(q: string) {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    include,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCard);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      ...include,
      reviews: { where: { approved: true }, include: { user: { select: { name: true } } } },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}
