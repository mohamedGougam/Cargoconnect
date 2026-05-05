"use client";

import { MoreHorizontal } from "lucide-react";
import type { PayloadRow } from "@/components/load-plan/types";

function Tag({ label }: { label: string }) {
  const cls =
    label === "USNYC"
      ? "bg-[#FFF4CC] text-[#8A6A00] border-[#F2DD93]"
      : label === "CNSHA"
        ? "bg-[#E8F7EE] text-[#1D6B3A] border-[#BFE8CF]"
        : "bg-[#EAF2FF] text-[#1F4FBF] border-[#C7DBFF]";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export function PayloadList({ rows }: { rows: PayloadRow[] }) {
  return (
    <div className="rounded-[16px] border border-slate-200">
      <div className="grid grid-cols-[44px_1fr_84px_74px_28px] items-center gap-2 border-b border-slate-200 px-3 py-2 text-[11px] font-semibold text-slate-500">
        <span> </span>
        <span>Payload</span>
        <span className="text-right">Weight</span>
        <span className="text-right"> </span>
        <span> </span>
      </div>
      <div className="divide-y divide-slate-200">
        {rows.map((r, idx) => (
          <div
            key={`${r.section}-${idx}`}
            className="grid grid-cols-[44px_1fr_84px_74px_28px] items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50"
          >
            <span className="text-[11px] font-semibold text-slate-600">{r.section}</span>
            <span className="truncate font-medium text-slate-800">{r.ref}</span>
            <span className="text-right font-semibold tabular-nums text-slate-700">
              {r.kg.toLocaleString("en-US")} kg
            </span>
            <span className="flex justify-end">
              <Tag label={r.tag} />
            </span>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Row actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

