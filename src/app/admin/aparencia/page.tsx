import { getSiteSettings } from "@/lib/settings";
import MediaPicker from "@/components/admin/MediaPicker";
import { PageHeader, CardSection, Field, Input, Textarea } from "@/components/admin/ui";
import { SaveButton } from "@/components/admin/FormControls";
import { updateHero, updatePromo } from "../config/actions";

export const dynamic = "force-dynamic";

export default async function AparenciaPage() {
  const s = await getSiteSettings();

  return (
    <div className="max-w-[42rem]">
      <PageHeader title="Aparência da Home" description="Controle o banner principal e o banner promocional da página inicial." />

      <div className="flex flex-col gap-lg">
        <CardSection title="Banner Principal" description="A grande faixa no topo da home.">
          <form action={updateHero} className="flex flex-col gap-md">
            <Field label="Selo (texto pequeno acima do título)">
              <Input name="heroEyebrow" defaultValue={s.heroEyebrow} />
            </Field>
            <Field label="Título">
              <Input name="heroTitle" defaultValue={s.heroTitle} />
            </Field>
            <Field label="Subtítulo">
              <Textarea name="heroSubtitle" defaultValue={s.heroSubtitle} rows={3} />
            </Field>
            <div className="grid grid-cols-2 gap-md">
              <Field label="Texto do botão">
                <Input name="heroCtaLabel" defaultValue={s.heroCtaLabel} />
              </Field>
              <Field label="Link do botão">
                <Input name="heroCtaHref" defaultValue={s.heroCtaHref} />
              </Field>
            </div>
            <MediaPicker name="heroImageUrl" label="Imagem do banner" defaultUrl={s.heroImageUrl ?? undefined} />
            <SaveButton />
          </form>
        </CardSection>

        <CardSection title="Banner Promocional" description="Faixa de destaque com cupom, exibida abaixo das novidades.">
          <form action={updatePromo} className="flex flex-col gap-md">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="promoActive" defaultChecked={s.promoActive} className="w-4 h-4 accent-[var(--color-primary)]" />
              Exibir banner promocional na home
            </label>
            <Field label="Selo">
              <Input name="promoBadge" defaultValue={s.promoBadge} />
            </Field>
            <Field label="Título">
              <Input name="promoTitle" defaultValue={s.promoTitle} />
            </Field>
            <Field label="Código do cupom exibido">
              <Input name="promoCouponCode" defaultValue={s.promoCouponCode} />
            </Field>
            <SaveButton />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
