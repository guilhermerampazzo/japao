import { PageHeader, Card } from "@/components/admin/ui";
import MidiaGallery from "./MidiaGallery";

export const dynamic = "force-dynamic";

export default function MidiaPage() {
  return (
    <div>
      <PageHeader title="Biblioteca de Mídia" description="Envie e reutilize imagens em produtos, categorias e páginas." />
      <Card className="p-lg">
        <MidiaGallery />
      </Card>
    </div>
  );
}
