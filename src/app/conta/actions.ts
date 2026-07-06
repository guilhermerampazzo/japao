"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth, signOut } from "@/auth";
import { profileSchema } from "@/lib/validators";

export type ProfileState = { error?: string; ok?: boolean } | undefined;

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    cpf: formData.get("cpf"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      cpf: parsed.data.cpf || null,
      phone: parsed.data.phone || null,
    },
  });
  revalidatePath("/conta");
  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
