import { NextRequest, NextResponse } from "next/server";
import { generateJWT } from "@/lib/services/leadService";
import { logWebhook } from "@/lib/services/logging";
import { checkLeadDuplicate } from "@/lib/services/cache";

const N8N_LEAD_WEBHOOK_URL = process.env.N8N_LEAD_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar payload
    if (!body.email || !body.whatsapp || !body.barbershop_name) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // ✅ Verificar duplicata com Redis
    const isDuplicate = await checkLeadDuplicate(body.email);
    if (isDuplicate) {
      await logWebhook(body.email, "duplicate", "Lead duplicado em 5 minutos");
      return NextResponse.json(
        { error: "Lead já foi enviado recentemente. Aguarde alguns minutos." },
        { status: 429 }
      );
    }

    // ✅ Gerar JWT Token
    const jwtToken = generateJWT({
      email: body.email,
      whatsapp: body.whatsapp,
      barbershop_name: body.barbershop_name,
    });

    // ✅ Preparar payload para N8N
    const n8nPayload = {
      nome: body.nome,
      email: body.email,
      whatsapp: body.whatsapp,
      barbershop_name: body.barbershop_name,
      plan: body.plan,
      senha: body.senha,
      jwtToken,
      timestamp: body.timestamp,
      origin: "NextJS",
    };

    // ✅ Enviar para N8N (async, não bloquear)
    if (N8N_LEAD_WEBHOOK_URL) {
      fetch(N8N_LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(n8nPayload),
      })
        .then(() => logWebhook(body.email, "success", "Enviado para N8N"))
        .catch((err) => {
          console.error("N8N webhook error:", err);
          logWebhook(body.email, "error", `N8N error: ${err.message}`);
        });
    }

    // ✅ Responder imediatamente ao cliente
    return NextResponse.json(
      {
        success: true,
        message: "Lead recebido e será processado",
      },
      { status: 202 }
    );
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}
