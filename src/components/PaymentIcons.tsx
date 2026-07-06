import { SiPix, SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";

/** Bandeiras/meios de pagamento usando logos reais (react-icons / Simple Icons). */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-md h-9 w-14 flex items-center justify-center border border-outline-variant shadow-sm">
      {children}
    </div>
  );
}

export default function PaymentIcons() {
  return (
    <div className="flex flex-wrap gap-xs">
      <Badge>
        <SiPix className="text-[22px]" style={{ color: "#32BCAD" }} title="Pix" />
      </Badge>
      <Badge>
        <SiVisa className="text-[30px]" style={{ color: "#1434CB" }} title="Visa" />
      </Badge>
      <Badge>
        <SiMastercard className="text-[26px]" style={{ color: "#EB001B" }} title="Mastercard" />
      </Badge>
      <Badge>
        <SiAmericanexpress className="text-[24px]" style={{ color: "#2E77BC" }} title="American Express" />
      </Badge>
    </div>
  );
}
