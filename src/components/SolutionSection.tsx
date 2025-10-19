import { Button } from "@/components/ui/button";
import { CheckCircle2, Bell, Calendar, TrendingUp } from "lucide-react";

interface SolutionSectionProps {
  onCtaClick: () => void;
}

export default function SolutionSection({ onCtaClick }: SolutionSectionProps) {
  const benefits = [
    {
      icon: Calendar,
      title: "Clientes agendam sozinhos",
      description:
        "Seu link funciona 24/7. Eles escolhem o horário, você só confirma.",
    },
    {
      icon: Bell,
      title: "Notificações automáticas",
      description:
        "Receba alertas de novos agendamentos e confirmações em tempo real.",
    },
    {
      icon: TrendingUp,
      title: "Agenda se organiza sozinha",
      description:
        "Painel intuitivo mostra tudo: próximos cortes, horários livres e histórico.",
    },
  ];

  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            🚀 Com o <span className="text-primary">MeuBarbeiro</span>, você
            automatiza tudo
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Em poucos cliques, você transforma sua rotina caótica em uma
            barbearia digital.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="space-y-4 p-6 rounded-lg border bg-card hover-elevate transition-all"
              data-testid={`benefit-card-${index}`}
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                <benefit.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="md:text-lg px-8 py-6 w-full animate-bounce"
            data-testid="button-solution-cta"
          >
            💬 Criar meu link ( Gratuito )
          </Button>
        </div>
      </div>
    </section>
  );
}
