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

interface LeadCaptureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan?: string;
}

export default function LeadCaptureDialog({
  open,
  onOpenChange,
  selectedPlan,
}: LeadCaptureDialogProps) {
  const { preRegister, login, registerOrLoginLead } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    password: "",
    barbershopName: "",
    plan: selectedPlan || "essencial",
  });

  const plans = [
    { id: "essencial", name: "Essencial", price: "Grátis" },
    { id: "profissional", name: "Profissional", price: "R$ 49/mês" },
    { id: "premium", name: "Premium", price: "R$ 149/mês" },
  ];

  // 🔎 Verifica se o email já está cadastrado
  const checkEmailExists = async (email: string) => {
    if (!email) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users") // ou "leads", depende da sua tabela
        .select("*")
        .eq("email", email)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data || null;
    } catch (err) {
      console.error("Erro ao verificar email:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleEmailValidation = async () => {
    const existingUser = await checkEmailExists(formData.email);

    if (existingUser) {
      // ✅ Se o usuário já existe, faz login automático
      toast({
        title: "Bem-vindo de volta! 👋",
        description: "Fazendo login na sua conta...",
      });

      setLoading(true);
      try {
        await login(existingUser.email, formData.password);
        setTimeout(() => {
          onOpenChange(false);
          router.push("/dashboard");
        }, 1500);
      } catch (error) {
        console.error("Erro no login automático:", error);
        toast({
          title: "Erro ao logar",
          description: "Verifique sua senha ou tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return true;
    }

    return false;
  };

  // Step 1: valida email e vai para Step 2
  const handleStart = async () => {
    if (!formData.name || !formData.email || !formData.barbershopName) {
      toast({
        title: "Preencha os campos",
        description: "Nome, email e nome da barbearia são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const alreadyExists = await handleEmailValidation();
      if (alreadyExists) return; // login automático feito, não avança

      // Não existe → vai para escolher o plano
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: envia dados finais para criar lead/barbeiro
  const handleSubmit = async () => {
    if (!formData.plan) {
      toast({
        title: "Escolha um plano",
        description: "Selecione um plano antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerOrLoginLead({
        email: formData.email,
        plan: formData.plan as "essencial" | "premium",
        barbershop_name: formData.barbershopName,
        name: formData.name,
      });

      toast({
        title: "Sucesso!",
        description:
          "Sua conta foi criada e você será redirecionado ao dashboard!",
      });

      setStep(3);
      setTimeout(() => {
        onOpenChange(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast({
        title: "Erro",
        description: "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSubmit = async () => {
  //   if (
  //     !formData.name ||
  //     !formData.whatsapp ||
  //     !formData.password ||
  //     !formData.barbershopName ||
  //     !formData.plan
  //   )
  //     return;

  //   setStep(2); // Mantém o passo de plano visível enquanto processa
  //   setIsLoading(true); // novo estado de loading

  //   try {
  //     // 🔍 Verifica se o e-mail já existe
  //     const { data: existingUser, error: existingError } = await supabase
  //       .from("leads")
  //       .select("*")
  //       .eq("email", formData.email)
  //       .maybeSingle();

  //     if (existingError && existingError.code !== "PGRST116") {
  //       throw existingError;
  //     }

  //     if (existingUser) {
  //       // ✅ Já existe → login direto
  //       toast({
  //         title: "Bem-vindo de volta! 👋",
  //         description: "Login realizado com sucesso!",
  //       });

  //       await preRegister(existingUser); // se seu AuthContext usa isso como login
  //       router.push("/dashboard");
  //       return;
  //     }

  //     // 🆕 Não existe → faz o pré-registro normalmente
  //     await preRegister({
  //       name: formData.name,
  //       email: formData.email,
  //       password: formData.password,
  //       barbershop_name: formData.barbershopName,
  //       plan: formData.plan as any,
  //     });

  //     toast({
  //       title: "Sucesso!",
  //       description:
  //         "Sua conta foi criada e você será redirecionado ao dashboard!",
  //     });

  //     setStep(3);

  //     setTimeout(() => {
  //       onOpenChange(false);
  //       setStep(1);
  //       setFormData({
  //         name: "",
  //         whatsapp: "",
  //         email: "",
  //         password: "",
  //         barbershopName: "",
  //         plan: "essencial",
  //       });
  //       router.push("/dashboard");
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Erro ao registrar lead:", error);
  //     toast({
  //       title: "Erro",
  //       description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (
  //     !formData.name ||
  //     !formData.whatsapp ||
  //     !formData.password ||
  //     !formData.barbershopName
  //   )
  //     return;

  //   setStep(2);

  //   try {
  //     const alreadyExists = await handleEmailValidation();
  //     if (alreadyExists) return;

  //     // 🆕 Registro normal
  //     await preRegister({
  //       name: formData.name,
  //       email: formData.email,
  //       password: formData.password,
  //       barbershop_name: formData.barbershopName,
  //       plan: formData.plan as any,
  //     });

  //     toast({
  //       title: "Sucesso!",
  //       description:
  //         "Sua conta foi criada e você será redirecionado ao dashboard!",
  //     });

  //     setStep(3);

  //     setTimeout(() => {
  //       onOpenChange(false);
  //       setStep(1);
  //       setFormData({
  //         name: "",
  //         whatsapp: "",
  //         email: "",
  //         password: "",
  //         barbershopName: "",
  //         plan: "essencial",
  //       });
  //       router.push("/dashboard");
  //     }, 2000);
  //   } catch (error) {
  //     console.error("Erro ao registrar lead:", error);
  //     toast({
  //       title: "Erro",
  //       description: "Ocorreu um erro ao criar sua conta. Tente novamente.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
              <div className="space-y-2">
                <Label htmlFor="barbershopName">Nome da Barbearia</Label>
                <Input
                  id="barbershopName"
                  placeholder="Ex: Barbearia do João"
                  value={formData.barbershopName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      barbershopName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  onBlur={handleEmailValidation} // 🔥 valida automaticamente ao sair do campo
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="(11) 99999-9999"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Crie uma senha segura"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleStart}
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.whatsapp ||
                  !formData.password ||
                  !formData.barbershopName
                }
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
              <DialogTitle className="text-2xl">
                Escolha seu plano 💎
              </DialogTitle>
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

              <Button className="w-full" size="lg" onClick={handleSubmit}>
                {isLoading ? (
                  <span className="loader border-white border-t-transparent rounded-full w-4 h-4 animate-spin"></span>
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
              Conta criada com sucesso! 🎉
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
