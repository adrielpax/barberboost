"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface UseFetchOptions {
  table: string;
  filters?: Record<string, any>; // { coluna: valor }
  select?: string; // colunas separadas por vírgula ou '*'
  single?: boolean; // retorna single()
  order?: { column: string; ascending?: boolean };
}

export const useFetchSupabase = ({
  table,
  filters,
  select = "*",
  single = false,
  order,
}: UseFetchOptions) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!filters) return;
    const fetchData = async () => {
      setLoading(true);
      let query = supabase.from(table).select(select);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      if (order) {
        query = query.order(order.column, {
          ascending: order.ascending ?? true,
        });
      }

      if (single) {
        // single() must be called after all filters/orders but before executing
        // Needs explicit type assertion since .single() returns PostgrestSingleResponse
        query = (query as any).single();
      }

      const { data: fetchedData, error: fetchError } = await query;
      if (fetchError) {
        setError(fetchError);
        setData(null);
      } else {
        setData(fetchedData);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [table, JSON.stringify(filters), select, single, order]);

  return { data, loading, error, refetch: () => setLoading(true) };
};
