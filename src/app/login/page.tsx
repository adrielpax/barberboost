import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Loader Overlay Melhorado
export function LoaderOverlay({ open }: { open: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-12 h-12 text-cyan-500" strokeWidth={2} />
            </motion.div>
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-sm text-gray-300 font-medium tracking-wide"
            >
              Carregando...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Login Page Melhorada
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    // Simulação - remover e usar signIn real
    setTimeout(() => {
      if (!email || !password) {
        setError("Preencha todos os campos");
        setSubmitting(false);
        return;
      }
      console.log("Login:", { email, password });
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Loader Overlay */}
      <LoaderOverlay open={submitting} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-2xl blur-xl" />

        <div className="relative bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Bem-vindo</h1>
            <p className="text-gray-400 text-sm">Faça login na sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
                <input
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg pl-10 pr-10 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting || !email || !password}
              className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:from-cyan-600/50 disabled:to-cyan-500/50 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-4">
              Não tem conta?{" "}
              <button
                type="button"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
