"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAppModeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isStandalone && window.location.pathname === "/") {
      router.replace("/dashboard");
    }
  }, [router]);
}
