"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { LoaderOverlay } from "@/components/ui/LoaderOverlay";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock, Scissors } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { login } = useAuth();
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
      if (!email || !password) {
        toast({
          title: "Erro",
          description: "Preencha todos os campos",
          variant: "destructive",
        });
        return;
      }

      await login(email, password);
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso",
      });
      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro ao logar",
        description: err.message || "Ocorreu um erro ao tentar fazer login.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <LoaderOverlay open={submitting} />

        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <Scissors className="w-5 h-5 text-background" />
          </div>
          <span className="font-bold text-xl">Meu Barbeiro</span>
        </div>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
          <p className="text-gray-500 mb-6 text-sm">Faça login na sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={submitting || !email || !password}
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>

            {/* Footer */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Não tem conta?{" "}
              <button
                type="button"
                className="text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
