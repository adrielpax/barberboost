import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Barbeiro - Agendamento Automático pelo WhatsApp",
  description:
    "Crie seu link de agendamento em menos de 1 minuto e nunca mais perca um cliente por mensagem esquecida. Sistema profissional, rápido e automático para barbeiros.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
