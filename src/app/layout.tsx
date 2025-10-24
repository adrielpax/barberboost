import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meu Barbeiro",
  description: "automação com IA para barbearias e salões",
  manifest: "/manifest.json",
  themeColor: "#53cede",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meu Barbeiro App",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};
// export const metadata: Metadata = {
//   title: "Meu Barbeiro - Agendamento Automático pelo WhatsApp",
//   description:
//     "Crie seu link de agendamento em menos de 1 minuto e nunca mais perca um cliente por mensagem esquecida. Sistema profissional, rápido e automático para barbeiros.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#53cede" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
