import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import heroImage from "@assets/stock_images/happy_barber_profess_4c2acd23.jpg";

interface HeroSectionProps {
  onCtaClick: () => void;
}

export default function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="bg-background py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex flex-col text-center justify-center items-center md:text-left space-y-4">
              <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold leading-tight">
                Seu agendamento no WhatsApp,{" "}
                <span className="text-primary">sem Complicação</span>💈
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Crie seu link de agendamento em menos de 1 minuto e nunca mais
                perca um cliente por mensagem esquecida.
              </p>
            </div>

            <div className="self-center sm:flex-row gap-4 ">
              <Button
                size="lg"
                onClick={onCtaClick}
                className="group relative w-full md:text-2xl px-8 py-6 
    bg-gradient-to-tr to-cyan-300 via-blue-500 from-blue-900
    shadow-lg shadow-gray-500 rounded-full 
    transition-all duration-500 ease-out
    hover:shadow-2xl hover:shadow-cyan-500/50 
    hover:scale-105 hover:-translate-y-1
    active:scale-100 active:translate-y-0
    overflow-hidden border-blue-500"
                data-testid="button-hero-cta"
              >
                {/* Shimmer effect */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
    translate-x-[-200%] group-hover:translate-x-[200%] 
    transition-transform duration-1000 ease-in-out"
                />

                {/* Gradient overlay on hover */}
                <span
                  className="absolute inset-0 bg-gradient-to-tr from-green-900 via-green-500 to-cyan-400 
    opacity-0 group-hover:opacity-100 
    transition-opacity duration-500 ease-in-out"
                />

                {/* Content */}
                <span className="relative flex items-center justify-center gap-2">
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    👉
                  </span>
                  <span>Criar meu link (Grátis)</span>
                  <ArrowRight
                    className="w-5 h-5 transition-transform duration-300 
      group-hover:translate-x-2 group-hover:scale-110"
                  />
                </span>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span>⭐ 500+ barbeiros cadastrados</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={heroImage}
                alt="Barbeiro profissional feliz"
                className="w-full h-auto"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
