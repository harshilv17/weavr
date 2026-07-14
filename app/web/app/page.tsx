"use client";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landingPage/HeroSection";
import { WorkflowBuilder } from "@/components/landingPage/WorkflowBuilder";
import { MonitoringSection } from "@/components/landingPage/MonitoringSection";
import { IntegrationsSection } from "@/components/landingPage/IntegrationsSection";
import { FinalCTA } from "@/components/landingPage/FinalCTA";
import { Footer } from "@/components/landingPage/Footer";
import { useMe } from "@/hooks/useMe";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function App() {
  const { user, loading, route } = useMe();
  const routes = useRouter();

  useEffect(() => {
    if (user) {
      routes.push("/dashboard");
    }
  }, [user, loading, route]);

  return (
    <div
      className="page-root"
      style={{ background: "#060608", color: "#F0EEE9", fontFamily: "var(--font-body)" }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <IntegrationsSection />
        <WorkflowBuilder />
        <MonitoringSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
