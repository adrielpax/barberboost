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
  preRegister: (data: {
    name: string;
    email: string;
    password: string;
    barbershop_name: string;
    plan: "essencial" | "premium";
  }) => Promise<void>;
  refreshBarberData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [barberData, setBarberData] = useState<BarberData | null>(null);
  const [loading, setLoading] = useState(true);

  // Inicializa sessão
  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
        await fetchBarberData(data.session.user.id);
      }
      setLoading(false);
    };
    init();

    // Escuta mudanças na sessão
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

  // Login
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      await fetchBarberData(data.user.id);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBarberData(null);
    router.push("/login");
  };

  // Pré-registro
  const preRegister = async (data: {
    name: string;
    email: string;
    password: string;
    barbershop_name: string;
    plan: "essencial" | "premium";
  }) => {
    setLoading(true);
    try {
      // Verifica se já existe usuário
      const { data: existingUser } = await supabase
        .from("barbeiros")
        .select("*")
        .eq("email", data.email)
        .single();
      if (existingUser) {
        router.push("/login");
        return;
      }

      // Cria usuário e barbeiro
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: { data: { name: data.name } },
        }
      );
      if (signUpError || !authData.user) throw signUpError;

      const { data: barber, error: insertError } = await supabase
        .from("barbeiros")
        .insert([
          {
            id: authData.user.id,
            name: data.name,
            email: data.email,
            barbershop_name: data.barbershop_name,
            plan: data.plan,
            public_link: `/barbeiro/${data.barbershop_name
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
          },
        ])
        .select()
        .single();
      if (insertError) throw insertError;

      setUser(authData.user);
      setBarberData(barber);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const refreshBarberData = async () => {
    if (user?.id) await fetchBarberData(user.id);
  };

  const value = useMemo(
    () => ({
      user,
      barberData,
      loading,
      login,
      logout,
      preRegister,
      refreshBarberData,
    }),
    [user, barberData, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      <LoaderOverlay open={false} />
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};
