"use client";

import { useMemo, useState } from "react";
import { VesselNavbar } from "@/components/load-plan/VesselNavbar";
import { SidebarPortCard } from "@/components/load-plan/SidebarPortCard";
import { ShipLoadView } from "@/components/load-plan/ShipLoadView";
import { GaugeChart } from "@/components/load-plan/GaugeChart";
import { PayloadList } from "@/components/load-plan/PayloadList";
import { TableTabs } from "@/components/load-plan/TableTabs";
import { FiltersBar } from "@/components/load-plan/FiltersBar";
import { DataTable } from "@/components/load-plan/DataTable";
import type {
  CargoBlockDef,
  PayloadRow,
  PortTimelineItem,
  TableRow,
} from "@/components/load-plan/types";

export default function LoadPlanPage() {
  const ports = useMemo<PortTimelineItem[]>(
    () => [
      {
        code: "USNYC",
        status: "Planned",
        departure: "14 Mar 08:15",
      },
      {
        code: "CNSHA",
        status: "Planned",
        departure: "14 Mar 08:15",
        arrival: "NEPTUNE2402017",
      },
      {
        code: "JPYOK",
        status: "Planned",
        departure: "14 Mar 08:15",
      },
    ],
    [],
  );

  const cargoBlocks = useMemo<CargoBlockDef[]>(
    () => [
      { id: "a", code: "H", ref: "RC.VII.29834", kg: 5200, tag: "JPYOK", x: 0.62, y: 0.26 },
      { id: "b", code: "H", ref: "RC.VII.61042", kg: 4100, tag: "JPYOK", x: 0.78, y: 0.26 },
      { id: "c", code: "V", ref: "RC.VII.47291", kg: 5200, tag: "JPYOK", x: 0.62, y: 0.41 },
      { id: "d", code: "V", ref: "RC.VII.35928", kg: 2400, tag: "JPYOK", x: 0.78, y: 0.41, highlight: true },
      { id: "e", code: "3K", ref: "RC.VII.35928", kg: 5200, tag: "JPYOK", x: 0.78, y: 0.56 },
      { id: "f", code: "L7", ref: "RC.VII.83251", kg: 4100, tag: "CNSHA", x: 0.62, y: 0.70 },
    ],
    [],
  );

  const payloadRows = useMemo<PayloadRow[]>(
    () => [
      { section: "H", ref: "RC.VII.29834", kg: 5200, tag: "JPYOK" },
      { section: "V", ref: "RC.VII.47291", kg: 5200, tag: "JPYOK" },
      { section: "Y", ref: "RC.VII.29834", kg: 5200, tag: "CNSHA" },
      { section: "L7", ref: "RC.VII.83251", kg: 4100, tag: "CNSHA" },
      { section: "6D", ref: "RC.VII.61042", kg: 4100, tag: "JPYOK" },
    ],
    [],
  );

  const tableRows = useMemo<TableRow[]>(
    () => [
      {
        awbNo: "KT-584927318",
        prefix: "923",
        pkg: "RC.VII.29834",
        origin: "USNYC",
        dest: "JPYOK",
        bookingDate: "08 Mar 15:22",
        voyageNo: "NEPTUNE32402017",
        voyageDate: "14 Mar 08:15",
        customer: "Maersk Line",
        containerType: "TEU-40",
        bookingRef: "8QM47R93521",
      },
      {
        awbNo: "KT-584936271",
        prefix: "923",
        pkg: "RC.VII.47291",
        origin: "USNYC",
        dest: "JPYOK",
        bookingDate: "05 Mar 15:48",
        voyageNo: "NEPTUNE32402017",
        voyageDate: "14 Mar 08:15",
        customer: "MSC Shipping",
        containerType: "TEU-20",
        bookingRef: "8QM9K85742",
      },
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState("AWBs");

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] text-slate-900">
      <div className="mx-auto w-full max-w-[1560px] px-4 pb-5 pt-4">
        <VesselNavbar />

        <div className="mt-4 grid grid-cols-12 gap-4">
          <aside className="col-span-12 lg:col-span-3">
            <div className="flex flex-col gap-3">
              {ports.map((p) => (
                <SidebarPortCard key={p.code} item={p} />
              ))}
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-6">
            <ShipLoadView title="Load Plan" blocks={cargoBlocks} />
          </section>

          <aside className="col-span-12 lg:col-span-3">
            <div className="rounded-[20px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(16,24,40,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
                <div className="text-xs font-semibold text-slate-600">Payload</div>
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium hover:bg-slate-50"
                  >
                    Filter
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium hover:bg-slate-50"
                  >
                    Settings
                  </button>
                </div>
              </div>

              <div className="px-5 py-4">
                <GaugeChart valueLabel="68.342 kg" />
              </div>

              <div className="px-3 pb-4">
                <PayloadList rows={payloadRows} />
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-4 rounded-[20px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(16,24,40,0.04)]">
          <div className="px-4 pt-3">
            <TableTabs active={activeTab} onChange={setActiveTab} />
          </div>
          <div className="px-4 pb-4 pt-3">
            <FiltersBar />
          </div>
          <div className="border-t border-slate-200">
            <DataTable rows={tableRows} />
          </div>
        </div>
      </div>
    </div>
  );
}

