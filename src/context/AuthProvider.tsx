// ============================================
// 2. AUTH PROVIDER - CORRIGIDO
// ============================================
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";

export interface BarberData {
  id: string;
  nome: string;
  email: string;
  whatsapp?: string;
  barbershop_name: string;
  plan: "essencial" | "profissional" | "premium";
  status?: string;
  bio?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  avatar_url?: string;
  created_at?: string;
}

interface AuthContextType {
  user: any;
  barberData: BarberData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshBarberData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [barberData, setBarberData] = useState<BarberData | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar dados do barbeiro usando o ID do auth user
  const fetchBarberData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("barbeiros")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar barbeiro:", error);
        return;
      }

      setBarberData(data as BarberData);
    } catch (err) {
      console.error("Erro em fetchBarberData:", err);
    }
  };

  // Inicializar sessão
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          await fetchBarberData(data.session.user.id);
        }
      } catch (err) {
        console.error("Erro ao inicializar auth:", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    // Listener para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchBarberData(session.user.id);
        } else {
          setUser(null);
          setBarberData(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Usuário não encontrado");

      setUser(data.user);
      await fetchBarberData(data.user.id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setBarberData(null);
      router.push("/");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  };

  // Atualizar dados do barbeiro
  const refreshBarberData = async () => {
    if (user?.id) {
      await fetchBarberData(user.id);
    }
  };

  const value = useMemo(
    () => ({
      user,
      barberData,
      loading,
      login,
      logout,
      refreshBarberData,
    }),
    [user, barberData, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <LoaderOverlay open={loading} />
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
