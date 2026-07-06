"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Pedidos", href: "/admin/pedidos", icon: "receipt_long" },
  { label: "Produtos", href: "/admin/produtos", icon: "inventory_2" },
  { label: "Categorias", href: "/admin/categorias", icon: "category" },
  { label: "Cupons", href: "/admin/cupons", icon: "sell" },
  { label: "Páginas", href: "/admin/paginas", icon: "article" },
  { label: "Aparência", href: "/admin/aparencia", icon: "palette" },
  { label: "Menu", href: "/admin/menu", icon: "menu" },
  { label: "Configurações", href: "/admin/config", icon: "settings" },
  { label: "Mídia", href: "/admin/midia", icon: "photo_library" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

export default function AdminSidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-60 shrink-0 md:h-[calc(100vh-5rem)] md:sticky md:top-20 border-b md:border-b-0 md:border-r border-outline-variant bg-white">
      <div className="px-md py-md border-b border-outline-variant md:border-b-0">
        <div className="font-display text-lg font-bold text-primary">Painel Admin</div>
        <div className="text-xs text-on-surface-variant truncate">{userName}</div>
      </div>
      <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-2 py-2 gap-1 md:gap-0.5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap text-on-surface-variant hover:bg-surface-container mt-0 md:mt-2 md:border-t md:border-outline-variant md:pt-3"
        >
          <span className="material-symbols-outlined text-[20px]">storefront</span>
          Ver loja
        </Link>
      </nav>
    </aside>
  );
}
