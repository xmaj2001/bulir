import { z } from "zod";

// ── Service Schemas ──────────────────────────────────────────────────────────

export const createServiceSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().min(1, "A descrição é obrigatória"),
  price: z.coerce.number().min(0, "O preço deve ser maior ou igual a 0"),
  isActive: z.boolean().optional().default(true),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

// ── Booking Schemas ──────────────────────────────────────────────────────────

export const createBookingSchema = z.object({
  serviceId: z.string().uuid("ID de serviço inválido"),
  notes: z.string().optional(),
  scheduledAt: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return !isNaN(Date.parse(val));
    }, "Data inválida"),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
