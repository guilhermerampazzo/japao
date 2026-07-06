"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") redirect("/");
}

const DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function upsertPage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const slug = slugRaw ? slugify(slugRaw) : slugify(title);
  const contentHtml = String(formData.get("contentHtml") ?? "");
  const published = formData.get("published") === "on";
  const seoTitle = String(formData.get("seoTitle") ?? "") || null;
  const seoDescription = String(formData.get("seoDescription") ?? "") || null;

  if (!title || !slug) return;

  if (id) {
    await prisma.page.update({
      where: { id },
      data: { title, slug, contentHtml, published, seoTitle, seoDescription },
    });
  } else {
    await prisma.page.create({
      data: { title, slug, contentHtml, published, seoTitle, seoDescription },
    });
  }
  revalidatePath("/admin/paginas");
  revalidatePath(`/pagina/${slug}`);
  redirect("/admin/paginas");
}

export async function deletePage(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/paginas");
  revalidatePath(`/pagina/${page.slug}`);
}
