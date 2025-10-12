import { useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import PlansSection from "@/components/PlansSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import LeadCaptureDialog from "@/components/LeadCaptureDialog";

export default function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>();

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
