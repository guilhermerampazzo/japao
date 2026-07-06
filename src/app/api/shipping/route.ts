import { NextResponse } from "next/server";
import { quoteShipping } from "@/lib/shipping";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const cep = String(body?.cep ?? "").replace(/\D/g, "");
  const subtotalCents = Number(body?.subtotalCents ?? 0);
  const weightGrams = Number(body?.weightGrams ?? 300);
  if (cep.length !== 8) {
    return NextResponse.json({ error: "CEP inválido" }, { status: 400 });
  }
  const options = await quoteShipping(cep, weightGrams, subtotalCents);
  return NextResponse.json({ options });
}
