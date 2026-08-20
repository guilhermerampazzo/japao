/**
 * Money helpers. Prices are ALWAYS stored as integer cents to avoid
 * floating-point errors. Format for display only (Brazilian Real).
 */
export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Converte centavos (R$) em valor em dólar e formata. usdRate = R$ por US$. */
export function formatUSD(cents: number, usdRate: number): string {
  const usd = cents / 100 / (usdRate > 0 ? usdRate : 1);
  return usd.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function centsToReais(cents: number): number {
  return cents / 100;
}

export function reaisToCents(reais: number): number {
  return Math.round(reais * 100);
}

/** Percentage discount between a comparison ("de") and current ("por") price. */
export function discountPercent(compareCents: number, priceCents: number): number {
  if (!compareCents || compareCents <= priceCents) return 0;
  return Math.round(((compareCents - priceCents) / compareCents) * 100);
}
