"use client";

import type { CSSProperties } from "react";
import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MapPortCard } from "@/data/mapPortDetails";
import { mapPortSlug } from "@/data/mapPortDetails";

export type PortPopupCardProps = {
  /** Human-friendly port name id (e.g. "Piraeus") or slug; used for routing */
  portId: string;
  port: MapPortCard;
  onClose: () => void;
  /** Anchor card next to the map marker (map container coordinates) */
  anchorStyle?: CSSProperties;
};

function MetricTile({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-[rgba(255,255,255,0.065)] px-3.5 py-2.5 ring-1 ring-white/[0.07] ${className}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-white">{value}</p>
    </div>
  );
}

export const PortPopupCard = forwardRef<HTMLElement, PortPopupCardProps>(
  function PortPopupCard({ portId, port, onClose, anchorStyle }, ref) {
    const router = useRouter();
    const href = `/ports/${mapPortSlug(portId)}`;

    const navigate = () => {
      onClose();
      window.setTimeout(() => router.push(href), 160);
    };

    return (
      <motion.aside
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="port-popup-title"
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={anchorStyle}
        onClick={navigate}
        className="pointer-events-auto w-[min(100vw-2rem,360px)] max-w-[360px] min-w-[280px] cursor-pointer overflow-hidden rounded-[20px] border border-[rgba(30,144,255,0.35)] bg-[rgba(11,31,51,0.92)] text-slate-100 shadow-[0_24px_64px_-12px_rgba(30,144,255,0.32),0_12px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl backdrop-saturate-150 antialiased transition-shadow hover:shadow-[0_28px_70px_-14px_rgba(30,144,255,0.42),0_14px_44px_-14px_rgba(0,0,0,0.6)]"
      >
        <div className="p-5">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3
                id="port-popup-title"
                className="text-lg font-bold leading-tight tracking-tight text-white"
              >
                {port.name}
              </h3>
              <p className="mt-1.5 text-sm leading-snug text-slate-400">{port.country}</p>
              <p className="mt-1 font-mono text-[11px] leading-none text-slate-500">
                {port.unLocode}
              </p>
            </div>
            <div className="flex shrink-0 items-start gap-2">
              <span className="inline-flex items-center rounded-full border border-sky-400/25 bg-sky-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sky-200/95">
                Active Port
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="rounded-xl p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
                aria-label="Close"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </div>
          </header>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <MetricTile label="Draft" value={`${port.maxDraftM}m`} />
            <MetricTile label="Congestion" value={port.congestion} />
            <MetricTile label="Waiting time" value={port.waitingTime} />
            <MetricTile label="Port type" value={port.portType} />
          </div>

          <div className="mt-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Available Routes
            </h4>
            <ul className="mt-2.5 max-h-[148px] space-y-2 overflow-y-auto pr-0.5">
              {port.routes.map((r) => (
                <li
                  key={r}
                  className="flex items-center gap-2.5 rounded-xl bg-[rgba(255,255,255,0.055)] px-3 py-2.5 text-[13px] leading-snug text-slate-100 ring-1 ring-white/[0.06]"
                >
                  <ArrowRight
                    className="h-3.5 w-3.5 shrink-0 text-sky-400/85"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                  <span className="min-w-0">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#1E90FF] to-teal-500 text-sm font-semibold text-white shadow-[0_10px_28px_-6px_rgba(30,144,255,0.55)] transition-[filter,box-shadow,transform] duration-200 ease-out hover:shadow-[0_14px_36px_-6px_rgba(30,144,255,0.65)] hover:brightness-[1.06] active:scale-[0.99]">
            View Port Details
          </div>
        </div>
      </motion.aside>
    );
  },
);
