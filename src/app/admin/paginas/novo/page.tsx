import Link from "next/link";
import { PageHeader } from "@/components/admin/ui";
import PageForm from "../PageForm";

export const dynamic = "force-dynamic";

export default function NewPage() {
  return (
    <div>
      <Link href="/admin/paginas" className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary mb-md">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Voltar para páginas
      </Link>
      <PageHeader title="Nova Página" />
      <PageForm page={null} />
    </div>
  );
}
