"use client";

import { useCurrency, type CurrencyConfig } from "@/lib/currency-client";
import { formatBRL, formatUSD } from "@/lib/money";

/**
 * Exibe preço(s) conforme a config de moeda do site:
 *  - BRL_ONLY: só R$
 *  - USD_ONLY: só US$
 *  - BOTH: R$ (destaque) + US$ (menor, à direita)
 */
export default function PriceShow({
  priceCents,
  compareAtCents,
  className,
}: {
  priceCents: number;
  compareAtCents?: number | null;
  className?: string;
}) {
  const { mode, usdRate } = useCurrency();
  return <PriceShowInner mode={mode} usdRate={usdRate} priceCents={priceCents} compareAtCents={compareAtCents} className={className} />;
}

function PriceShowInner({
  mode,
  usdRate,
  priceCents,
  compareAtCents,
  className,
}: {
  mode: CurrencyConfig["mode"];
  usdRate: number;
  priceCents: number;
  compareAtCents?: number | null;
  className?: string;
}) {
  const brl = formatBRL(priceCents);
  const usd = formatUSD(priceCents, usdRate);
  const compareBrl = compareAtCents ? formatBRL(compareAtCents) : null;
  const compareUsd = compareAtCents ? formatUSD(compareAtCents, usdRate) : null;

  if (mode === "USD_ONLY") {
    return (
      <span className={className}>
        <span>{usd}</span>
        {compareUsd && (
          <span className="ml-2 text-xs text-on-surface-variant line-through">{compareUsd}</span>
        )}
      </span>
    );
  }

  if (mode === "BOTH") {
    return (
      <span className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${className ?? ""}`}>
        <span>{brl}</span>
        <span className="text-xs font-normal text-on-surface-variant">{usd}</span>
        {compareBrl && (
          <span className="text-xs text-on-surface-variant line-through">{compareBrl}</span>
        )}
      </span>
    );
  }

  // BRL_ONLY
  return (
    <span className={className}>
      <span>{brl}</span>
      {compareBrl && (
        <span className="ml-2 text-xs text-on-surface-variant line-through">{compareBrl}</span>
      )}
    </span>
  );
}
