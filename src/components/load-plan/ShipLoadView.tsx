"use client";

import { Search, ZoomIn, ZoomOut } from "lucide-react";
import type { CargoBlockDef } from "@/components/load-plan/types";
import { CargoBlock } from "@/components/load-plan/CargoBlock";

export function ShipLoadView({
  title,
  blocks,
}: {
  title: string;
  blocks: CargoBlockDef[];
}) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative px-5 py-4">
        <div className="relative aspect-[16/8.2] w-full overflow-hidden rounded-[18px] bg-[#EEF2F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          {/* Ship background layer (left aligned, clipped, fades into grid) */}
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <div className="absolute inset-y-0 left-0 w-[58%]">
              <img
                src="/ship-bow.png"
                alt=""
                className="h-full w-auto max-w-none object-contain object-left"
                style={{
                  opacity: 0.85,
                  // Keep it UI-friendly but avoid looking low-res (too much blur kills detail).
                  filter: "blur(0.55px) contrast(0.98)",
                  boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
                }}
                draggable={false}
              />
              {/* Right-edge gradient fade to merge ship → cargo grid */}
              <div className="absolute inset-y-0 right-0 w-[120px] bg-gradient-to-r from-transparent to-[#EEF2F7]" />
            </div>
            {/* Subtle depth behind ship */}
            <div className="absolute inset-y-0 left-0 w-[62%] shadow-[inset_-24px_0_40px_rgba(15,23,42,0.05)]" />
          </div>

          {/* Cargo blocks above ship */}
          <div className="absolute inset-0 z-[2]">
            {blocks.map((b) => (
              <div
                key={b.id}
                className="absolute"
                style={{
                  left: `${b.x * 100}%`,
                  top: `${b.y * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <CargoBlock block={b} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span className="inline-block h-4 w-4 rounded bg-slate-100" />
              Top
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span className="inline-block h-4 w-4 rounded bg-slate-100" />
              Side
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

