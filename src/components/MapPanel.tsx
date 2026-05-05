"use client";

import dynamic from "next/dynamic";

const RealRouteMap = dynamic(
  () =>
    import("./map/RealRouteMap").then((m) => ({ default: m.RealRouteMap })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[320px] w-full items-center justify-center bg-[#030a12] text-sm text-slate-500 sm:min-h-[420px] lg:min-h-[560px]">
        Loading map…
      </div>
    ),
  },
);

export function MapPanel() {
  return (
    <div className="flex h-[480px] min-h-[320px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#061525] shadow-inner sm:h-[480px] sm:min-h-[420px] lg:h-[480px] min-[1600px]:h-[560px] min-[1920px]:h-[640px]">
      <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Live route mesh
          </span>
          <p className="mt-0.5 text-[10px] text-slate-500 sm:text-[11px]">
            Real basemap (OpenStreetMap + CARTO dark) · drag to pan · scroll to
            zoom · Oman → Greece / Rotterdam lanes
          </p>
        </div>
        <div className="text-[11px] leading-snug text-slate-500">
          <span className="font-medium text-teal-400/90">Oman trio</span>
          <span className="text-slate-600"> · </span>
          <span className="font-medium text-sky-400/90">Greece &amp; North Sea</span>
          <span className="text-slate-600"> · Asia feeders</span>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 bg-[#030a12]">
        <RealRouteMap />
        {/* Vignette + depth to keep map as primary anchor */}
        <div className="pointer-events-none absolute inset-0 z-[7400]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.55)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#030a12]/95 via-[#030a12]/30 to-transparent backdrop-blur-[1px]" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#061525] to-transparent" />
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-center sm:justify-start">
          <div className="rounded-md border border-white/10 bg-[#0B1F33]/82 px-3 py-1.5 text-[10px] text-slate-400 backdrop-blur-sm">
            <span className="text-teal-300">●</span> Oman ·{" "}
            <span className="text-sky-300">●</span> Greece / NL ·{" "}
            <span className="text-blue-300">●</span> Hubs
          </div>
        </div>
      </div>
    </div>
  );
}
