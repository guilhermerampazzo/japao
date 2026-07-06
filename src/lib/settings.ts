import { cache } from "react";
import { prisma } from "@/lib/prisma";

const SETTINGS_ID = "singleton";

/**
 * Retorna as configurações globais do site, criando o registro singleton
 * com os valores padrão (definidos no schema) na primeira chamada.
 * `cache()` evita múltiplas queries na mesma requisição/render.
 */
export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: {},
    create: { id: SETTINGS_ID },
  });
  return settings;
});

export const getNavItems = cache(async () => {
  return prisma.navItem.findMany({ orderBy: { order: "asc" } });
});
