import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }
  const assets = await prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ assets });
}
