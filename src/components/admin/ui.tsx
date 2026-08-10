import Link from "next/link";

/* ============ Layout primitives ============ */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-md mb-lg flex-wrap">
      <div>
        <h1 className="font-display text-2xl font-bold text-on-surface">{title}</h1>
        {description && <p className="text-sm text-on-surface-variant mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-outline-variant/60 shadow-sm ${className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-lg">
      <div className="mb-md">
        <h2 className="font-display text-lg font-bold text-on-surface">{title}</h2>
        {description && <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

/* ============ Buttons ============ */

const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

const buttonVariants = {
  primary: "bg-primary text-white hover:bg-primary-container px-4 py-2",
  secondary: "bg-secondary-container text-on-secondary-container hover:brightness-95 px-4 py-2",
  ghost: "text-on-surface-variant hover:bg-surface-container px-3 py-1.5",
  danger: "text-error hover:bg-error-container/40 px-3 py-1.5",
};

export function Button({
  variant = "primary",
  icon,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  icon?: string;
}) {
  return (
    <button className={`${buttonBase} ${buttonVariants[variant]} ${className ?? ""}`} {...props}>
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {props.children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  icon,
  children,
}: {
  href: string;
  variant?: keyof typeof buttonVariants;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${buttonBase} ${buttonVariants[variant]}`}>
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </Link>
  );
}

/* ============ Form fields ============ */

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  // Usa <div> em vez de <label>: um <label> envolvendo um componente com
  // MÚLTIPLOS controles internos (ex.: a toolbar do RichTextEditor) faz o
  // navegador repassar automaticamente o clique para o PRIMEIRO controle
  // clicável dentro dele — foi exatamente isso que causava o clique na área
  // de texto do editor "ativar" sozinho o primeiro botão da toolbar (negrito).
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-on-surface">{label}</span>
      {children}
      {hint && <span className="text-xs text-on-surface-variant">{hint}</span>}
    </div>
  );
}

const inputClass =
  "border border-outline-variant rounded-lg px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15 transition-shadow";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

/* ============ Data display ============ */

const badgeTones = {
  success: "bg-tertiary-container/25 text-tertiary",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-blue-100 text-blue-700",
  danger: "bg-error-container text-on-error-container",
  neutral: "bg-secondary-container text-on-secondary-container",
};

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof badgeTones;
  children: React.ReactNode;
}) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${badgeTones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-2 py-xl px-md">
      <span className="material-symbols-outlined text-4xl text-outline shrink-0">{icon}</span>
      <p className="font-medium text-on-surface text-balance">{title}</p>
      {description && (
        <p className="text-sm text-on-surface-variant max-w-[26rem] text-pretty leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto -mx-lg px-lg">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`text-left font-medium text-xs uppercase tracking-wide text-on-surface-variant pb-3 border-b border-outline-variant ${className ?? ""}`}>
      {children}
    </th>
  );
}

export function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`py-3 border-b border-outline-variant/50 align-middle ${className ?? ""}`}>{children}</td>;
}
