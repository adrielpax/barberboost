import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface FetchOptions {
  filters?: Record<string, any>;
  enabled?: boolean;
  single?: boolean;
}

export function useFetchSupabase<T = any>(
  table: string,
  options?: FetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se enabled for false, não busca
    if (options?.enabled === false) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validar se há filtros com valores undefined
        if (options?.filters) {
          const hasUndefinedFilter = Object.values(options.filters).some(
            (value) => value === undefined || value === null || value === ""
          );

          if (hasUndefinedFilter) {
            console.warn(
              `Filtros inválidos para tabela ${table}:`,
              options.filters
            );
            setData(null);
            setLoading(false);
            return;
          }
        }

        let query = supabase.from(table).select("*");

        // Aplicar filtros
        if (options?.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              query = query.eq(key, value);
            }
          });
        }

        // Se for single, busca um só registro
        const result = options?.single ? await query.single() : await query;

        if (result.error) {
          throw new Error(result.error.message);
        }

        setData(result.data);
      } catch (err: any) {
        const errorMsg = err?.message || "Erro ao buscar dados";
        console.error(`Supabase fetch error: ${errorMsg}`);
        setError(errorMsg);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, JSON.stringify(options?.filters), options?.enabled]);

  return { data, loading, error };
}

// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabaseClient"; // ajuste o path conforme seu projeto

// type FetchStatus = "idle" | "loading" | "success" | "error";

// export function useFetchSupabase<T>(
//   table: string,
//   options?: { filter?: [string, string, any] }
// ) {
//   const [data, setData] = useState<T[] | null>(null);
//   const [status, setStatus] = useState<FetchStatus>("idle");
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setStatus("loading");

//         let query = supabase.from(table).select("*");
//         if (options?.filter) {
//           const [column, operator, value] = options.filter;
//           query = query.filter(column, operator, value);
//         }

//         const { data, error } = await query;

//         if (error) throw error;
//         setData(data as T[]);
//         setStatus("success");
//       } catch (err: any) {
//         console.error("Supabase fetch error:", err.message);
//         setError(err.message);
//         setStatus("error");
//       }
//     };

//     fetchData();
//   }, [table, JSON.stringify(options)]);

//   return { data, status, error };
// }
