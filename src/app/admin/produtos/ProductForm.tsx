import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import { CardSection, Field, Input, Select } from "@/components/admin/ui";
import { SaveButton } from "@/components/admin/FormControls";
import { upsertProduct } from "../actions";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  descriptionHtml: string;
  categoryId: string;
  featured: boolean;
  origin: "BRASIL" | "JAPAO";
  priceCents: number;
  compareAtCents: number | null;
  stock: number;
  image: string;
} | null;

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product: Product;
}) {
  return (
    <form action={upsertProduct} className="flex flex-col gap-lg max-w-[42rem]">
      {product && <input type="hidden" name="id" value={product.id} />}

      <CardSection title="Informações básicas">
        <div className="flex flex-col gap-md">
          <Field label="Nome do produto">
            <Input name="name" defaultValue={product?.name} required placeholder="Ex: Sérum Vitamina C 30ml" />
          </Field>
          <Field label="Descrição">
            <RichTextEditor name="descriptionHtml" defaultValue={product?.descriptionHtml} />
          </Field>
          <Field label="Categoria">
            <Select name="categoryId" defaultValue={product?.categoryId}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Origem" hint="Exibida como selo na página do produto">
            <Select name="origin" defaultValue={product?.origin ?? "JAPAO"}>
              <option value="JAPAO">Direto do Japão</option>
              <option value="BRASIL">Pronta entrega no Brasil</option>
            </Select>
          </Field>
        </div>
      </CardSection>

      <CardSection title="Preço e estoque">
        <div className="grid grid-cols-3 gap-md">
          <Field label="Preço (R$)">
            <Input name="price" type="number" step="0.01" defaultValue={product ? (product.priceCents / 100).toFixed(2) : ""} required />
          </Field>
          <Field label="De (R$)" hint="Opcional — mostra desconto">
            <Input name="compare" type="number" step="0.01" defaultValue={product?.compareAtCents ? (product.compareAtCents / 100).toFixed(2) : ""} />
          </Field>
          <Field label="Estoque">
            <Input name="stock" type="number" defaultValue={product ? String(product.stock) : "0"} />
          </Field>
        </div>
      </CardSection>

      <CardSection title="Imagem e destaque">
        <div className="flex flex-col gap-md">
          <MediaPicker name="image" label="Imagem do produto" defaultUrl={product?.image} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="w-4 h-4 accent-[var(--color-primary)]" />
            Exibir como produto em destaque na home
          </label>
        </div>
      </CardSection>

      <SaveButton label="Salvar produto" />
    </form>
  );
}
