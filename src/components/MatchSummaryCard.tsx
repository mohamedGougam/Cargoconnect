import { mockData } from "@/data";
import { StatItem } from "./StatItem";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function MatchSummaryCard() {
  const m = mockData.matchSummary;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#122B45] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_46px_-22px_rgba(0,0,0,0.75)]">
      <div className="absolute right-5 top-5 text-right">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Match score
        </p>
        <p className="text-[44px] font-bold tabular-nums leading-none tracking-tight text-[#1E90FF] [text-shadow:0_0_22px_rgba(30,144,255,0.35)]">
          {m.matchScore}
          <span className="text-2xl font-semibold">%</span>
        </p>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Decision engine
      </p>
      <h3 className="mt-1 pr-32 text-lg font-semibold text-white">
        Route: {m.route.from}{" "}
        <span className="text-slate-400 font-normal">→</span> {m.route.to}
      </h3>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatItem
          label="Est. cost"
          value={formatUsd(m.estimatedCostUsd)}
          emphasize
        />
        <StatItem
          label="Duration"
          value={`${m.estimatedDurationDays} days`}
          emphasize
        />
        <StatItem label="Risk level" value={m.riskLevel} />
        <StatItem label="Carbon efficiency" value={m.carbonEfficiency} />
      </div>
    </div>
  );
}
