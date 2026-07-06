import Link from "next/link";
import PaymentIcons from "./PaymentIcons";
import SecuritySeals from "./SecuritySeals";

export type FooterPageLink = { slug: string; title: string };

export default function Footer({
  storeName,
  footerAbout,
  pages,
}: {
  storeName: string;
  footerAbout: string;
  pages: FooterPageLink[];
}) {
  return (
    <footer className="w-full mt-xl bg-surface-container border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-lg py-xl max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-md">
          <div className="font-display text-xl font-bold text-primary">{storeName}</div>
          <p className="text-sm text-on-surface-variant">{footerAbout}</p>
        </div>
        <div className="flex flex-col gap-md">
          <span className="font-bold text-on-surface">Links Úteis</span>
          <nav className="flex flex-col gap-sm">
            {pages.map((p) => (
              <Link
                key={p.slug}
                className="text-sm text-on-surface-variant hover:text-primary"
                href={`/pagina/${p.slug}`}
              >
                {p.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-md">
          <span className="font-bold text-on-surface">Métodos de Pagamento</span>
          <PaymentIcons />
        </div>
        <div className="flex flex-col gap-md">
          <span className="font-bold text-on-surface">Selos de Segurança</span>
          <SecuritySeals />
        </div>
      </div>
      <div className="bg-surface-container-highest py-md text-center">
        <p className="text-sm text-on-surface-variant">
          © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
