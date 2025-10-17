import { Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeaderProps {
  onCtaClick: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-cyan-500 to-blue-500 bg-foreground rounded-full flex items-center justify-center">
            <Scissors className="w-5 h-5 text-background" />
          </div>
          <span className="font-bold text-xl">Meu Barbeiro</span>
        </div>
        <div className="flex items-center gap-4">
          {/* <Link
            href="/pagina-barbearia"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Teste Barbearia
          </Link> */}
          <Button
            onClick={onCtaClick}
            size="default"
            data-testid="button-header-cta"
          >
            Criar meu link grátis ✨
          </Button>
        </div>
      </div>
    </header>
  );
}
