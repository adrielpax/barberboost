"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { supabase } from "@/services/supabaseClient";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";

interface BarberData {
  id: string;
  name: string;
  email: string;
  barbershop_name: string;
  plan: "essencial" | "premium";
  public_link: string;
  avatar_url?: string;
  description?: string;
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
  const [user, setUser] = useState<any>(null);
  const [barberData, setBarberData] = useState<BarberData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Recupera sessão e dados
  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setUser(data.session.user);
          await fetchBarberData(data.session.user.id);
        }
      } catch (err) {
        console.error("Erro ao carregar sessão:", err);
      } finally {
        setLoading(false);
      }
    };
    init();

    // 🔄 Listener para mudanças na sessão
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

  const fetchBarberData = async (userId: string) => {
    const { data, error } = await supabase
      .from("barbeiros")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error && data) setBarberData(data);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    await fetchBarberData(data.user.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBarberData(null);
  };

  const refreshBarberData = async () => {
    if (user?.id) await fetchBarberData(user.id);
  };

  const value = useMemo(
    () => ({ user, barberData, loading, login, logout, refreshBarberData }),
    [user, barberData, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <LoaderOverlay open={false} />
      {!loading && children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
//   return ctx;
// };
