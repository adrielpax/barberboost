// ============================================
// 1. LEAD CAPTURE DIALOG - CORRIGIDO
// ============================================
"use client";

import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { z } from "zod";

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan?: string;
}

const leadSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres."),
  whatsapp: z.string().max(11, "WhatsApp inválido"),
  email: z.string().email("Email inválido."),
  senha: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula.")
    .regex(/[0-9]/, "A senha deve conter ao menos um número."),
  barbershop_name: z.string().min(2, "Nome da barbearia é obrigatório."),
  plan: z.enum(["essencial", "profissional", "premium"]),
});

export default function LeadCaptureDialog({
  open,
  onOpenChange,
  selectedPlan,
}: LeadCaptureDialogProps) {
  const { refreshBarberData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    whatsapp: "",
    email: "",
    senha: "",
    barbershop_name: "",
    plan: selectedPlan || "essencial",
    slug: "",
  });

  const plans = [
    { id: "essencial", name: "Essencial", price: "Grátis" },
    { id: "profissional", name: "Profissional", price: "R$ 49/mês" },
    { id: "premium", name: "Premium", price: "R$ 149/mês" },
  ];

  function slugify(text: string): string {
    return text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-") // troca espaços por hífens
      .replace(/[^a-z0-9\-]/g, ""); // remove caracteres especiais
  }

  // Step 1: Validar dados básicos
  const handleStart = async () => {
    try {
      leadSchema
        .pick({
          nome: true,
          email: true,
          whatsapp: true,
          senha: true,
          barbershop_name: true,
        })
        .parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Campos inválidos",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      // Verifica se email já existe
      const { data: existingUser } = await supabase
        .from("barbeiros")
        .select("id")
        .eq("email", formData.email)
        .maybeSingle();

      if (existingUser) {
        toast({
          title: "Email já registrado",
          description: "Use outro email ou faça login",
          variant: "destructive",
        });
        return;
      }

      setStep(2);
    } catch (err) {
      toast({
        title: "Erro ao validar email",
        description: "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Criar conta e barbeiro
  const handleSubmit = async () => {
    try {
      leadSchema.parse(formData);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Erro de validação",
          description: err.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    try {
      // 1️⃣ Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: { nome: formData.nome },
        },
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || "Erro ao criar usuário");
      }

      const userId = authData.user.id;

      const slug = slugify(formData.barbershop_name);

      // 2️⃣ Criar registro na tabela barbeiros COM O MESMO ID
      const { error: insertError } = await supabase.from("barbeiros").insert([
        {
          id: userId, // 🔑 USE O ID DO AUTH
          nome: formData.nome,
          email: formData.email,
          whatsapp: formData.whatsapp,
          barbershop_name: formData.barbershop_name,
          plan: formData.plan,
          status: "aberto",
          slug,
        },
      ]);

      if (insertError) {
        // Se falhar ao inserir, delete o usuário do Auth
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(insertError.message || "Erro ao criar perfil");
      }

      // 3️⃣ Atualizar dados do contexto
      await refreshBarberData();

      toast({
        title: "Sucesso!",
        description: "Conta criada! Redirecionando...",
      });

      setStep(3);
      setTimeout(() => {
        onOpenChange(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erro ao criar conta";
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-lg border bg-white">
        {step === 1 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Comece sua jornada agora! 🚀
              </DialogTitle>
              <DialogDescription>
                Preencha seus dados para criar sua conta gratuita
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {["barbershop_name", "nome", "email", "whatsapp", "senha"].map(
                (field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field}>
                      {{
                        barbershop_name: "Nome da sua Barbearia",
                        nome: "Seu nome completo",
                        email: "Email",
                        whatsapp: "WhatsApp",
                        senha: "Senha",
                      }[field] || ""}
                    </Label>
                    <Input
                      id={field}
                      type={field === "senha" ? "password" : "text"}
                      placeholder={
                        {
                          barbershop_name: "Ex: Barbearia do João",
                          nome: "Seu nome",
                          email: "seu@email.com",
                          whatsapp: "(11) 99999-9999",
                          senha: "Crie uma senha segura",
                        }[field]
                      }
                      value={(formData as any)[field]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleStart}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Continuar"
                )}
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Escolha seu plano</DialogTitle>
              <DialogDescription>
                Você pode mudar depois a qualquer momento
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setFormData({ ...formData, plan: plan.id })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.plan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{plan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {plan.price}
                      </p>
                    </div>
                    {formData.plan === plan.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </div>
              ))}

              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "🚀 Criar minha conta"
                )}
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <DialogTitle className="text-2xl">
              Conta criada com sucesso!
            </DialogTitle>
            <DialogDescription>
              Redirecionando para seu painel...
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// 4. DASHBOARD - USO CORRETO
// ============================================
// "use client";

// import { useAuth } from "@/context/AuthProvider";
// import { useFetchSupabase } from "@/hooks/useFetchSupabase";
// import { ProtectedPage } from "@/components/ProtectWrapper";

// export default function DashboardPage() {
//   const { barberData, user, loading } = useAuth();

//   // ✅ CORRETO: Agora barberData SEMPRE terá o id
//   const { data: barbershop } = useFetchSupabase({
//     table: "barbeiros",
//     filters: { id: barberData?.id },
//     enabled: !!barberData?.id, // Só busca se barberData?.id existir
//   });

//   if (loading) return <div>Carregando...</div>;
//   if (!barberData) return <div>Erro ao carregar dados</div>;

//   return (
//     <ProtectedPage>
//       <div>
//         <h1>Bem-vindo, {barberData.nome}!</h1>
//         <p>Barbearia: {barberData.barbershop_name}</p>
//         <p>Plano: {barberData.plan}</p>
//         {/* Resto do dashboard */}
//       </div>
//     </ProtectedPage>
//   );
// }
