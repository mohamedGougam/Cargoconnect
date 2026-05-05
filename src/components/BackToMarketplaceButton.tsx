"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function BackToMarketplaceButton() {
  const router = useRouter();

  return (
    <motion.button
      type="button"
      whileHover={{ x: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => router.push("/marketplace")}
      className="inline-flex items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-slate-200 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors hover:border-[#1E90FF]/35 hover:bg-white/10"
      aria-label="Back to Marketplace"
    >
      <ArrowLeft className="h-4 w-4 text-slate-300" strokeWidth={2} />
      <span>Back to Marketplace</span>
    </motion.button>
  );
}

