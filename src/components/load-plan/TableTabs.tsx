"use client";

import { motion } from "framer-motion";

const TABS = [
  "AWBs",
  "Offloaded Cargo History",
  "Cargo Shipments",
  "Load Pieces in USNYC",
  "Unload Pieces in USNYC",
  "Transit Pieces in USNYC",
  "Take Off in USNYC",
  "Sent e-mails",
] as const;

export function TableTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
      {TABS.map((t) => {
        const isActive = t === active;
        return (
          <motion.button
            key={t}
            type="button"
            whileHover={{ y: -1 }}
            onClick={() => onChange(t)}
            className={[
              "rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
              isActive
                ? "bg-slate-900 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
            ].join(" ")}
          >
            {t}
          </motion.button>
        );
      })}
    </div>
  );
}

