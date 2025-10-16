"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Crown, ArrowDown, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

export default function PlanoPremiumPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onCtaClick={() => setDialogOpen(true)} />

      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                Master
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Plano Premium
            </h1>
            <p className="text-xl text-muted-foreground">
              Seu nome, seu app, seu estilo — como os grandes
            </p>
            <div className="py-4">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl font-bold text-primary">R$ 149</span>
                <span className="text-2xl text-muted-foreground">/mês</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-8 border-2 border-yellow-500/20 space-y-6 mb-8">
            <div className="flex items-start gap-3">
              <Zap className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Tenha sua própria plataforma
                </h2>
                <p className="text-lg text-muted-foreground">
                  Um aplicativo completo com o nome e identidade visual da sua
                  barbearia. Seus clientes vão achar que você investiu milhares!
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 border space-y-6 mb-8">
            <h2 className="text-2xl font-bold">
              Tudo que você precisa e muito mais:
            </h2>
            <ul className="space-y-4">
              {[
                "Tudo do plano Profissional",
                "App personalizado com sua marca",
                "Gestão de múltiplos barbeiros",
                "Suporte dedicado 24/7 (WhatsApp direto)",
                "Remarketing automático para clientes inativos",
                "Relatórios avançados e analytics",
                "Programa de fidelidade integrado",
                "Customização completa do sistema",
                "Treinamento completo para sua equipe",
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-4">
            <div className="text-center space-y-3">
              <h3 className="font-semibold text-lg">
                💼 Ideal para barbearias com 3+ profissionais
              </h3>
              <p className="text-muted-foreground">
                Tenha total controle sobre sua operação e destaque-se da
                concorrência
              </p>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mb-8 text-center">
            <Link
              href="/plano-profissional"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
              data-testid="button-downsell-pro"
            >
              <ArrowDown className="w-4 h-4" />
              Prefiro começar com o Profissional
            </Link>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="text-lg px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              data-testid="button-start-premium"
            >
              👑 Começar agora com o Premium
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Demonstração gratuita disponível
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <LeadCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedPlan="premium"
      />
    </div>
  );
}
