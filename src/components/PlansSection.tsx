import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface PlansSectionProps {
  onPlanSelect: (plan: string) => void;
}

export default function PlansSection({ onPlanSelect }: PlansSectionProps) {
  const plans = [
    {
      name: "Essencial",
      price: "Grátis",
      period: "",
      description: "Ideal para iniciantes",
      badge: null,
      features: [
        "Link de agendamento",
        "Lembretes automáticos",
        "Até 50 agendamentos/mês",
        "Suporte por email"
      ]
    },
    {
      name: "Profissional",
      price: "R$ 49",
      period: "/mês",
      description: "Barbeiros fixos",
      badge: "Mais vendido",
      features: [
        "Tudo do Essencial",
        "Agendamentos ilimitados",
        "Painel completo + CRM",
        "Controle financeiro",
        "Automações avançadas",
        "Suporte prioritário"
      ]
    },
    {
      name: "Premium",
      price: "R$ 149",
      period: "/mês",
      description: "Barbearias",
      badge: null,
      features: [
        "Tudo do Profissional",
        "App personalizado",
        "Múltiplos barbeiros",
        "Suporte dedicado 24/7",
        "Remarketing automático",
        "Relatórios avançados"
      ]
    }
  ];

  return (
    <section className="bg-[hsl(220,30%,15%)] py-16 md:py-24 lg:py-32 text-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            💎 Escolha o plano ideal para o seu negócio
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Comece grátis e evolua conforme seu negócio cresce 👇
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-lg p-8 space-y-6 border transition-all ${
                plan.badge 
                  ? 'bg-white text-foreground border-primary shadow-2xl scale-105' 
                  : 'bg-white/5 backdrop-blur-sm border-white/10 hover-elevate'
              }`}
              data-testid={`plan-card-${plan.name.toLowerCase()}`}
            >
              {plan.badge && (
                <Badge className="bg-green-500 text-white border-0">
                  {plan.badge}
                </Badge>
              )}
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={plan.badge ? "text-muted-foreground" : "text-white/70"}>
                  {plan.description}
                </p>
              </div>

              <div className="py-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-xl">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={plan.badge ? "text-foreground" : "text-white/90"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => onPlanSelect(plan.name.toLowerCase())}
                variant={plan.badge ? "default" : "outline"}
                className="w-full"
                size="lg"
                data-testid={`button-select-${plan.name.toLowerCase()}`}
              >
                🚀 Começar agora
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-200">
            ⚠️ Vagas limitadas para o plano Profissional no lançamento — garanta a sua antes do aumento.
          </p>
        </div>
      </div>
    </section>
  );
}
