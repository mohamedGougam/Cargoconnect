import { MapPanel } from "./MapPanel";
import { MatchSummaryCard } from "./MatchSummaryCard";
import { AIInsightsCard } from "./AIInsightsCard";
import { pagePaddingX } from "@/lib/layout";

export function DashboardSection() {
  return (
    <section
      id="marketplace"
      className={`scroll-mt-24 w-full pb-8 pt-1 ${pagePaddingX}`}
    >
      <div className="mx-auto w-full max-w-none rounded-2xl border border-white/5 bg-[#0B1F33]/40 p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white">
            Operations dashboard
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Route visualization with live match context and model-generated
            guidance.
          </p>
        </div>
        <div className="rounded-[20px] border border-white/6 bg-[#0F2A44] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_26px_70px_-30px_rgba(0,0,0,0.75)]">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[68fr_32fr] lg:gap-5 min-[1600px]:lg:grid-cols-[66fr_34fr] min-[1920px]:lg:grid-cols-[65fr_35fr] min-[1600px]:gap-5">
            <div id="routes" className="min-w-0 scroll-mt-24">
              <MapPanel />
            </div>
            <div className="flex min-w-0 flex-col gap-5 lg:border-l lg:border-white/8 lg:pl-5 min-[1600px]:gap-6 min-[1600px]:pl-6">
              <MatchSummaryCard />
              <AIInsightsCard />
              <div className="rounded-2xl border border-white/10 bg-[#122B45] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_46px_-22px_rgba(0,0,0,0.75)]">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Risk signals
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-400/80" />
                    <span>Weather window stable across Oman → Med corridor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400/80" />
                    <span>Low congestion risk at North Sea handoff (Rotterdam).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400/80" />
                    <span>Port dwell variance normal; no disruption signals detected.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
