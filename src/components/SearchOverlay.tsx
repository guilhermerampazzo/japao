"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUI } from "@/stores/ui";
import { formatBRL } from "@/lib/money";
import type { ProductCardData } from "@/components/ProductCard";

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Foco ao abrir + fechar no Esc
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
  }, [searchOpen, closeSearch]);

  // Busca com debounce
  useEffect(() => {
    if (!searchOpen) return;
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`).then((r) => r.json());
        setResults(res.products ?? []);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [q, searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      setQ("");
      setResults([]);
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  function goToResults() {
    if (q.trim()) {
      closeSearch();
      router.push(`/busca?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex justify-center pt-24 px-lg bg-black/40" onClick={closeSearch}>
      <div
        className="w-full max-w-[640px] h-fit bg-surface rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-md border-b border-outline-variant">
          <span className="material-symbols-outlined text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
            placeholder="Buscar produtos..."
            className="flex-1 py-md bg-transparent outline-none text-lg"
          />
          <button onClick={closeSearch} aria-label="Fechar busca" className="p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim().length < 2 && (
            <p className="p-md text-sm text-on-surface-variant">Digite ao menos 2 letras para buscar.</p>
          )}
          {q.trim().length >= 2 && !loading && results.length === 0 && (
            <p className="p-md text-sm text-on-surface-variant">Nenhum produto encontrado.</p>
          )}
          {results.map((p) => (
            <Link
              key={p.slug}
              href={`/produto/${p.slug}`}
              onClick={closeSearch}
              className="flex items-center gap-md px-md py-2 hover:bg-surface-container transition-colors"
            >
              <div className="relative w-12 h-12 rounded-md overflow-hidden bg-surface-container shrink-0">
                <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-on-surface-variant">{p.category}</div>
              </div>
              <span className="text-primary font-semibold text-sm">{formatBRL(p.priceCents)}</span>
            </Link>
          ))}
          {results.length > 0 && (
            <button
              onClick={goToResults}
              className="w-full text-center text-sm text-primary font-medium py-md hover:bg-surface-container"
            >
              Ver todos os resultados
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
