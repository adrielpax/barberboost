// ============================================
// 3. PROTECTED PAGE WRAPPER
// ============================================
"use client";

import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

export function ProtectedPage({ children }: { children: ReactNode }) {
  const { user, barberData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) return <div>Carregando...</div>;
  if (!user) return null;

  return <>{children}</>;
}
