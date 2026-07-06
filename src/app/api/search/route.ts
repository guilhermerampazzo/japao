import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/catalog";

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ products: [] });
  const products = await searchProducts(q);
  return NextResponse.json({ products: products.slice(0, 8) });
}
