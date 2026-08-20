import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import CartDrawer from "@/components/CartDrawer";
import SearchOverlay from "@/components/SearchOverlay";
import { getSiteSettings, getNavItems } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { CurrencyProvider } from "@/lib/currency-client";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, navItems, pages] = await Promise.all([
    getSiteSettings(),
    getNavItems(),
    prisma.page.findMany({
      where: { published: true },
      select: { slug: true, title: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return (
    <html lang="pt-BR" className={`${poppins.variable} ${inter.variable} h-full antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <CurrencyProvider>
          <Header storeName={settings.storeName} navItems={navItems} />
          <main className="pt-20 flex-1">{children}</main>
          <Footer storeName={settings.storeName} footerAbout={settings.footerAbout} pages={pages} />
          <CartDrawer />
          <SearchOverlay />
          <WhatsAppFab number={settings.whatsappNumber} message={settings.whatsappMessage} />
        </CurrencyProvider>
      </body>
    </html>
  );
}
