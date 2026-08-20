"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { formatBRL, formatUSD } from "@/lib/money";

export type CurrencyMode = "BRL_ONLY" | "USD_ONLY" | "BOTH";

export type CurrencyConfig = {
  mode: CurrencyMode;
  usdRate: number;
};

const DEFAULT_CONFIG: CurrencyConfig = { mode: "BRL_ONLY", usdRate: 5 };

const CurrencyContext = createContext<CurrencyConfig>(DEFAULT_CONFIG);

/** Carrega a config de moeda do site uma única vez (cache na primeira montagem). */
export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<CurrencyConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    let active = true;
    fetch("/api/currency")
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        const mode: CurrencyMode =
          d?.mode === "USD_ONLY" || d?.mode === "BOTH" ? d.mode : "BRL_ONLY";
        const usdRate = Number(d?.usdRate);
        setCfg({ mode, usdRate: usdRate > 0 ? usdRate : DEFAULT_CONFIG.usdRate });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return <CurrencyContext.Provider value={cfg}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyConfig {
  return useContext(CurrencyContext);
}

/** Formatadores prontos baseados na config atual. */
export function usePriceText(cents: number): { brl: string; usd: string } {
  const { usdRate } = useCurrency();
  return {
    brl: formatBRL(cents),
    usd: formatUSD(cents, usdRate),
  };
}
