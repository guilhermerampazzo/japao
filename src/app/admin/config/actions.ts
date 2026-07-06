"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
}

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export async function updateIdentity(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      storeName: str(formData, "storeName"),
      tagline: str(formData, "tagline"),
    },
  });
  revalidatePath("/", "layout");
}

export async function updateContact(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      whatsappNumber: str(formData, "whatsappNumber").replace(/\D/g, ""),
      whatsappMessage: str(formData, "whatsappMessage"),
      contactEmail: str(formData, "contactEmail"),
      instagramUrl: str(formData, "instagramUrl") || null,
      footerAbout: str(formData, "footerAbout"),
    },
  });
  revalidatePath("/", "layout");
}

export async function updateStore(formData: FormData) {
  await requireAdmin();
  const threshold = parseFloat(str(formData, "freeShippingThreshold") || "0");
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      originCep: str(formData, "originCep").replace(/\D/g, ""),
      freeShippingThresholdCents: Math.round(threshold * 100),
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/checkout");
}

export async function updateSeo(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      seoTitle: str(formData, "seoTitle"),
      seoDescription: str(formData, "seoDescription"),
    },
  });
  revalidatePath("/", "layout");
}

export async function updateHero(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      heroEyebrow: str(formData, "heroEyebrow"),
      heroTitle: str(formData, "heroTitle"),
      heroSubtitle: str(formData, "heroSubtitle"),
      heroCtaLabel: str(formData, "heroCtaLabel"),
      heroCtaHref: str(formData, "heroCtaHref"),
      heroImageUrl: str(formData, "heroImageUrl") || null,
    },
  });
  revalidatePath("/");
}

export async function updatePromo(formData: FormData) {
  await requireAdmin();
  await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: {
      promoActive: formData.get("promoActive") === "on",
      promoBadge: str(formData, "promoBadge"),
      promoTitle: str(formData, "promoTitle"),
      promoCouponCode: str(formData, "promoCouponCode"),
    },
  });
  revalidatePath("/");
}

export async function createNavItem(formData: FormData) {
  await requireAdmin();
  const label = str(formData, "label");
  const href = str(formData, "href");
  if (!label || !href) return;
  const last = await prisma.navItem.findFirst({ orderBy: { order: "desc" } });
  await prisma.navItem.create({ data: { label, href, order: (last?.order ?? -1) + 1 } });
  revalidatePath("/", "layout");
}

export async function deleteNavItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.navItem.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function moveNavItem(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const direction = String(formData.get("direction"));
  const items = await prisma.navItem.findMany({ orderBy: { order: "asc" } });
  const idx = items.findIndex((i) => i.id === id);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swapIdx < 0 || swapIdx >= items.length) return;

  const a = items[idx];
  const b = items[swapIdx];
  await prisma.$transaction([
    prisma.navItem.update({ where: { id: a.id }, data: { order: b.order } }),
    prisma.navItem.update({ where: { id: b.id }, data: { order: a.order } }),
  ]);
  revalidatePath("/", "layout");
}
