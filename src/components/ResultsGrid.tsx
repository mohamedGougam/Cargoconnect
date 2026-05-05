"use client";

import { mockData } from "@/data";
import { Badge } from "./Badge";
import { pagePaddingX } from "@/lib/layout";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function badgeVariant(
  b: string,
): "default" | "accent" | "teal" {
  if (b === "Best Match") return "accent";
  if (b === "Eco-efficient") return "teal";
  if (b === "Fastest Route") return "accent";
  return "default";
}

export function ResultsGrid() {
  return (
    <section
      id="vessels"
      className={`scroll-mt-24 w-full py-6 sm:py-8 ${pagePaddingX}`}
    >
      <div className="mx-auto w-full max-w-none">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-white">
            Compatible vessels &amp; shipments
          </h2>
          <p className="text-sm text-slate-400">
            Ranked by match score, route fit, and operational constraints.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#061525] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_50px_-20px_rgba(0,0,0,0.55)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#0B1F33]/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 min-[1600px]:px-5">Vessel name</th>
                  <th className="px-4 py-3 min-[1600px]:px-5">Type</th>
                  <th className="px-4 py-3 text-right min-[1600px]:px-5">Capacity (TEU)</th>
                  <th className="px-4 py-3 min-[1600px]:px-5">Current port</th>
                  <th className="px-4 py-3 min-[1600px]:px-5">Route compatibility</th>
                  <th className="px-4 py-3 min-[1600px]:px-5">Departure</th>
                  <th className="px-4 py-3 text-right min-[1600px]:px-5">Est. price</th>
                  <th className="px-4 py-3 text-right min-[1600px]:px-5">Match</th>
                  <th className="px-4 py-3 min-[1600px]:px-5">Signals</th>
                  <th className="px-4 py-3 text-right min-[1600px]:px-5"> </th>
                </tr>
              </thead>
              <tbody>
                {mockData.vessels.map((row) => (
                  <tr
                    key={row.id}
                    className="group border-b border-white/10 bg-[#061525] transition-colors last:border-0 hover:bg-white/6"
                  >
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 font-medium text-white">
                      {row.name}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-slate-300">
                      {row.type}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-right tabular-nums text-slate-200">
                      {row.capacityTeu.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-slate-200">
                      {row.currentPort}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-slate-200">
                      {row.routeCompatibility}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 tabular-nums text-slate-300">
                      {row.departureDate}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-right font-medium tabular-nums text-slate-100">
                      {formatUsd(row.estimatedPriceUsd)}
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-right">
                      <span className="font-semibold tabular-nums text-[#1E90FF]">
                        {row.matchScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5">
                      <div className="flex flex-wrap gap-1">
                        {row.badges.map((b) => (
                          <Badge key={b} variant={badgeVariant(b)}>
                            {b}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 min-[1600px]:px-5 min-[1600px]:py-5 text-right">
                      <button
                        type="button"
                        className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-100 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        View Match
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
