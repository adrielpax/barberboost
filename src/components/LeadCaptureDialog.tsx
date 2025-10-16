"use client";

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
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
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

  const handleSubmit = async () => {
    try {
      // Simular salvamento do lead (pode ser substituído por uma API real)
      console.log("Lead captured:", formData);

      // Mostrar toast de sucesso
      toast({
        title: "Sucesso!",
        description: "Seu cadastro foi realizado com sucesso!",
      });

      setStep(3);

      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        onOpenChange(false);
        setStep(1);
        setFormData({
          name: "",
          whatsapp: "",
          email: "",
          password: "",
          barbershopName: "",
          plan: "essencial",
        });
        router.push(
          `/${encodeURIComponent(
            formData.barbershopName.toLowerCase().replace(/\s+/g, "-")
          )}`
        );
      }, 2000);
    } catch (error) {
      console.error("Error saving lead:", error);

      // Mostrar toast de erro
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar seus dados. Tente novamente.",
        variant: "destructive",
      });

      // Mesmo com erro, redirecionar (para demonstração)
      setStep(3);
      setTimeout(() => {
        onOpenChange(false);
        setStep(1);
        setFormData({
          name: "",
          whatsapp: "",
          email: "",
          password: "",
          barbershopName: "",
          plan: "essencial",
        });
        router.push(
          `/${encodeURIComponent(
            formData.barbershopName.toLowerCase().replace(/\s+/g, "-")
          )}`
        );
      }, 2000);
    }
  };

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
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barbershopName">Nome da Barbearia</Label>
                <Input
                  id="barbershopName"
                  placeholder="Ex: Barbearia do João"
                  value={formData.barbershopName}
                  onChange={(e) =>
                    setFormData({ ...formData, barbershopName: e.target.value })
                  }
                  data-testid="input-barbershop-name"
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
                  data-testid="input-whatsapp"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  data-testid="input-email"
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
                  data-testid="input-password"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={() => setStep(2)}
                disabled={
                  !formData.name ||
                  !formData.whatsapp ||
                  !formData.password ||
                  !formData.barbershopName
                }
                data-testid="button-next-step"
              >
                Continuar
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
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate ${
                    formData.plan === plan.id
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  data-testid={`plan-option-${plan.id}`}
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
                data-testid="button-submit-lead"
              >
                🚀 Criar minha conta
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
