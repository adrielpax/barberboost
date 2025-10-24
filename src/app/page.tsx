"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import PlansSection from "@/components/PlansSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";
import { useAppModeRedirect } from "@/hooks/useAppMode";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>();

  useAppModeRedirect();

  useEffect(() => {
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isStandalone) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleCtaClick = () => {
    setDialogOpen(true);
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header onCtaClick={handleCtaClick} />
      <HeroSection onCtaClick={handleCtaClick} />
      <ProblemSection />
      <SolutionSection onCtaClick={handleCtaClick} />
      <PlansSection onPlanSelect={handlePlanSelect} />
      <TestimonialsSection />
      <FinalCtaSection onCtaClick={handleCtaClick} />
      <Footer />

      <LeadCaptureDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}
