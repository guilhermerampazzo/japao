import { cache } from "react";
import { getSiteSettings } from "@/lib/settings";

/**
 * Módulo server-only: cotação do dólar (R$ por US$).
 * Se o admin definiu uma cotação fixa, usa ela. Senão busca em tempo real
 * (AwesomeAPI) com cache em memória de ~10 min e fallback para um valor padrão.
 */

export type CurrencyMode = "BRL_ONLY" | "USD_ONLY" | "BOTH";

const DEFAULT_USD_RATE = 5.0;
const RATE_TTL_MS = 10 * 60 * 1000;

let cachedRate: { rate: number; at: number } | null = null;

async function fetchLiveRate(): Promise<number> {
  if (cachedRate && Date.now() - cachedRate.at < RATE_TTL_MS) return cachedRate.rate;

  // Fonte primária: open.er-api.com (gratuita, sem chave e sem limite prático).
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    const bid = Number(data?.rates?.BRL);
    if (res.ok && bid && bid > 0) {
      cachedRate = { rate: bid, at: Date.now() };
      return bid;
    }
  } catch {
    // continua para o fallback
  }

  // Fallback: AwesomeAPI (pode ter quota 429 às vezes)
  try {
    const res = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL", {
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json();
    const bid = Number(data?.["USDBRL"]?.bid);
    if (res.ok && bid && bid > 0) {
      cachedRate = { rate: bid, at: Date.now() };
      return bid;
    }
  } catch {
    // sem internet / timeout — usa cache ou padrão abaixo
  }

  if (cachedRate) return cachedRate.rate;
  return DEFAULT_USD_RATE;
}

export const resolveCurrencyConfig = cache(async () => {
  const settings = await getSiteSettings();
  const mode = (
    settings.currencyDisplay ?? "BRL_ONLY"
  ) as CurrencyMode;

  let usdRate = settings.usdRateCustom ?? 0;
  if (!(usdRate > 0)) {
    usdRate = await fetchLiveRate();
  }
  return { mode, usdRate };
});
