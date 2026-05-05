"use client";

import type { PortTimelineItem } from "@/components/load-plan/types";

export function SidebarPortCard({ item }: { item: PortTimelineItem }) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_0_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">{item.code}</div>
        <span className="inline-flex items-center rounded-full border border-[#BFE8CF] bg-[#E8F7EE] px-2 py-0.5 text-[11px] font-semibold text-[#1D6B3A]">
          {item.status}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
        <div>
          <div className="text-[11px] font-medium text-slate-400">Departure Date</div>
          <div className="mt-1 font-semibold text-slate-800">{item.departure}</div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Arrival Date</div>
          <div className="mt-1 font-semibold text-slate-800">
            {item.arrival ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}

