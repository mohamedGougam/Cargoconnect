"use client";

import { MessageSquare, Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { mockData } from "@/data";
import { useEffect, useMemo, useRef, useState } from "react";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function AIAssistantPanel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Ask me anything about ports: draft, congestion, waiting time, capacity, routes, and vessel handling. I will answer using Cargoconnect’s port intelligence dataset.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const prompts = useMemo(() => mockData.assistantPrompts.slice(0, 4), []);

  useEffect(() => {
    // Default open on desktop, collapsed on smaller screens.
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setOpen(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open]);

  async function sendMessage(text: string) {
    const msg = text.trim();
    if (!msg || loading) return;
    setError(null);
    setLoading(true);
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = (await res.json()) as {
        answer?: string;
        matchedPorts?: string[];
        sources?: string[];
      };
      const answer =
        typeof data.answer === "string" && data.answer.trim().length
          ? data.answer.trim()
          : "I do not have enough operational data for that yet, but the port record can be enriched.";
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setError("Unable to reach the port intelligence service.");
    } finally {
      setLoading(false);
      window.setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
      }, 0);
    }
  }

  return (
    <>
      {/* Launcher (visible when collapsed) */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pointer-events-auto fixed bottom-6 right-6 z-[9999] inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1E90FF]/25 bg-[#061525]/92 text-[#60a5fa] shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md transition-colors hover:bg-white/10"
          aria-label="Open Cargoconnect AI"
        >
          <MessageSquare className="h-5 w-5" strokeWidth={2} />
        </button>
      ) : null}

      {/* Panel */}
      <motion.aside
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: open ? 1 : 0, x: open ? 0 : 16 }}
        transition={{ duration: 0.22 }}
        onMouseDownCapture={() => inputRef.current?.focus()}
        className={[
          "pointer-events-auto fixed bottom-6 right-6 z-[9999] w-[min(92vw,360px)] flex-col rounded-2xl border border-[#1E90FF]/20 bg-[#061525]/92 p-4 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-md",
          open ? "flex" : "hidden",
        ].join(" ")}
        aria-label="Cargoconnect AI assistant"
      >
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1E90FF]/15 text-[#60a5fa] shadow-[0_0_0_1px_rgba(30,144,255,0.18)]">
          <MessageSquare className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Cargoconnect AI</p>
          <p className="text-[11px] text-slate-400">
            Port intelligence (grounded)
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="mt-3 flex max-h-[320px] flex-1 flex-col gap-2 overflow-y-auto pr-1"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={[
              "rounded-xl border px-3 py-2 text-sm leading-snug",
              m.role === "user"
                ? "ml-6 border-white/10 bg-white/5 text-slate-100"
                : "mr-6 border-[#1E90FF]/15 bg-[#0B1F33]/35 text-slate-100",
            ].join(" ")}
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
        {loading ? (
          <div className="mr-6 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            Thinking…
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Quick prompts
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => sendMessage(p)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-medium text-slate-200 transition-colors hover:border-[#1E90FF]/30 hover:bg-white/10"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <form
        className="mt-3 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onMouseDown={(e) => {
            // Ensure focus even if something else grabs it.
            e.currentTarget.focus();
          }}
          placeholder="Ask about draft, congestion, routes…"
          className="h-10 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-slate-100 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1E90FF]/25"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#1E90FF]/25 bg-[#1E90FF]/15 text-[#60a5fa] transition-colors hover:bg-[#1E90FF]/20 disabled:opacity-40"
          aria-label="Send"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </form>
      </motion.aside>
    </>
  );
}
