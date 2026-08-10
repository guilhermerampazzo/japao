export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import {
  FiShield,
  FiShoppingBag,
  FiSend,
  FiHeadphones,
  FiPackage,
  FiCheckCircle,
} from "react-icons/fi";
import { getFeatured, getNewest, getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import ProductGrid from "@/components/ProductGrid";

const DEFAULT_HERO_IMAGE = "/banner.jpeg";

const GUARANTEES = [
  { icon: FiShield, label: "Compra segura" },
  { icon: FiShoppingBag, label: "Produtos selecionados no Japão" },
  { icon: FiSend, label: "Enviamos para todo o Brasil" },
  { icon: FiHeadphones, label: "Atendimento personalizado" },
  { icon: FiPackage, label: "Embalagem protegida" },
] as const;

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Escolha seus produtos",
    description: "Navegue pelo site e encontre seus produtos favoritos.",
  },
  {
    step: "2",
    title: "Finalize sua compra",
    description: "Compre de forma simples e segura.",
  },
  {
    step: "3",
    title: "Preparamos seu pedido",
    description: "Conferimos cada item e realizamos uma embalagem cuidadosa.",
  },
  {
    step: "4",
    title: "Enviamos para você",
    description: "Seu pedido sai diretamente do Japão com toda segurança.",
  },
] as const;

const WHY_CHOOSE_US = [
  "Produtos originais",
  "Seleção cuidadosa",
  "Atendimento personalizado",
  "Compra segura",
  "Embalagem protegida",
  "Envio internacional",
  "Transparência em todo o processo",
] as const;

export default async function Home() {
  const [featured, newest, categories, settings] = await Promise.all([
    getFeatured(8),
    getNewest(8),
    getCategories(),
    getSiteSettings(),
  ]);

  const heroImage = settings.heroImageUrl || DEFAULT_HERO_IMAGE;

  return (
    <>
      {/* Hero */}
      <section className="relative w-full min-h-[520px] overflow-hidden bg-surface-container-low">
        {/* Imagem de fundo (metade direita no desktop) */}
        <div className="absolute right-0 top-0 h-full w-full md:w-1/2">
          <Image
            src={heroImage}
            alt={settings.heroTitle}
            fill
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Gradiente para o texto continuar legível no mobile */}
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/60 md:via-transparent to-transparent" />
        </div>

        <div className="relative max-w-[1200px] mx-auto flex items-center min-h-[520px] px-margin-mobile sm:px-lg py-xl">
          <div className="w-full md:w-1/2 z-10">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-md block">
              {settings.heroEyebrow}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-on-background mb-sm leading-tight">
              {settings.heroTitle}
            </h1>
            <p className="text-lg text-on-surface-variant mb-lg max-w-[28rem]">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-wrap items-center gap-md">
              <Link
                href={settings.heroCtaHref}
                className="inline-block bg-primary text-white font-medium px-xl py-md rounded-md hover:bg-primary-container transition-all shadow-lg"
              >
                {settings.heroCtaLabel}
              </Link>
              <Link
                href="/busca"
                className="inline-block bg-surface-container-lowest text-on-surface font-medium px-xl py-md rounded-md border border-outline-variant hover:border-primary hover:text-primary transition-all"
              >
                Ver Produtos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Barra de garantias */}
      <section className="bg-tertiary text-on-tertiary">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-md sm:gap-lg">
          {GUARANTEES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2">
              <Icon className="w-6 h-6 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categorias */}
      <section className="py-xl max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className="group flex flex-col items-center text-center gap-md">
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-secondary-container group-hover:border-primary transition-all duration-300 relative">
                {c.image && <Image src={c.image} alt={c.name} fill sizes="160px" className="object-cover" />}
              </div>
              <span className="font-display text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-xl bg-surface-container-lowest">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
          <div className="mb-lg text-center">
            <h2 className="font-display text-2xl font-bold text-on-background">Como Funciona</h2>
            <div className="h-1 w-20 bg-primary mt-2 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-sm">
                <div className="w-12 h-12 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-on-surface">{s.title}</h3>
                <p className="text-sm text-on-surface-variant">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Novidades */}
      <section className="py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
          <div className="mb-lg">
            <h2 className="font-display text-2xl font-bold text-on-background">Novidades imperdíveis</h2>
            <div className="h-1 w-20 bg-primary mt-2" />
          </div>
          <ProductGrid products={newest} />
        </div>
      </section>

      {/* Por que escolher a Japão nas Mãos */}
      <section className="py-xl bg-tertiary text-on-tertiary">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
          <div className="mb-lg text-center">
            <h2 className="font-display text-2xl font-bold">Por que escolher a Japão nas Mãos?</h2>
            <p className="text-sm text-on-tertiary/80 mt-2">
              Porque comprar diretamente do Japão faz toda a diferença.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md max-w-3xl mx-auto">
            {WHY_CHOOSE_US.map((item) => (
              <div key={item} className="flex items-center gap-sm">
                <FiCheckCircle className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner promocional */}
      {settings.promoActive && (
        <section className="py-xl">
          <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
            <div className="relative bg-secondary-container rounded-xl p-md sm:p-xl flex flex-col md:flex-row items-center gap-md sm:gap-xl overflow-hidden">
              <div className="relative z-10 w-full md:w-2/3">
                <div className="inline-block bg-primary text-white text-xs font-bold px-4 py-1 rounded-full mb-md">
                  {settings.promoBadge}
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary mb-md">
                  {settings.promoTitle}
                </h2>
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-md">
                  <div className="bg-white border-2 border-dashed border-primary px-md sm:px-lg py-sm rounded-md">
                    <span className="block sm:inline text-sm text-on-surface-variant sm:mr-2">Use o cupom:</span>
                    <span className="font-bold text-primary text-lg sm:text-xl break-all">{settings.promoCouponCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Destaques */}
      <section className="py-xl">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg">
          <div className="mb-lg">
            <h2 className="font-display text-2xl font-bold text-on-background">Mais Vendidos</h2>
            <div className="h-1 w-20 bg-primary mt-2" />
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      {/* Chamada final */}
      <section className="bg-primary text-white">
        <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-xl text-center flex flex-col items-center gap-md">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Pronta para ter o Japão nas suas mãos?
          </h2>
          <p className="text-white/90 max-w-[36rem]">
            Descubra produtos exclusivos e receba tudo diretamente do Japão com segurança,
            qualidade e confiança.
          </p>
          <Link
            href={settings.heroCtaHref}
            className="inline-block bg-white text-primary font-bold px-xl py-md rounded-md hover:bg-surface-container-lowest transition-all shadow-lg"
          >
            Comprar Agora
          </Link>
        </div>
      </section>
    </>
  );
}
