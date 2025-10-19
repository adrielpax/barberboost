import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface FinalCtaSectionProps {
  onCtaClick: () => void;
}

export default function FinalCtaSection({ onCtaClick }: FinalCtaSectionProps) {
  return (
    <section className="bg-[hsl(220,30%,15%)] py-16 md:py-24 lg:py-32 text-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <div className="flex flex-col space-y-8">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            🔄 Está pronto para parar de perder tempo e começar a lucrar mais?
          </h2>

          <p className="text-xl text-white/80 leading-relaxed">
            Junte-se a centenas de barbeiros que já automatizaram seus
            agendamentos
          </p>
          <span>Crie seu link agora e comece em 1 minuto</span>
          <Button
            size="default"
            onClick={onCtaClick}
            className="md:text-lg px-8 py-6 bg-primary hover:bg-primary/90 w-full animate-bounce"
            data-testid="button-final-cta animate-bounce"
          >
            👉 Criar meu link agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-sm text-white/60">
            Sem cartão de crédito necessário para começar
          </p>
        </div>
      </div>
    </section>
  );
}
