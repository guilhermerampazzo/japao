import { cache } from "react";
import { CouponType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";
const DEFAULT_PROMO_BADGE = "BEM-VINDO";
const DEFAULT_PROMO_COUPON_CODE = "bemvindo10";

/**
 * Retorna as configurações globais do site, criando o registro singleton
 * com os valores padrão (definidos no schema) na primeira chamada.
 * `cache()` evita múltiplas queries na mesma requisição/render.
 */
export const getSiteSettings = cache(async () => {
  await prisma.coupon.upsert({
    where: { code: DEFAULT_PROMO_COUPON_CODE },
    update: { active: true },
    create: {
      code: DEFAULT_PROMO_COUPON_CODE,
      type: CouponType.PERCENT,
      value: 10,
      minCents: 0,
      active: true,
    },
  });

  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: {
      id: SETTINGS_ID,
      promoBadge: DEFAULT_PROMO_BADGE,
      promoCouponCode: DEFAULT_PROMO_COUPON_CODE,
    },
  });

  if (
    settings.promoCouponCode.toLowerCase() === "hello10" ||
    settings.promoBadge.toUpperCase().includes("HELLO")
  ) {
    return prisma.siteSettings.update({
      where: { id: SETTINGS_ID },
      data: {
        promoBadge: DEFAULT_PROMO_BADGE,
        promoCouponCode: DEFAULT_PROMO_COUPON_CODE,
      },
    });
  }

  return settings;
});

export const getNavItems = cache(async () => {
  return prisma.navItem.findMany({ orderBy: { order: "asc" } });
});
