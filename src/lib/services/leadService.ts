import jwt from "jsonwebtoken";
import { LeadFormData, validateWhatsApp } from "@/lib/validators/whatsapp";

const JWT_SECRET = process.env.JWT_SECRET || "seu-secret-super-seguro";
const N8N_LEAD_WEBHOOK_URL = process.env.N8N_LEAD_WEBHOOK_URL;

export async function submitLeadWithWebhook(
  formData: LeadFormData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Formatar WhatsApp
    const { formatted: whatsappFormatted } = validateWhatsApp(
      formData.whatsapp
    );

    // Chamar webhook do Next.js (que vai enviar para N8N)
    const response = await fetch("/api/webhooks/lead-capture", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        whatsapp: whatsappFormatted,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Erro ao enviar lead");
    }

    const result = await response.json();
    return {
      success: true,
      userId: result.userId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export function generateJWT(payload: Record<string, any>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJWT(token: string): Record<string, any> | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Record<string, any>;
  } catch {
    return null;
  }
}
