"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
}

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const image = String(formData.get("image") ?? "") || null;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!name) return;

  if (id) {
    await prisma.category.update({ where: { id }, data: { name, slug, image } });
  } else {
    await prisma.category.create({ data: { name, slug, image } });
  }
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // não remove categoria com produtos vinculados
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}
