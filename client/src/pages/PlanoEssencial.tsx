import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

export default function PlanoEssencial() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCtaClick={() => setDialogOpen(true)} />
      
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Plano Essencial
            </h1>
            <p className="text-xl text-muted-foreground">
              Sem cartão, sem complicação. Teste agora, atualize depois.
            </p>
            <div className="py-4">
              <div className="text-6xl font-bold text-primary">Grátis</div>
              <p className="text-muted-foreground mt-2">Para sempre</p>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border space-y-6 mb-8">
            <h2 className="text-2xl font-bold">O que está incluído:</h2>
            <ul className="space-y-4">
              {[
                "Link de agendamento personalizado",
                "Lembretes automáticos por WhatsApp",
                "Até 50 agendamentos por mês",
                "Painel básico de controle",
                "Suporte por email"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Quer automações e controle de caixa?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Upgrade para o Plano Profissional e tenha agendamentos ilimitados, CRM completo e muito mais!
                </p>
                <Button 
                  variant="default"
                  onClick={() => window.location.href = '/plano-profissional'}
                  data-testid="button-upsell-pro"
                >
                  Ver Plano Profissional
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="text-lg px-8 py-6"
              data-testid="button-start-free"
            >
              🚀 Começar grátis agora
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Sem cartão de crédito necessário
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <LeadCaptureDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        selectedPlan="essencial"
      />
    </div>
  );
}
