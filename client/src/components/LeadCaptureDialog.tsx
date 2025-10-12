import { useState } from "react";
import { useLocation } from "wouter";
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
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

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
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    email: "",
    plan: selectedPlan || "essencial",
  });

  const plans = [
    { id: "essencial", name: "Essencial", price: "Grátis" },
    { id: "profissional", name: "Profissional", price: "R$ 49/mês" },
    { id: "premium", name: "Premium", price: "R$ 149/mês" },
  ];

  const handleSubmit = async () => {
    try {
      // Salvar lead no Firestore
      await addDoc(collection(db, "leads"), {
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        plan: formData.plan,
        status: "pending",
        createdAt: new Date(),
      });

      console.log("Lead captured and saved to Firestore:", formData);
      setStep(3);
      
      // Redirecionar para o dashboard após 2 segundos
      setTimeout(() => {
        onOpenChange(false);
        setStep(1);
        setFormData({ name: "", whatsapp: "", email: "", plan: "essencial" });
        setLocation("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error saving lead:", error);
      // Mesmo com erro, redirecionar (para demonstração)
      setStep(3);
      setTimeout(() => {
        onOpenChange(false);
        setStep(1);
        setFormData({ name: "", whatsapp: "", email: "", plan: "essencial" });
        setLocation("/dashboard");
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

              <Button
                className="w-full"
                size="lg"
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.whatsapp}
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
