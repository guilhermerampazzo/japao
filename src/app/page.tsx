export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getFeatured, getNewest, getCategories } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import ProductGrid from "@/components/ProductGrid";

const DEFAULT_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAvETSSARBq122R-wK97HoohEecB_fa_P6YuDT5CVn2ZHQQUufK88WQSEf8QuBs61gNqNwhWGzF1l8iQ82y3zYRBBvGxKx_Re4PyAB2D03WfZIPW-pbR5bFqlAmu_oJFCjp48LVyVDeFOJ81b7q6RaYzd8zLiFkSF_4fzd5qMw96fkv6vKKIxUoPVaDUKHYNnwzCCuZ4BJihRHHoBZl1hzBHaNxMv9wWN3Ge7v-KQeth3_OF-aLW39oOFFyQk0OmEeXclDOa5WnExPV";

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

        <div className="relative max-w-[1200px] mx-auto flex items-center min-h-[520px] px-lg py-xl">
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
            <Link
              href={settings.heroCtaHref}
              className="inline-block bg-primary text-white font-medium px-xl py-md rounded-md hover:bg-primary-container transition-all shadow-lg"
            >
              {settings.heroCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-xl max-w-[1200px] mx-auto px-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
          {categories.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className="group flex flex-col items-center text-center gap-md">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-secondary-container group-hover:border-primary transition-all duration-300 relative">
                {c.image && <Image src={c.image} alt={c.name} fill sizes="160px" className="object-cover" />}
              </div>
              <span className="font-display text-lg font-semibold text-on-surface group-hover:text-primary transition-colors">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Novidades */}
      <section className="py-xl bg-surface-container-lowest">
        <div className="max-w-[1200px] mx-auto px-lg">
          <div className="mb-lg">
            <h2 className="font-display text-2xl font-bold text-on-background">Novidades imperdíveis</h2>
            <div className="h-1 w-20 bg-primary mt-2" />
          </div>
          <ProductGrid products={newest} />
        </div>
      </section>

      {/* Banner promocional */}
      {settings.promoActive && (
        <section className="py-xl">
          <div className="max-w-[1200px] mx-auto px-lg">
            <div className="relative bg-secondary-container rounded-xl p-xl flex flex-col md:flex-row items-center gap-xl overflow-hidden">
              <div className="relative z-10 w-full md:w-2/3">
                <div className="inline-block bg-primary text-white text-xs font-bold px-4 py-1 rounded-full mb-md">
                  {settings.promoBadge}
                </div>
                <h2 className="font-display text-2xl md:text-4xl font-bold text-primary mb-md">
                  {settings.promoTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-md">
                  <div className="bg-white border-2 border-dashed border-primary px-lg py-sm rounded-md">
                    <span className="text-sm text-on-surface-variant mr-2">Use o cupom:</span>
                    <span className="font-bold text-primary text-xl">{settings.promoCouponCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Destaques */}
      <section className="py-xl">
        <div className="max-w-[1200px] mx-auto px-lg">
          <div className="mb-lg">
            <h2 className="font-display text-2xl font-bold text-on-background">Mais Vendidos</h2>
            <div className="h-1 w-20 bg-primary mt-2" />
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>
    </>
  );
}
