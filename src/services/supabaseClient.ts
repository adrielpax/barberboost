import { createClient } from "@supabase/supabase-js";

// 🔹 Variáveis de ambiente seguras
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 🔹 Instância principal do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// 🔹 Helper: criar barbeiro (pré-registro ou registro completo)
export async function createBarber(data: {
  name: string;
  email: string;
  password: string;
  barbershop_name: string;
  plan: "essencial" | "premium";
}) {
  try {
    // 1️⃣ Cria o usuário de autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name } },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Falha ao criar usuário.");

    // 2️⃣ Cria o registro na tabela `barbers`
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

    // 3️⃣ Retorna usuário, barbeiro e token JWT
    const token = authData.session?.access_token || null;

    return {
      user: authData.user,
      barber,
      token,
    };
  } catch (err: any) {
    console.error("Erro ao criar barbeiro:", err);
    throw new Error(err.message || "Erro ao registrar barbeiro.");
  }
}

// 🔹 Helper: obter token JWT da sessão atual
export async function getJWTToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
}
