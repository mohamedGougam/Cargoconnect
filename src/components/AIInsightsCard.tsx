import { Sparkles } from "lucide-react";
import { mockData } from "@/data";

export function AIInsightsCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#122B45] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_46px_-22px_rgba(0,0,0,0.75)]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1E90FF]/15 text-[#60a5fa] shadow-[0_0_0_1px_rgba(30,144,255,0.18)]">
          <Sparkles className="h-4 w-4" strokeWidth={2} />
        </span>
        <h3 className="text-sm font-semibold text-white">AI Insights</h3>
      </div>
      <ul className="mt-4 space-y-3">
        {mockData.insights.map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/5"
          >
            <span className="mt-0.5 text-teal-300">—</span>
            <span className="text-sm leading-snug text-slate-200">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
