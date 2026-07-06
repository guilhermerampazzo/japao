import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { RichText } from "@/lib/richtext";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || !page.published) notFound();

  return (
    <div className="max-w-[800px] mx-auto px-lg py-xl">
      <h1 className="font-display text-3xl font-bold mb-md">{page.title}</h1>
      <RichText html={page.contentHtml} />
    </div>
  );
}
