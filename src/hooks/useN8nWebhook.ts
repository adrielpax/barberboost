"use client";

import { useState } from "react";
import { N8N_WEBHOOKS } from "@/lib/n8n";

export function useN8nWebhook() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  async function sendToN8nWebhook(data: any, type: keyof typeof N8N_WEBHOOKS) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(N8N_WEBHOOKS[type], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Erro ao enviar para o n8n: ${res.status}`);
      const json = await res.json();
      setResponse(json);
      return json;
    } catch (err: any) {
      setError(err.message);
      console.error("Erro no webhook n8n:", err);
    } finally {
      setLoading(false);
    }
  }

  return { sendToN8nWebhook, loading, error, response };
}
