"use client";

import { motion } from "framer-motion";
import { ChevronDown, Bell, User } from "lucide-react";

function Badge({
  label,
  tone,
}: {
  label: string;
  tone: "yellow" | "green" | "blue";
}) {
  const cls =
    tone === "yellow"
      ? "bg-[#FFF4CC] text-[#8A6A00] border-[#F2DD93]"
      : tone === "green"
        ? "bg-[#E8F7EE] text-[#1D6B3A] border-[#BFE8CF]"
        : "bg-[#EAF2FF] text-[#1F4FBF] border-[#C7DBFF]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

function TopMenuItem({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100"
    >
      {label} <ChevronDown className="h-4 w-4 text-slate-400" />
    </button>
  );
}

export function VesselNavbar() {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6D28D9] text-white shadow-sm">
            <span className="text-sm font-black">W</span>
          </div>
          <nav className="hidden items-center gap-1 lg:flex">
            <TopMenuItem label="Flight" />
            <TopMenuItem label="Cargo" />
            <TopMenuItem label="Contractors" />
            <TopMenuItem label="Accounting" />
            <TopMenuItem label="Reports" />
            <TopMenuItem label="Info & Rates" />
            <TopMenuItem label="Settings" />
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Bell className="hidden h-5 w-5 text-slate-400 md:block" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
            <User className="h-4 w-4 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm font-semibold text-slate-900">NEPTUNE2402017</div>
          <Badge label="USNYC" tone="yellow" />
          <Badge label="CNSHA" tone="green" />
          <Badge label="JPYOK" tone="blue" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Reg: <span className="font-semibold">89427</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Panamax 8500 TEU <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            Voyage ID <span className="font-semibold text-slate-900">NEPTUNE2402017</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            ID <span className="font-semibold text-slate-900">529</span>
          </div>
          <span className="inline-flex items-center rounded-full border border-[#BFE8CF] bg-[#E8F7EE] px-2.5 py-1 text-xs font-semibold text-[#1D6B3A]">
            Planned
          </span>
          <motion.button
            whileHover={{ y: -1 }}
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-[1.03]"
          >
            Save
          </motion.button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Brief
          </button>
        </div>
      </div>
    </div>
  );
}

