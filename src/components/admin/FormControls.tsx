"use client";

import { useFormStatus } from "react-dom";

/** Botão de submit que mostra estado de carregamento automaticamente (dentro de um <form>). */
export function SaveButton({ label = "Salvar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="inline-flex items-center gap-1.5 bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-container transition-colors disabled:opacity-60 self-start"
    >
      {pending && (
        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
      )}
      {pending ? "Salvando..." : label}
    </button>
  );
}

/** Botão de ação destrutiva que pede confirmação antes de submeter o form. */
export function ConfirmSubmitButton({
  children,
  confirmMessage,
  className,
}: {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
}) {
  return (
    <button
      className={className ?? "text-error text-sm font-medium hover:underline"}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
