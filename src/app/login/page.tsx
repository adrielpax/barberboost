"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  Scissors,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validar campos
      if (!email || !password) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha email e senha para continuar",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Validar email básico
      if (!email.includes("@")) {
        toast({
          title: "Email inválido",
          description: "Digite um email válido",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Chamar login (ele já redireciona automaticamente se sucesso)
      await login(email, password);

      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso",
      });
    } catch (err: any) {
      console.error("Erro no login:", err);

      let errorMessage = "Ocorreu um erro ao tentar fazer login";

      // Tratar erros específicos do Supabase
      if (err?.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos";
      } else if (err?.message?.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Verifique sua caixa de entrada";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      toast({
        title: "Erro ao logar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LoaderOverlay open={authLoading || submitting} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl">Meu Barbeiro</span>
          </div>
          <p className="text-slate-600 text-sm">
            Gerenciador de agendamentos para barbeiros
          </p>
        </div>

        {/* Card Login */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Bem-vindo
            </h1>
            <p className="text-slate-600 text-sm">
              Faça login na sua conta para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting || authLoading}
                  className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting || authLoading}
                  className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={submitting || authLoading}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-600">Lembrar-me</span>
              </label>
              <button
                type="button"
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 h-auto gap-2"
              disabled={submitting || authLoading || !email || !password}
            >
              {submitting || authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-500">Ou</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-slate-600 text-sm">
              Não tem conta?{" "}
              <Link
                href="/"
                className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
              >
                Cadastre-se agora
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          Ao entrar, você concorda com nossos{" "}
          <button className="text-cyan-600 hover:underline">
            Termos de Uso
          </button>
          {" e "}
          <button className="text-cyan-600 hover:underline">
            Política de Privacidade
          </button>
        </p>
      </div>
    </>
  );
}
