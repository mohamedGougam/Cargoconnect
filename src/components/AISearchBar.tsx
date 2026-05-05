import { Search } from "lucide-react";
import { FilterChips } from "./FilterChips";
import { pagePaddingX } from "@/lib/layout";

export function AISearchBar() {
  return (
    <section
      id="ai-search"
      className={`scroll-mt-24 pb-6 pt-5 sm:pb-8 sm:pt-6 ${pagePaddingX} w-full`}
    >
      <div className="mx-auto w-full max-w-[1000px] min-[1600px]:max-w-[1100px] min-[1920px]:max-w-[1200px]">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-22px_rgba(0,0,0,0.6)]">
          <div className="relative min-h-14 rounded-xl border border-white/10 bg-[#061525]/55">
            <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-white/5 text-[#60a5fa] ring-1 ring-white/10">
              <Search className="h-5 w-5" strokeWidth={2} />
            </div>
            <input
              type="search"
              readOnly
              placeholder="Ship 120 containers from Piraeus to Rotterdam within 5 days under $50k"
              className="h-full min-h-14 w-full cursor-text rounded-xl bg-transparent py-3 pl-[3.75rem] pr-4 text-[15px] text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/25"
            />
          </div>
        </div>
        <FilterChips />
      </div>
    </section>
  );
}
