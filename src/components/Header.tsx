import { Scissors, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onCtaClick: () => void;
}

export default function Header({ onCtaClick }: HeaderProps) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 bg-foreground rounded-full flex items-center justify-center">
            {/* <Scissors className="w-5 h-5 text-background" /> */}
            <img src="/icon-192.png" />
          </div>
          <span className="font-bold text-xl">Meu Barbeiro</span>
        </div>
        <div className="flex items-center gap-4 ">
          {/* <Link
            href="/pagina-barbearia"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Teste Barbearia
          </Link> */}
          <Button
            onClick={() => router.push("/login")}
            size={`sm`}
            data-testid="button-header-cta"
            className="bg-black text-white border-gray-100"
          >
            <User />
            <span className="">Entrar</span>
          </Button>
          <Button
            onClick={onCtaClick}
            size={`sm`}
            data-testid="button-header-cta"
            className="hidden md:block"
          >
            ✨ Criar
          </Button>
        </div>
      </div>
    </header>
  );
}
