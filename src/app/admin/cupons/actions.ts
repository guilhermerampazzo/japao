"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { CouponType } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
}

export async function createCoupon(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "").trim().toLowerCase();
  const type = String(formData.get("type") ?? "PERCENT") as CouponType;
  const valueRaw = String(formData.get("value") ?? "0");
  const value = type === "PERCENT" ? parseInt(valueRaw, 10) : Math.round(parseFloat(valueRaw) * 100);
  const minRaw = String(formData.get("minValue") ?? "0");
  const minCents = Math.round(parseFloat(minRaw || "0") * 100);
  const maxUsesRaw = String(formData.get("maxUses") ?? "");
  const maxUses = maxUsesRaw ? parseInt(maxUsesRaw, 10) : null;
  const expiresAtRaw = String(formData.get("expiresAt") ?? "");
  const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
  if (!code) return;

  await prisma.coupon.create({
    data: { code, type, value, minCents, maxUses, expiresAt, active: true },
  });
  revalidatePath("/admin/cupons");
}

export async function toggleCoupon(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const active = formData.get("active") === "true";
  await prisma.coupon.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/cupons");
}
