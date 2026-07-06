"use client";

import { useState } from "react";
import { useActionState } from "react";
import { loginAction, registerAction, type ActionState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="bg-primary text-white font-medium py-md rounded-md hover:bg-primary-container transition-colors"
    >
      {label}
    </button>
  );
}

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginSubmit] = useActionState<ActionState, FormData>(loginAction, undefined);
  const [regState, regSubmit] = useActionState<ActionState, FormData>(registerAction, undefined);
  const error = mode === "login" ? loginState?.error : regState?.error;

  return (
    <div className="w-full max-w-[26rem] bg-white rounded-xl product-card-shadow p-lg">
      <div className="flex gap-2 mb-lg bg-surface-container rounded-full p-1">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "login" ? "bg-primary text-white" : "text-on-surface-variant"
          }`}
        >
          Entrar
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition-colors ${
            mode === "register" ? "bg-primary text-white" : "text-on-surface-variant"
          }`}
        >
          Criar conta
        </button>
      </div>

      {error && (
        <div className="mb-md text-sm text-on-error-container bg-error-container rounded-md px-md py-2">
          {error}
        </div>
      )}

      {mode === "login" ? (
        <form action={loginSubmit} className="flex flex-col gap-md">
          <Field label="E-mail" name="email" type="email" />
          <Field label="Senha" name="password" type="password" />
          <SubmitButton label="Entrar" />
        </form>
      ) : (
        <form action={regSubmit} className="flex flex-col gap-md">
          <Field label="Nome completo" name="name" type="text" />
          <Field label="E-mail" name="email" type="email" />
          <Field label="Senha" name="password" type="password" />
          <SubmitButton label="Criar conta" />
        </form>
      )}
    </div>
  );
}

function Field({ label, name, type }: { label: string; name: string; type: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="border border-outline-variant rounded-md px-md py-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
