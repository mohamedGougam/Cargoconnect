"use client";

import type { TableRow } from "@/components/load-plan/types";

export function DataTable({ rows }: { rows: TableRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1100px] w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-[#F8FAFC] text-[11px] font-semibold text-slate-500">
            {[
              "AWB No",
              "Prefix",
              "Package",
              "Origin",
              "Dest",
              "Booking Date",
              "Voyage No",
              "Voyage Date",
              "Customer",
              "Container Type",
              "Booking Ref No",
            ].map((h) => (
              <th
                key={h}
                className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs">
          {rows.map((r) => (
            <tr key={r.awbNo} className="hover:bg-[#F3F4F6]">
              <td className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-800">
                {r.awbNo}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {r.prefix}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                {r.pkg}
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className="rounded-lg bg-[#FFF4CC] px-2 py-0.5 text-[11px] font-semibold text-[#8A6A00]">
                  {r.origin}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3">
                <span className="rounded-lg bg-[#EAF2FF] px-2 py-0.5 text-[11px] font-semibold text-[#1F4FBF]">
                  {r.dest}
                </span>
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {r.bookingDate}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-800">
                {r.voyageNo}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {r.voyageDate}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                {r.customer}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-700">
                {r.containerType}
              </td>
              <td className="border-b border-slate-200 px-4 py-3 text-slate-600">
                {r.bookingRef}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

