import { mockData } from "@/data";
import { pagePaddingX } from "@/lib/layout";
import { BackToMarketplaceButton } from "@/components/BackToMarketplaceButton";
import { getMapPortCard } from "@/data/mapPortDetails";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#122B45] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_-22px_rgba(0,0,0,0.65)]">
      <div className="border-b border-white/10 px-6 py-4">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function KV({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          emphasize ? "text-[#1E90FF]" : "text-slate-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
      {children}
    </span>
  );
}

function CompatibilityMetric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold ${accent ? "text-teal-300" : "text-slate-100"}`}>
        {value}
      </p>
    </div>
  );
}

export default async function PortDetailsPage({
  params,
}: {
  params: Promise<{ portId: string }>;
}) {
  const { portId } = await params;
  const found = mockData.ports.find((p) => p.id === portId);
  const mapCard = getMapPortCard(portId);

  const port =
    found ??
    ({
      id: portId,
      name: mapCard?.name ?? `Port: ${portId}`,
      country: mapCard?.country ?? "—",
      regionId: "all",
      unLocode: mapCard?.unLocode ?? "—",
      gatewayLabel: "Additional operational data is being enriched.",
      coordinates: { lat: 0, lon: 0 },
      draftDepthM: mapCard?.maxDraftM ?? 0,
      channelDepthM: mapCard?.maxDraftM != null ? mapCard.maxDraftM + 1.5 : 0,
      portType: mapCard?.portType ?? "—",
      annualThroughputTeu: 0,
      berthsContainer: 0,
      cranesSts: 0,
      megaMaxCranes: 0,
      forklifts: "—",
      loading: "—",
      congestion: mapCard?.congestion ?? "—",
      waitingHours: mapCard?.waitingTime ?? "—",
      railConnected: false,
      coldChainCapacity: "—",
      customs: "Additional operational data is being enriched.",
      freeTradeZone: false,
      pilotage: "—",
      topTrades: [],
      routes: mapCard?.routes ?? [],
    } as const);
  const needsEnrichment = found == null;

  return (
    <div className="min-h-screen w-full bg-[#0B1F33] text-slate-100">
      <div className={`mx-auto w-full max-w-none pb-16 pt-10 ${pagePaddingX}`}>
        <div className="mb-6">
          <div className="mb-4">
            <BackToMarketplaceButton />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Port operational layer
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {port.name}
          </h1>
          <p className="mt-2 text-slate-300">
            {port.country} ·{" "}
            <span className="font-mono text-slate-300">{port.unLocode}</span>
          </p>
          {needsEnrichment ? (
            <div className="mt-3 inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
              Additional operational data is being enriched
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <Tag>Gateway</Tag>
            {port.railConnected && <Tag>Rail-linked</Tag>}
            {port.freeTradeZone && <Tag>Free trade zone</Tag>}
            <Tag>{port.congestion} congestion</Tag>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6">
            <Card title="Overview">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <KV label="Draft depth" value={`${port.draftDepthM} m`} emphasize />
                <KV label="Channel depth" value={`${port.channelDepthM} m`} />
                <KV label="Port type" value={port.portType} />
                <KV label="Congestion" value={port.congestion} />
                <KV label="Waiting time" value={port.waitingHours} emphasize />
                <KV label="Pilotage" value={port.pilotage} />
              </div>
            </Card>

            <Card title="Operations">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <KV
                  label="Container berths"
                  value={port.berthsContainer.toLocaleString("en-US")}
                />
                <KV
                  label="STS cranes"
                  value={port.cranesSts.toLocaleString("en-US")}
                />
                <KV
                  label="Mega-max cranes"
                  value={port.megaMaxCranes.toLocaleString("en-US")}
                />
                <KV label="Forklifts/handlers" value={port.forklifts} />
                <KV label="Loading discipline" value={port.loading} />
                <KV label="Cold chain" value={port.coldChainCapacity} />
              </div>
            </Card>

            <Card title="Logistics & Trade">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Core trades
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-slate-100">
                    {port.topTrades.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Sample liner connections
                  </p>
                  <ul className="mt-3 space-y-2 text-sm font-medium text-slate-100">
                    {port.routes.slice(0, 10).map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Customs & compliance
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  {port.customs}
                </p>
              </div>
            </Card>
          </div>

          <aside className="flex flex-col gap-6">
            <Card title="Metrics">
              <div className="grid gap-3">
                <KV
                  label="Throughput"
                  value={`${port.annualThroughputTeu.toLocaleString("en-US")} TEU / yr`}
                  emphasize
                />
                <KV label="Capacity indicators" value="Lane utilization: 0.78 · Yard: 0.62" />
                <KV label="Decision signal" value="Stable window · prioritize feeder allocation" />
              </div>
            </Card>
          </aside>
        </div>

        <div className="mt-6">
          <Card title="Port Compatibility & Vessel Handling">
            <div className="grid gap-5 lg:grid-cols-[65fr_35fr]">
              <div className="relative overflow-hidden rounded-2xl border border-[#1E90FF]/20 bg-[#0B1F33]/35 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_60px_-22px_rgba(0,0,0,0.7)]">
                {/* Ship sketch visual */}
                <div className="relative aspect-[16/7.5] w-full">
                  <img
                    src="/ship-bow.png"
                    alt=""
                    className="absolute inset-0 h-full w-full object-contain object-left"
                    style={{
                      opacity: 0.82,
                      filter: "contrast(0.92) saturate(0.9)",
                      mixBlendMode: "luminosity",
                    }}
                    draggable={false}
                  />

                  {/* Soft gradient blend into card */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-[180px] bg-gradient-to-r from-transparent to-[#0B1F33]/70" />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(30,144,255,0.12)_0%,transparent_55%)]" />

                  {/* Hotspots */}
                  {[
                    {
                      id: "berth",
                      label: "Berth zone",
                      note: "STS allocation optimized for peak windows.",
                      left: "22%",
                      top: "58%",
                    },
                    {
                      id: "container",
                      label: "Container handling",
                      note: "High-throughput stacking with yard telemetry.",
                      left: "46%",
                      top: "38%",
                    },
                    {
                      id: "roro",
                      label: "Ro-Ro access",
                      note: "Dedicated ramp ops with priority gate lanes.",
                      left: "62%",
                      top: "72%",
                    },
                    {
                      id: "cold",
                      label: "Cold-chain storage",
                      note: "Reefer plug density monitored in real-time.",
                      left: "78%",
                      top: "44%",
                    },
                  ].map((h) => (
                    <div
                      key={h.id}
                      className="group absolute"
                      style={{ left: h.left, top: h.top, transform: "translate(-50%, -50%)" }}
                    >
                      <button
                        type="button"
                        className="relative h-3.5 w-3.5 rounded-full bg-[#1E90FF] shadow-[0_0_0_3px_rgba(30,144,255,0.22),0_0_18px_rgba(30,144,255,0.55)] transition-transform group-hover:scale-110"
                        aria-label={h.label}
                      >
                        <span className="absolute inset-0 rounded-full bg-[#1E90FF]/45 blur-[6px] opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                      <div className="pointer-events-none absolute left-1/2 top-[-10px] w-[220px] -translate-x-1/2 -translate-y-full opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="rounded-xl border border-white/10 bg-[#061525]/95 px-3 py-2 text-xs shadow-[0_18px_44px_-18px_rgba(0,0,0,0.75)] backdrop-blur-md">
                          <p className="font-semibold text-white">{h.label}</p>
                          <p className="mt-0.5 text-[11px] leading-snug text-slate-300">
                            {h.note}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#122B45] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">Vessel Compatibility</p>
                    <p className="mt-1 text-xs text-slate-300">
                      Handling profile derived from port specs & operational signals.
                    </p>
                  </div>
                  <span className="rounded-full border border-[#1E90FF]/20 bg-[#1E90FF]/10 px-2.5 py-1 text-[11px] font-semibold text-[#60a5fa]">
                    Live profile
                  </span>
                </div>

                <div className="mt-4 grid gap-3">
                  <CompatibilityMetric label="Max vessel class" value="Post‑Panamax" accent />
                  <CompatibilityMetric label="Max draft supported" value={`${port.draftDepthM} m`} accent />
                  <CompatibilityMetric label="Container handling" value="High (STS + yard automation)" />
                  <CompatibilityMetric label="Ro‑Ro support" value="Available (priority ramp ops)" />
                  <CompatibilityMetric label="Bulk cargo support" value="Supported (multi-purpose berths)" />
                  <CompatibilityMetric label="Cold‑chain readiness" value={port.coldChainCapacity} />
                  <CompatibilityMetric label="Estimated loading window" value="6–10 hours (slot-based)" accent />
                  <CompatibilityMetric label="Preferred vessel size" value="6,000–10,000 TEU" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

