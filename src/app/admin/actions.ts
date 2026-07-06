"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import type { OrderStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
  return session;
}

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatus;
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin/pedidos");
  revalidatePath(`/admin/pedidos/${id}`);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function upsertProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name"));
  const categoryId = String(formData.get("categoryId"));
  const descriptionHtml = String(formData.get("descriptionHtml") ?? "");
  const description = stripHtml(descriptionHtml) || name;
  const priceCents = Math.round(parseFloat(String(formData.get("price"))) * 100);
  const compareRaw = String(formData.get("compare") ?? "");
  const compareAtCents = compareRaw ? Math.round(parseFloat(compareRaw) * 100) : null;
  const stock = parseInt(String(formData.get("stock") ?? "0"), 10);
  const image = String(formData.get("image") ?? "");
  const featured = formData.get("featured") === "on";
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  if (id) {
    await prisma.product.update({
      where: { id },
      data: { name, slug, description, descriptionHtml, categoryId, featured },
    });
    const variant = await prisma.productVariant.findFirst({ where: { productId: id } });
    if (variant) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { priceCents, compareAtCents, stock },
      });
    }
    if (image) {
      const img = await prisma.productImage.findFirst({ where: { productId: id }, orderBy: { order: "asc" } });
      if (img) await prisma.productImage.update({ where: { id: img.id }, data: { url: image } });
      else await prisma.productImage.create({ data: { productId: id, url: image, order: 0 } });
    }
  } else {
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        descriptionHtml,
        categoryId,
        featured,
        images: image ? { create: [{ url: image, order: 0 }] } : undefined,
        variants: {
          create: [{ sku: `${slug}-${Date.now()}`, name: "Padrão", priceCents, compareAtCents, stock }],
        },
      },
    });
  }
  revalidatePath("/admin/produtos");
  redirect("/admin/produtos");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/produtos");
}
