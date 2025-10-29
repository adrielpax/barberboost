import { z } from "zod";

export const validateWhatsApp = (
  phone: string
): { isValid: boolean; formatted: string } => {
  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length < 10 || cleaned.length > 15) {
    return { isValid: false, formatted: "" };
  }

  const isBrazil =
    cleaned.length === 11 ||
    (cleaned.length === 13 && cleaned.startsWith("55"));

  if (!isBrazil) {
    return { isValid: false, formatted: "" };
  }

  let formatted = cleaned;
  if (!formatted.startsWith("55")) {
    formatted = "55" + formatted;
  }

  return { isValid: true, formatted };
};

export const leadSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  whatsapp: z
    .string()
    .refine(
      (val) => validateWhatsApp(val).isValid,
      "WhatsApp inválido. Use: (11) 99999-9999"
    ),
  email: z.string().email("Email inválido."),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter ao menos um número."),
  barbershop_name: z.string().min(2, "Nome da barbearia é obrigatório."),
  plan: z.enum(["essencial", "profissional", "premium"]),
});

export type LeadFormData = z.infer<typeof leadSchema>;
