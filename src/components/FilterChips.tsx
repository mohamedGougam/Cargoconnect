import { mockData } from "@/data";

export function FilterChips() {
  return (
    <div className="mt-5 flex flex-wrap justify-center gap-2">
      {mockData.filterChips.map((label) => (
        <button
          key={label}
          type="button"
          className="cursor-default rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:border-[#1E90FF]/40 hover:bg-[#1E90FF]/10 hover:text-white"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
