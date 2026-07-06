import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

export const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido"),
  street: z.string().min(2, "Informe o logradouro"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  district: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().length(2, "UF inválida"),
});

export const profileSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  cpf: z
    .string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, "CPF inválido")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
