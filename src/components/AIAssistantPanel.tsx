"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { mockData } from "@/data";

export function AIAssistantPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45 }}
      className="pointer-events-auto fixed bottom-6 right-6 z-50 hidden w-[320px] flex-col rounded-2xl border border-[#1E90FF]/20 bg-[#061525]/92 p-4 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md lg:flex"
      aria-label="Cargoconnect AI assistant"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E90FF]/15 text-[#60a5fa] shadow-[0_0_0_1px_rgba(30,144,255,0.18)]">
          <MessageSquare className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Cargoconnect AI</p>
          <p className="text-[11px] text-slate-400">Operational copilot</p>
        </div>
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        Quick prompts
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {mockData.assistantPrompts.map((prompt) => (
          <motion.li key={prompt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }}>
            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-slate-100 transition-colors hover:border-[#1E90FF]/30 hover:bg-white/10"
            >
              {prompt}
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.aside>
  );
}
