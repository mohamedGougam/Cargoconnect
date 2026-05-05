"use client";

import { motion } from "framer-motion";
import type { CargoBlockDef } from "@/components/load-plan/types";

function Tag({ label }: { label: string }) {
  const cls =
    label === "USNYC"
      ? "bg-[#FFF4CC] text-[#8A6A00] border-[#F2DD93]"
      : label === "CNSHA"
        ? "bg-[#E8F7EE] text-[#1D6B3A] border-[#BFE8CF]"
        : "bg-[#EAF2FF] text-[#1F4FBF] border-[#C7DBFF]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export function CargoBlock({ block }: { block: CargoBlockDef }) {
  return (
    <motion.div
      whileHover={{ y: -1 }}
      className={[
        "w-[140px] rounded-[14px] border bg-white/95 p-3 shadow-[0_6px_18px_rgba(15,23,42,0.06)] backdrop-blur-sm",
        block.highlight
          ? "border-[#C7B8FF] bg-[#EFE9FF] shadow-[0_10px_24px_rgba(109,40,217,0.18)]"
          : "border-slate-200",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-slate-700">{block.code}</div>
        <Tag label={block.tag} />
      </div>
      <div className="mt-2 text-[11px] font-semibold text-slate-900">{block.ref}</div>
      <div className="mt-1 text-[10px] font-medium text-slate-500">
        {block.kg.toLocaleString("en-US")} kg
      </div>
    </motion.div>
  );
}

