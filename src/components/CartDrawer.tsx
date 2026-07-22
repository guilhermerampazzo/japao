"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useCart } from "@/stores/cart";
import { formatBRL } from "@/lib/money";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotalCents } = useCart();
  const isClient = useIsClient();
  if (!isClient) return null;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[28rem] bg-surface z-[70] shadow-2xl flex flex-col transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-md border-b border-outline-variant">
          <h2 className="font-display text-xl font-bold">Meu Carrinho</h2>
          <button onClick={close} aria-label="Fechar carrinho" className="p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-md text-center p-lg">
            <span className="material-symbols-outlined text-6xl text-outline">shopping_cart</span>
            <p className="text-on-surface-variant">Seu carrinho está vazio.</p>
            <Link href="/" onClick={close} className="bg-primary text-white px-lg py-sm rounded-md font-medium">
              Explorar produtos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-md flex flex-col gap-md">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-sm">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0 bg-surface-container">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="font-medium text-sm leading-tight">{item.name}</span>
                    <span className="text-xs text-on-surface-variant">{item.variantName}</span>
                    <span className="text-primary font-semibold mt-1">{formatBRL(item.priceCents)}</span>
                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => setQty(item.variantId, item.quantity - 1)} className="w-7 h-7 rounded border border-outline-variant flex items-center justify-center">−</button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => setQty(item.variantId, item.quantity + 1)} className="w-7 h-7 rounded border border-outline-variant flex items-center justify-center">+</button>
                      <button onClick={() => remove(item.variantId)} aria-label="Remover" className="ml-auto text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-outline-variant p-md flex flex-col gap-sm">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span className="text-primary font-semibold text-xl">{formatBRL(subtotalCents())}</span>
              </div>
              <Link href="/checkout" onClick={close} className="bg-primary text-white text-center py-md rounded-md font-medium hover:bg-primary-container transition-colors">
                Finalizar compra
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
