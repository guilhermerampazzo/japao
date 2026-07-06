import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-surface-container-lowest -mt-20 pt-20">
      <div className="flex flex-col md:flex-row max-w-[1400px] mx-auto">
        <AdminSidebar userName={session.user.name ?? session.user.email ?? "Administrador"} />
        <main className="flex-1 min-w-0 p-lg md:p-xl">{children}</main>
      </div>
    </div>
  );
}
