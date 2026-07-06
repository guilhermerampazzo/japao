import { getSiteSettings } from "@/lib/settings";
import { PageHeader, CardSection, Field, Input, Textarea } from "@/components/admin/ui";
import { SaveButton } from "@/components/admin/FormControls";
import { updateIdentity, updateContact, updateStore, updateSeo } from "./actions";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const s = await getSiteSettings();

  return (
    <div className="max-w-[42rem]">
      <PageHeader title="Configurações" description="Dados gerais da loja, contato e integrações básicas." />

      <div className="flex flex-col gap-lg">
        <CardSection title="Identidade" description="Nome e subtítulo exibidos no cabeçalho do site.">
          <form action={updateIdentity} className="flex flex-col gap-md">
            <Field label="Nome da loja">
              <Input name="storeName" defaultValue={s.storeName} />
            </Field>
            <Field label="Tagline" hint="Subtítulo pequeno abaixo do nome no cabeçalho">
              <Input name="tagline" defaultValue={s.tagline} />
            </Field>
            <SaveButton />
          </form>
        </CardSection>

        <CardSection title="Contato e Redes" description="Usado no botão de WhatsApp e no rodapé.">
          <form action={updateContact} className="flex flex-col gap-md">
            <Field label="Número do WhatsApp" hint="DDI + DDD + número, apenas dígitos. Ex: 5511999999999">
              <Input name="whatsappNumber" defaultValue={s.whatsappNumber} placeholder="5511999999999" />
            </Field>
            <Field label="Mensagem padrão do WhatsApp">
              <Textarea name="whatsappMessage" defaultValue={s.whatsappMessage} rows={2} />
            </Field>
            <Field label="E-mail de contato">
              <Input name="contactEmail" defaultValue={s.contactEmail} type="email" />
            </Field>
            <Field label="Instagram" hint="Opcional — cole a URL do perfil">
              <Input name="instagramUrl" defaultValue={s.instagramUrl ?? ""} placeholder="https://instagram.com/..." />
            </Field>
            <Field label="Texto sobre a loja no rodapé">
              <Textarea name="footerAbout" defaultValue={s.footerAbout} rows={3} />
            </Field>
            <SaveButton />
          </form>
        </CardSection>

        <CardSection title="Loja e Frete">
          <form action={updateStore} className="flex flex-col gap-md">
            <Field label="CEP de origem" hint="Usado para calcular o frete">
              <Input name="originCep" defaultValue={s.originCep} />
            </Field>
            <Field label="Frete grátis a partir de (R$)">
              <Input
                name="freeShippingThreshold"
                type="number"
                step="0.01"
                defaultValue={(s.freeShippingThresholdCents / 100).toFixed(2)}
              />
            </Field>
            <SaveButton />
          </form>
        </CardSection>

        <CardSection title="SEO Padrão" description="Título e descrição exibidos nos resultados de busca do Google.">
          <form action={updateSeo} className="flex flex-col gap-md">
            <Field label="Título (aba do navegador)">
              <Input name="seoTitle" defaultValue={s.seoTitle} />
            </Field>
            <Field label="Descrição">
              <Textarea name="seoDescription" defaultValue={s.seoDescription} rows={2} />
            </Field>
            <SaveButton />
          </form>
        </CardSection>
      </div>
    </div>
  );
}
