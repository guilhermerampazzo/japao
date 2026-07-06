"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "./actions";

type Props = { name: string; email: string; cpf: string; phone: string };

export default function ProfileForm({ name, email, cpf, phone }: Props) {
  const [state, submit] = useActionState<ProfileState, FormData>(updateProfile, undefined);

  return (
    <form action={submit} className="flex flex-col gap-md max-w-[30rem]">
      {state?.ok && (
        <div className="text-sm text-on-tertiary-container bg-tertiary-container/30 rounded-md px-md py-2">
          Dados atualizados com sucesso!
        </div>
      )}
      {state?.error && (
        <div className="text-sm text-on-error-container bg-error-container rounded-md px-md py-2">
          {state.error}
        </div>
      )}
      <Field label="Nome completo" name="name" defaultValue={name} />
      <label className="flex flex-col gap-1">
        <span className="text-sm text-on-surface-variant">E-mail</span>
        <input
          value={email}
          disabled
          className="border border-outline-variant rounded-md px-md py-sm bg-surface-container text-on-surface-variant"
        />
      </label>
      <Field label="CPF" name="cpf" defaultValue={cpf} placeholder="000.000.000-00" />
      <Field label="Telefone" name="phone" defaultValue={phone} placeholder="(11) 99999-9999" />
      <button className="bg-primary text-white font-medium py-md rounded-md hover:bg-primary-container transition-colors self-start px-xl">
        Salvar
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="border border-outline-variant rounded-md px-md py-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
