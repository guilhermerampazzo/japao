import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/money";
import ProfileForm from "./ProfileForm";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  PAID: "Pago",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });
  if (!user) redirect("/login");

  return (
    <div className="max-w-[1200px] mx-auto px-margin-mobile sm:px-lg py-xl">
      <div className="flex items-center justify-between mb-lg">
        <h1 className="font-display text-3xl font-bold">Minha Conta</h1>
        <form action={logoutAction}>
          <button className="text-sm text-on-surface-variant hover:text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-base">logout</span> Sair
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg md:gap-xl">
        <section>
          <h2 className="font-display text-xl font-bold mb-md">Dados Pessoais</h2>
          <ProfileForm
            name={user.name}
            email={user.email}
            cpf={user.cpf ?? ""}
            phone={user.phone ?? ""}
          />
        </section>

        <section>
          <h2 className="font-display text-xl font-bold mb-md">Meus Pedidos</h2>
          {user.orders.length === 0 ? (
            <p className="text-on-surface-variant">Você ainda não fez nenhum pedido.</p>
          ) : (
            <div className="flex flex-col gap-md">
              {user.orders.map((o) => (
                <div key={o.id} className="bg-white rounded-lg product-card-shadow p-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">Pedido #{o.number}</span>
                      <p className="text-xs text-on-surface-variant">
                        {o.createdAt.toLocaleDateString("pt-BR")} · {o.items.length} item(s)
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </div>
                  <div className="mt-2 text-primary font-semibold">{formatBRL(o.totalCents)}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
