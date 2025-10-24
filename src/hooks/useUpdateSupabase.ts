import { useState } from "react";
import { supabase } from "../lib/supabaseClient"; // ajuste o path conforme seu projeto

type UpdateStatus = "idle" | "loading" | "success" | "error";

export function useUpdateSupabase(table: string) {
  const [status, setStatus] = useState<UpdateStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const updateRow = async (
    id: string | number,
    updates: Record<string, any>
  ) => {
    try {
      setStatus("loading");

      const { error } = await supabase.from(table).update(updates).eq("id", id);

      if (error) throw error;

      setStatus("success");
      return true;
    } catch (err: any) {
      console.error("Supabase update error:", err.message);
      setError(err.message);
      setStatus("error");
      return false;
    }
  };

  return { updateRow, status, error };
}
