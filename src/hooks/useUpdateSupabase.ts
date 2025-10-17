"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseUpdateOptions {
  table: string;
  idColumn?: string; // coluna do ID (padrão 'id')
}

export const useUpdateSupabase = ({
  table,
  idColumn = "id",
}: UseUpdateOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateRow = async (
    id: string | number,
    values: Record<string, any>
  ) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from(table)
        .update(values)
        .eq(idColumn, id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateRow, loading, error };
};
