import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { AISearchBar } from "@/components/AISearchBar";
import { DashboardSection } from "@/components/DashboardSection";
import { ResultsGrid } from "@/components/ResultsGrid";
import { PortPanel } from "@/components/PortPanel";
import { AIAssistantPanel } from "@/components/AIAssistantPanel";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-[#0B1F33] pb-24 lg:pb-8">
      <Navbar />
      <main className="w-full min-w-0 flex-1 lg:pr-[340px]">
        <div className="mx-auto w-full max-w-[1600px] px-8 min-[1600px]:max-w-[1700px] min-[1920px]:max-w-[1900px]">
          <HeroSection />
          <AISearchBar />
          <DashboardSection />
          <ResultsGrid />
          <PortPanel />
        </div>
        <div id="pricing" className="h-px w-full scroll-mt-24 opacity-0" aria-hidden />
      </main>
      <AIAssistantPanel />
    </div>
  );
}
