import { z } from "zod";

// ── Login ──────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  identifier: z.string().min(1, "E-mail ou NIF é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// ── Registo por Email ──────────────────────────────────────────────────────────

export const registerEmailSchema = z
  .object({
    name: z.string().min(2, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
      .regex(/[0-9]/, "Precisa de 1 número")
      .regex(/[^A-Za-z0-9]/, "Precisa de 1 caracter especial"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// ── Registo por NIF ────────────────────────────────────────────────────────────
// NIF angolano: 9 dígitos numéricos (ex: 004789456)

export const registerNifSchema = z
  .object({
    name: z.string().min(2, "Nome é obrigatório"),
    nif: z
      .string()
      .min(9, "NIF deve ter 9 caracteres")
      .max(14, "NIF demasiado longo")
      .regex(/^[0-9A-Z]+$/, "NIF inválido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Precisa de 1 letra maiúscula")
      .regex(/[0-9]/, "Precisa de 1 número")
      .regex(/[^A-Za-z0-9]/, "Precisa de 1 caracter especial"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

// ── Types ──────────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterEmailInput = z.infer<typeof registerEmailSchema>;
export type RegisterNifInput = z.infer<typeof registerNifSchema>;
