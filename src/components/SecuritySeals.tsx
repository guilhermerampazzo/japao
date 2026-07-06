import { SiLetsencrypt, SiMercadopago } from "react-icons/si";

/** Selos de segurança com logos reais e verificáveis. */
export default function SecuritySeals() {
  return (
    <div className="flex flex-col gap-xs">
      <div className="flex items-center gap-2 bg-white rounded-md border border-outline-variant shadow-sm px-3 py-2">
        <SiLetsencrypt className="text-[22px]" style={{ color: "#003A70" }} title="Let's Encrypt" />
        <div className="leading-tight">
          <div className="text-xs font-semibold text-on-surface">Conexão segura</div>
          <div className="text-[10px] text-on-surface-variant">Certificado SSL Let&apos;s Encrypt</div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-white rounded-md border border-outline-variant shadow-sm px-3 py-2">
        <SiMercadopago className="text-[22px]" style={{ color: "#00B1EA" }} title="Mercado Pago" />
        <div className="leading-tight">
          <div className="text-xs font-semibold text-on-surface">Pagamento protegido</div>
          <div className="text-[10px] text-on-surface-variant">Processado pelo Mercado Pago</div>
        </div>
      </div>
    </div>
  );
}
