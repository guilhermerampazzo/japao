import { PrismaClient, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Imagens placeholder locais (substituíveis pelo admin depois)
const IMG = {
  sunscreen: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJFctmd1CeMRmvuAaACM1is5hLkfCnracnHxBVWiCfXMvPZATrXWN3-noUmu906AVP_ZzpleRnJiG0ZCeW5X1qm6ZeZSCkPIWsJbEvdAGb7MxLu-uQCks5Bl8KqJOD1Gc1lG0ue1IA6wIWl2jGm2NpeSfchFcdywVgoI6L7zznqtjMaMdB64x1BFd25J3CVGaEpsC8JsFjLjao8CUVl7IgZVIFblCn9oAJipLQ_c3Rfv8RaDbtHttb4GPBdp-Hhf_dcNcSa-wjcQlT",
  essence: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu0HJm3jfF-S2B2QPTULdUAmYveSnAyvhwxt7-goutIG80ViQMMDPCnvBMn1c4w5OijEykZ7OslKm3MrXU7qcng6-grq8-SO-ambA6-tH22oWQWT01q5fttxMoweuh7gVaqvS6rxeq4BAGJapOTHNhq1Ywgi6y7CRe6KMa3BESSFnQRnk-ql8xiVfdYgVJixKZMjNgnx1v4ca0Zf51U37nlE1_WwhQB8m9rFyuzCrKc2wF0D9s5GHbv6fTrbWkMFTxYlRsJcT8LeMw",
  oil: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOSwbS0l6zZMNPdIRK0GNfrV-3eb9FJnZRZHF6XxlnNZDWcCqWoXXwHyL7mPM3u41r5bnD3zu7deiWLUqwQmE6hfaVAChoLAaHmjyJtqw8sjJ31enV0y1EUBuviK6oP4mdVoyGJpEbqSAqtwDe7qwrJhOtKpUoVT3bGn2fNCR8gQP3uQw8dTBBoUT9EtHAS1CnydbAs0Oc3QKokdk4SAtuSWvFUAgxfIZJ7flWKc576ycB7urlQOFKxeDmFMwHbAzHnHTsT_QfdWi3",
  ampoule: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7MWIYGOhpYksWpbUeFifpCHptYMgzCYv8TjWCGvhMb9MrLb6ttNy6RMCTmIgNyN7ZDuhhDFigkVqngWnUJpHPbmTHNsqlAEGUkqBdzv1w1yu3Ea67Yi2IdTXJi6JizY4myKK9hw0gR_KnKWt7uQoBgmQr2fcJNASo2WdjSEZVwdP7Vf_fzpMdHmO9c4jKZE6Qaf2IEXrbfA9ON2tb8EGjxsyRaT0IfEVOZ3cgziD7cpkfTNui6UZVnN615DCW55igB0T4wnCuVsC1",
};

async function main() {
  // Admin
  const adminPass = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@japaonasmaos.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@japaonasmaos.com",
      password: adminPass,
      role: "ADMIN",
    },
  });

  // Categorias
  const cats = [
    { name: "Skincare Coreano", slug: "skincare-coreano", image: IMG.essence },
    { name: "Skincare Japonês", slug: "skincare-japones", image: IMG.oil },
    { name: "Skincare Capilar", slug: "skincare-capilar", image: IMG.ampoule },
    { name: "Kits", slug: "kits", image: IMG.sunscreen },
  ];
  const catMap: Record<string, string> = {};
  for (const c of cats) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, image: c.image },
      create: c,
    });
    catMap[c.slug] = cat.id;
  }

  // Produtos (das telas)
  const products = [
    { name: "Watery Essence Sunscreen", cat: "skincare-coreano", category: "Proteção Solar", price: 12990, compare: 15990, img: IMG.sunscreen, featured: true },
    { name: "Snail Mucin Power Essence", cat: "skincare-coreano", category: "Hidratação", price: 18900, compare: 21000, img: IMG.essence, featured: true },
    { name: "Rice Water Bright Oil", cat: "skincare-japones", category: "Limpeza", price: 9500, compare: null, img: IMG.oil, featured: true },
    { name: "Centella Ampoule", cat: "skincare-coreano", category: "Tratamento", price: 14500, compare: 16000, img: IMG.ampoule, featured: true },
    { name: "Green Tea Seed Serum", cat: "skincare-japones", category: "Antioxidante", price: 20500, compare: null, img: IMG.essence, featured: false },
    { name: "Lip Sleeping Mask", cat: "skincare-coreano", category: "Lábios", price: 8800, compare: 9900, img: IMG.oil, featured: true },
    { name: "Vitamin C Serum", cat: "skincare-japones", category: "Iluminador", price: 23000, compare: null, img: IMG.sunscreen, featured: false },
    { name: "Soft Finish Sun Milk", cat: "skincare-japones", category: "Proteção Solar", price: 11500, compare: 13500, img: IMG.essence, featured: false },
    { name: "Hyaluronic Acid Toner", cat: "skincare-coreano", category: "Hidratação", price: 14500, compare: 16500, img: IMG.oil, featured: false },
    { name: "Ceramide Cream", cat: "skincare-coreano", category: "Reparação", price: 19500, compare: 22000, img: IMG.ampoule, featured: false },
    { name: "K-Beauty Starter Kit", cat: "kits", category: "Kits", price: 45000, compare: 51000, img: IMG.sunscreen, featured: true },
    { name: "Bamboo Soothing Gel", cat: "skincare-capilar", category: "Corpo", price: 7200, compare: null, img: IMG.oil, featured: false },
  ];

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const product = await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: `${p.name} — produto autêntico de skincare asiático, selecionado pela Japão Nas Mãos. Categoria: ${p.category}.`,
        brand: "Japão Nas Mãos",
        categoryId: catMap[p.cat],
        featured: p.featured,
        ratingAvg: 4.7,
        images: { create: [{ url: p.img, order: 0 }] },
        variants: {
          create: [
            {
              sku: `${slug}-default`,
              name: "Padrão",
              priceCents: p.price,
              compareAtCents: p.compare ?? undefined,
              stock: 50,
            },
          ],
        },
      },
    });
    void product;
  }

  // Cupom das telas
  await prisma.coupon.upsert({
    where: { code: "hello10" },
    update: {},
    create: {
      code: "hello10",
      type: CouponType.PERCENT,
      value: 10,
      minCents: 0,
      active: true,
    },
  });

  // Configurações globais do site (singleton) — cria apenas se não existir
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // Menu do topo
  const navItems = [
    { label: "Início", href: "/", order: 0 },
    { label: "Skincare Coreano", href: "/categoria/skincare-coreano", order: 1 },
    { label: "Skincare Japonês", href: "/categoria/skincare-japones", order: 2 },
    { label: "Skincare Capilar", href: "/categoria/skincare-capilar", order: 3 },
    { label: "Kits", href: "/categoria/kits", order: 4 },
  ];
  for (const item of navItems) {
    const existing = await prisma.navItem.findFirst({ where: { href: item.href } });
    if (!existing) await prisma.navItem.create({ data: item });
  }

  // Páginas de conteúdo (editáveis via TipTap no admin)
  const pages = [
    {
      slug: "sobre",
      title: "Sobre Nós",
      contentHtml:
        "<p>A <strong>Japão Nas Mãos</strong> nasceu do amor pelos rituais de beleza asiáticos. Somos sua ponte direta com o melhor do skincare coreano e japonês, trazendo produtos <strong>100% originais</strong> e selecionados com carinho para a sua pele.</p><p>Acreditamos que cuidar da pele é um ato de autocuidado diário. Por isso, fazemos uma curadoria criteriosa de marcas e fórmulas reconhecidas mundialmente pela eficácia e qualidade — do protetor solar de toque seco à essência de mucina de caracol.</p><p>Nosso compromisso é entregar autenticidade, atendimento próximo e a experiência de uma verdadeira rotina de <em>glass skin</em> na sua casa.</p>",
    },
    {
      slug: "privacidade",
      title: "Política de Privacidade",
      contentHtml:
        "<p>Esta Política descreve como a Japão Nas Mãos coleta, usa e protege os seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).</p><h2>Dados que coletamos</h2><p>Coletamos informações fornecidas por você no cadastro e na compra (nome, e-mail, CPF, telefone e endereço de entrega), além de dados de navegação necessários ao funcionamento da loja.</p><h2>Como usamos seus dados</h2><p>Utilizamos seus dados para processar pedidos, calcular frete, efetuar pagamentos, enviar confirmações e prestar suporte. Não vendemos seus dados a terceiros.</p><h2>Pagamentos</h2><p>Os pagamentos são processados de forma segura pelo Mercado Pago. Não armazenamos dados completos de cartão em nossos servidores.</p><h2>Seus direitos</h2><p>Você pode solicitar a qualquer momento a consulta, correção ou exclusão dos seus dados pelo nosso canal de atendimento.</p>",
    },
    {
      slug: "termos",
      title: "Termos de Uso",
      contentHtml:
        "<p>Ao utilizar a loja Japão Nas Mãos, você concorda com os termos abaixo. Recomendamos a leitura atenta antes de finalizar qualquer compra.</p><h2>Produtos e disponibilidade</h2><p>Todos os produtos estão sujeitos à disponibilidade de estoque. Preços e condições podem ser alterados sem aviso prévio, respeitando os pedidos já confirmados.</p><h2>Pedidos e pagamento</h2><p>O pedido é confirmado após a aprovação do pagamento. Aceitamos Pix, cartão de crédito e boleto por meio do Mercado Pago.</p><h2>Entrega</h2><p>Os prazos de entrega são estimados a partir da postagem e podem variar conforme a transportadora e a região de destino.</p><h2>Trocas e devoluções</h2><p>Você pode solicitar troca ou devolução em até 7 dias corridos após o recebimento, conforme o Código de Defesa do Consumidor.</p>",
    },
  ];
  for (const p of pages) {
    await prisma.page.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  console.log("Seed concluído.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
