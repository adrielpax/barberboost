export const N8N_WEBHOOKS = {
  lead: process.env.NEXT_PUBLIC_N8N_LEAD_WEBHOOK as string,
  contact: process.env.NEXT_PUBLIC_N8N_CONTACT_WEBHOOK as string,
  // adiciona outros webhooks conforme forem criados no n8n
};
