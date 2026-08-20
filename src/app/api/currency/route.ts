import { NextResponse } from "next/server";
import { resolveCurrencyConfig } from "@/lib/currency-server";

export const dynamic = "force-dynamic";

/** Retorna a config de moeda exibida no site (modo + cotação do dólar). */
export async function GET() {
  try {
    const { mode, usdRate } = await resolveCurrencyConfig();
    return NextResponse.json({ mode, usdRate });
  } catch {
    // Fallback: se não conseguir ler a config (ex.: banco indisponível), usa padrão
    return NextResponse.json({ mode: "BRL_ONLY", usdRate: 5 });
  }
}
