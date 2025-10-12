import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, TrendingUp, ArrowDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

export default function PlanoProfissional() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCtaClick={() => setDialogOpen(true)} />
      
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <Badge className="bg-green-500 text-white border-0 mb-2">
              Mais vendido
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Plano Profissional
            </h1>
            <p className="text-xl text-muted-foreground">
              O plano mais usado por barbeiros que vivem lotados
            </p>
            <div className="py-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-primary">R$ 49</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-8 border-2 border-primary/20 space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Antes e depois do MeuBarbeiro Pro:</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background/80 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-destructive">❌ Antes</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Agenda bagunçada no papel</li>
                  <li>• Clientes esquecidos</li>
                  <li>• Sem controle financeiro</li>
                  <li>• Perda de tempo respondendo</li>
                </ul>
              </div>
              <div className="bg-background/80 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-green-500">✅ Depois</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Tudo organizado automaticamente</li>
                  <li>• Lembretes automáticos</li>
                  <li>• Controle total do caixa</li>
                  <li>• Mais tempo para trabalhar</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border space-y-6 mb-8">
            <h2 className="text-2xl font-bold">Tudo que você precisa:</h2>
            <ul className="space-y-4">
              {[
                "Tudo do plano Essencial",
                "Agendamentos ilimitados",
                "Painel completo + CRM profissional",
                "Controle financeiro (entradas e saídas)",
                "Automações avançadas de WhatsApp",
                "Suporte prioritário",
                "Relatórios detalhados"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Quer seu próprio app personalizado?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Com o Plano Premium você tem um app com o nome da sua barbearia, múltiplos barbeiros e suporte 24/7!
                </p>
                <Button 
                  variant="default"
                  onClick={() => window.location.href = '/plano-premium'}
                  data-testid="button-upsell-premium"
                >
                  Ver Plano Premium
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-center">
            <button 
              onClick={() => window.location.href = '/plano-essencial'}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
              data-testid="button-downsell-essencial"
            >
              <ArrowDown className="w-4 h-4" />
              Ainda não posso investir agora - Ver plano gratuito
            </button>
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="text-lg px-8 py-6"
              data-testid="button-start-pro"
            >
              🚀 Começar agora com o Pro
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Cancele quando quiser, sem multa
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <LeadCaptureDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        selectedPlan="profissional"
      />
    </div>
  );
}
