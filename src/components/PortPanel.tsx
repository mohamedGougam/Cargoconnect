"use client";

import { useCallback, useMemo, useState } from "react";
import { Anchor, MapPin, Ship } from "lucide-react";
import { useRouter } from "next/navigation";
import { mockData, type PortRecord } from "@/data";
import { StatItem } from "./StatItem";
import { Badge } from "./Badge";
import { pagePaddingX } from "@/lib/layout";

const REGIONS = [
  { id: "all", label: "All regions" },
  { id: "europe", label: "Europe" },
  { id: "mea", label: "Middle East & Africa" },
  { id: "apac", label: "Asia–Pacific" },
  { id: "americas", label: "Americas" },
] as const;

function formatTeu(n: number) {
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M TEU / yr`;
  }
  if (n >= 1_000) {
    return `${Math.round(n / 1_000)}k TEU / yr`;
  }
  return `${n.toLocaleString("en-US")} TEU / yr`;
}

function PortSummaryCard({
  port,
  active,
  onSelect,
  onNavigate,
}: {
  port: PortRecord;
  active: boolean;
  onSelect: () => void;
  onNavigate: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onSelect}
      onFocus={onSelect}
      onClick={onNavigate}
      className={`flex w-full flex-col rounded-xl border bg-[#122B45] p-3.5 text-left transition-all hover:bg-[#14314f] ${
        active
          ? "border-[#1E90FF]/55 shadow-[0_0_0_1px_rgba(30,144,255,0.22),0_14px_34px_-22px_rgba(30,144,255,0.55)] ring-1 ring-[#1E90FF]/20"
          : "border-white/10 hover:border-white/18"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{port.name}</p>
          <p className="mt-0.5 text-xs text-slate-300">
            {port.country} · {port.unLocode}
          </p>
        </div>
        <span className="shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-200">
          {port.congestion}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
        {port.gatewayLabel}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        <span className="text-xs tabular-nums font-medium text-[#1E90FF]">
          {formatTeu(port.annualThroughputTeu)}
        </span>
        <span className="text-white/15">·</span>
        <span className="text-xs text-slate-300">
          Draft {port.draftDepthM}m
        </span>
      </div>
    </button>
  );
}

export function PortPanel() {
  const router = useRouter();
  const [region, setRegion] = useState<(typeof REGIONS)[number]["id"]>("all");
  const [selectedId, setSelectedId] = useState<string>("piraeus");

  const filtered = useMemo(() => {
    if (region === "all") return mockData.ports;
    return mockData.ports.filter((p) => p.regionId === region);
  }, [region]);

  const onRegionChange = useCallback((id: (typeof REGIONS)[number]["id"]) => {
    setRegion(id);
    const list =
      id === "all"
        ? mockData.ports
        : mockData.ports.filter((p) => p.regionId === id);
    const first = list[0];
    if (first) setSelectedId(first.id);
  }, []);

  const selected = useMemo(
    () => mockData.ports.find((p) => p.id === selectedId) ?? mockData.ports[0],
    [selectedId],
  );

  return (
    <section
      id="ports"
      className={`scroll-mt-24 w-full pb-10 pt-2 sm:pb-12 ${pagePaddingX}`}
    >
      <div className="mx-auto w-full max-w-none">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Global port intelligence
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">
              {mockData.ports.length} major container gateways with throughput,
              infrastructure, congestion, and trade-lane context—curated for
              marketplace matching (prototype data).
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onRegionChange(r.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                region === r.id
                  ? "bg-[#1E90FF] text-white"
                  : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5 min-[1920px]:grid-cols-6">
          {filtered.map((p) => (
            <PortSummaryCard
              key={p.id}
              port={p}
              active={p.id === selectedId}
              onSelect={() => setSelectedId(p.id)}
              onNavigate={() => router.push(`/ports/${p.id}`)}
            />
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#061525] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_-22px_rgba(0,0,0,0.65)]">
          <div className="border-b border-white/10 bg-[#0B1F33]/55 px-6 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/10">
                  <Anchor className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {selected.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-200">
                      <MapPin className="h-3 w-3" />
                      {selected.country}
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs text-slate-200">
                      {selected.unLocode}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-teal-300/90">
                    {selected.gatewayLabel}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.railConnected && (
                      <Badge variant="teal">Rail-linked</Badge>
                    )}
                    {selected.freeTradeZone && (
                      <Badge variant="accent">Free trade zone</Badge>
                    )}
                    {selected.topTrades.slice(0, 2).map((t) => (
                      <Badge key={t} variant="default">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
                <Ship className="h-4 w-4 text-[#1E90FF]" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Annual throughput
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-white">
                    {formatTeu(selected.annualThroughputTeu)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_300px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatItem
                label="Draft (berth)"
                value={`${selected.draftDepthM} m`}
                emphasize
              />
              <StatItem
                label="Channel depth"
                value={`${selected.channelDepthM} m`}
                emphasize
              />
              <StatItem label="Port type" value={selected.portType} />
              <StatItem
                label="Container berths"
                value={selected.berthsContainer.toLocaleString("en-US")}
                emphasize
              />
              <StatItem
                label="STS cranes"
                value={selected.cranesSts.toLocaleString("en-US")}
              />
              <StatItem
                label="Mega-max cranes"
                value={selected.megaMaxCranes.toLocaleString("en-US")}
              />
              <StatItem label="Forklifts / handlers" value={selected.forklifts} />
              <StatItem
                label="Loading discipline"
                value={selected.loading}
              />
              <StatItem label="Congestion" value={selected.congestion} />
              <StatItem
                label="Waiting time"
                value={selected.waitingHours}
                emphasize
              />
              <StatItem
                label="Cold chain capacity"
                value={selected.coldChainCapacity}
              />
              <StatItem label="Pilotage" value={selected.pilotage} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Customs & compliance
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {selected.customs}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Core trades
                </p>
                <ul className="mt-2 space-y-1.5">
                  {selected.topTrades.map((t) => (
                    <li key={t} className="text-sm text-slate-100">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Sample liner connections
                </p>
                <ul className="mt-3 max-h-[220px] space-y-2 overflow-y-auto pr-1">
                  {selected.routes.map((r) => (
                    <li
                      key={r}
                      className="text-sm font-medium text-slate-100"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
