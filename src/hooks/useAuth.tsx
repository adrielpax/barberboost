"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";

export interface BarberData {
  id: string;
  nome: string;
  email: string;
  barbershop_name: string;
  username: string;
  plan: "essencial" | "premium";
  public_link: string;
  avatar_url?: string;
  bio?: string;
  localizacao?: string;
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
  registerOrLoginLead: (data: {
    email: string;
    plan: "essencial" | "premium";
    barbershop_name: string;
    name: string;
  }) => Promise<void>;
  refreshBarberData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [barberData, setBarberData] = useState<BarberData | null>(null);
  const [loading, setLoading] = useState(true);

  // Rotas protegidas
  const protectedRoutes = ["/dashboard", "/painel", "/perfil"];

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setUser(data.session.user);
        await fetchBarberData(data.session.user.id);
      } else if (protectedRoutes.some((r) => pathname.startsWith(r))) {
        router.push("/login");
      }

      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchBarberData(session.user.id);
        } else {
          setUser(null);
          setBarberData(null);
          if (protectedRoutes.some((r) => pathname.startsWith(r))) {
            router.push("/login");
          }
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [pathname]);

  const fetchBarberData = async (userId: string) => {
    const { data, error } = await supabase
      .from("barbeiros")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) setBarberData(data);
  };

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
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBarberData(null);
    router.push("/login");
  };

  const preRegister = async (data: {
    name: string;
    email: string;
    password: string;
    barbershop_name: string;
    plan: "essencial" | "premium";
  }) => {
    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
          options: { data: { name: data.name } },
        }
      );

      if (signUpError || !authData.user) throw signUpError;

      const username = data.barbershop_name.toLowerCase().replace(/\s+/g, "-");

      const { data: barber, error: insertError } = await supabase
        .from("barbeiros")
        .insert([
          {
            id: authData.user.id,
            nome: data.name,
            email: data.email,
            barbershop_name: data.barbershop_name,
            username,
            plan: data.plan,
            public_link: `/barbeiro/${username}`,
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

  const registerOrLoginLead = async (data: {
    email: string;
    plan: "essencial" | "premium";
    barbershop_name: string;
    name: string;
  }) => {
    setLoading(true);
    try {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("*")
        .eq("email", data.email)
        .maybeSingle();

      if (!existingLead) {
        await supabase.from("leads").insert([
          {
            email: data.email,
            plan: data.plan,
            barbershop_name: data.barbershop_name,
            name: data.name,
          },
        ]);
      }
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
      registerOrLoginLead,
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
