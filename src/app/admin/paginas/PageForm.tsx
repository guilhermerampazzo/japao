import RichTextEditor from "@/components/admin/RichTextEditor";
import { CardSection, Field, Input, Textarea } from "@/components/admin/ui";
import { SaveButton } from "@/components/admin/FormControls";
import { upsertPage } from "./actions";

type PageData = {
  id: string;
  title: string;
  slug: string;
  contentHtml: string;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
} | null;

export default function PageForm({ page }: { page: PageData }) {
  return (
    <form action={upsertPage} className="flex flex-col gap-lg max-w-[42rem]">
      {page && <input type="hidden" name="id" value={page.id} />}

      <CardSection title="Conteúdo">
        <div className="flex flex-col gap-md">
          <Field label="Título">
            <Input name="title" defaultValue={page?.title} required />
          </Field>
          <Field label="URL (slug)" hint="Endereço da página: /pagina/…">
            <Input name="slug" defaultValue={page?.slug} placeholder="ex: sobre" />
          </Field>
          <Field label="Texto da página">
            <RichTextEditor name="contentHtml" defaultValue={page?.contentHtml} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={page?.published ?? true} className="w-4 h-4 accent-[var(--color-primary)]" />
            Publicada (visível para os clientes)
          </label>
        </div>
      </CardSection>

      <CardSection title="SEO" description="Como esta página aparece no Google e nas redes sociais.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <Field label="Título SEO" hint="Opcional">
            <Input name="seoTitle" defaultValue={page?.seoTitle ?? ""} />
          </Field>
          <Field label="Descrição SEO" hint="Opcional">
            <Textarea name="seoDescription" defaultValue={page?.seoDescription ?? ""} rows={2} />
          </Field>
        </div>
      </CardSection>

      <SaveButton label="Salvar página" />
    </form>
  );
}
