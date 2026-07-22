"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useCart } from "@/stores/cart";
import { useUI } from "@/stores/ui";
import { formatBRL } from "@/lib/money";

export type NavItemData = { label: string; href: string };

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function Header({
  storeName,
  navItems,
}: {
  storeName: string;
  navItems: NavItemData[];
}) {
  const { toggle, count, subtotalCents } = useCart();
  const openSearch = useUI((s) => s.openSearch);
  const isClient = useIsClient();
  const itemCount = isClient ? count() : 0;
  const subtotal = isClient ? subtotalCents() : 0;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/95 glass-header border-b border-outline-variant/30 shadow-sm h-20">
      <div className="flex justify-between items-center gap-sm sm:gap-md px-margin-mobile sm:px-lg h-full max-w-[1200px] mx-auto">
        <Link href="/" className="flex items-center shrink-0" aria-label={storeName}>
          <Image
            src="/logo.png"
            alt={storeName}
            width={160}
            height={160}
            priority
            className="h-14 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-md">
          {navItems.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors duration-200"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-sm">
          <button
            onClick={openSearch}
            aria-label="Buscar"
            className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          <Link
            href="/conta"
            className="text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">person</span>
          </Link>
          <button
            onClick={toggle}
            aria-label="Abrir carrinho"
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-all p-2 rounded-full hover:bg-surface-container relative"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="hidden sm:block text-[10px] font-bold">{formatBRL(subtotal)}</span>
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
