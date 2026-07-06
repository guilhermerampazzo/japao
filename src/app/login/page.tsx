import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AuthForm from "./AuthForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/conta");

  return (
    <div className="max-w-[1200px] mx-auto px-lg py-xl flex flex-col items-center">
      <h1 className="font-display text-3xl font-bold mb-2">Bem-vinda de volta</h1>
      <p className="text-on-surface-variant mb-lg">Acesse sua conta ou crie uma nova.</p>
      <AuthForm />
    </div>
  );
}
