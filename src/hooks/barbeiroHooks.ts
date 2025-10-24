import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useBarbeiro() {
  const [barbeiro, setBarbeiro] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return setLoading(false);

      const { data: b } = await supabase
        .from("barbeiros")
        .select("*")
        .eq("email", user.email)
        .single();

      setBarbeiro(b);
      setLoading(false);
    }
    load();
  }, []);

  return { barbeiro, loading };
}

export function useAgendamentos() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("agendamentos")
        .select("*")
        .order("data_hora", { ascending: true });
      setAgendamentos(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return { agendamentos, loading };
}

export function useFinancas() {
  const [financas, setFinancas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("financas").select("*");
      const total =
        data?.reduce((sum: any, f: { valor: any }) => sum + f.valor, 0) || 0;
      const hoje = new Date().toISOString().split("T")[0];
      const ganhosHoje =
        data
          ?.filter((f: { data: string }) => f.data.startsWith(hoje))
          .reduce((s: any, f: { valor: any }) => s + f.valor, 0) || 0;
      setFinancas({ total, ganhosHoje });
      setLoading(false);
    }
    load();
  }, []);

  return { financas, loading };
}

export function useServicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("servicos")
        .select("*")
        .eq("ativo", true);
      setServicos(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return { servicos, loading };
}

export function useAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("avaliacoes")
        .select("*")
        .order("data", { ascending: false });
      setAvaliacoes(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return { avaliacoes, loading };
}
