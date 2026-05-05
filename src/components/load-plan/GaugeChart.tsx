"use client";

export function GaugeChart({ valueLabel }: { valueLabel: string }) {
  // Simple semicircle gauge to match reference (static visual).
  const r = 92;
  const cx = 120;
  const cy = 110;
  const startX = cx - r;
  const endX = cx + r;
  const d = `M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`;

  return (
    <div className="flex items-center justify-center">
      <div className="relative h-[160px] w-[240px]">
        <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden="true">
          <path
            d={d}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d={d}
            fill="none"
            stroke="#6D28D9"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="190 400"
          />
        </svg>
        <div className="absolute inset-x-0 top-[62px] text-center">
          <div className="text-[11px] font-medium text-slate-500">HJK</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900">
            {valueLabel}
          </div>
        </div>
        <div className="absolute left-0 right-0 top-2 flex justify-center gap-8 text-[10px] font-semibold text-slate-400">
          <span className="text-slate-900/70">HJK</span>
          <span>MRW</span>
          <span>QTZ</span>
          <span>XPN</span>
        </div>
      </div>
    </div>
  );
}

