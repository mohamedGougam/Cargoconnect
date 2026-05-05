"use client";

import { Search } from "lucide-react";

function FilterPill({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
    >
      {label}
    </button>
  );
}

export function FiltersBar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <FilterPill label="AWB No" />
        <FilterPill label="Origin City" />
        <FilterPill label="Final Destination" />
        <FilterPill label="Voyage No" />
        <FilterPill label="Prefix" />
        <FilterPill label="Booking Ref No" />
        <FilterPill label="Container Type" />
      </div>
      <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 sm:w-[260px]">
        <Search className="h-4 w-4" />
        <input
          className="w-full bg-transparent outline-none placeholder:text-slate-400"
          placeholder="Search"
        />
      </div>
    </div>
  );
}

