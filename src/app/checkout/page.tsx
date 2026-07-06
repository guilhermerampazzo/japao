import { redirect } from "next/navigation";
import { auth } from "@/auth";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="max-w-[1200px] mx-auto px-lg py-xl">
      <h1 className="font-display text-3xl font-bold mb-lg">Finalizar Compra</h1>
      <CheckoutClient />
    </div>
  );
}
