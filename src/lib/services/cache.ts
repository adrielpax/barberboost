import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || "",
  token: process.env.UPSTASH_REDIS_TOKEN || "",
});

export async function checkLeadDuplicate(email: string): Promise<boolean> {
  try {
    const key = `lead:${email}`;
    const exists = await redis.get(key);

    if (!exists) {
      // Marcar como processando por 5 minutos
      await redis.set(key, "processing", { ex: 300 });
      return false;
    }

    return true;
  } catch (error) {
    console.error("Cache error:", error);
    return false; // Se falhar, deixa prosseguir
  }
}
