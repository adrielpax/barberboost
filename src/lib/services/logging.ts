import { supabase } from "@/lib/supabaseClient";

export async function logWebhook(
  email: string,
  status: "success" | "error" | "duplicate",
  message: string
) {
  try {
    await supabase.from("webhook_logs").insert([
      {
        email,
        status,
        message,
        timestamp: new Date().toISOString(),
        origin: "lead_capture",
      },
    ]);
  } catch (error) {
    console.error("Logging error:", error);
  }
}
