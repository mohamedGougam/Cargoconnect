 "use client";

import { useMemo, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import { FilterChips } from "./FilterChips";
import { pagePaddingX } from "@/lib/layout";

type ChatMsg = { role: "user" | "assistant"; content: string };

export function AISearchBar() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const helper = useMemo(
    () =>
      "AI-first port intelligence: draft, congestion, waiting time, capacity, routes, vessel compatibility.",
    [],
  );

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
    <section
      id="ai-search"
      className={`scroll-mt-24 pb-6 pt-5 sm:pb-8 sm:pt-6 ${pagePaddingX} w-full`}
    >
      <div className="mx-auto w-full max-w-[1000px] min-[1600px]:max-w-[1100px] min-[1920px]:max-w-[1200px]">
        <div className="rounded-2xl border border-white/8 bg-white/3 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_50px_-22px_rgba(0,0,0,0.6)]">
          <div className="relative min-h-14 rounded-xl border border-white/10 bg-[#061525]/55">
            <div className="pointer-events-none absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-white/5 text-[#60a5fa] ring-1 ring-white/10">
              <Search className="h-5 w-5" strokeWidth={2} />
            </div>
            <form
              className="flex items-stretch"
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about ports: draft depth of Sohar, compare Rotterdam vs Piraeus, lowest congestion…"
                className="h-full min-h-14 w-full rounded-xl bg-transparent py-3 pl-[3.75rem] pr-12 text-[15px] text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/25"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border border-[#1E90FF]/25 bg-[#1E90FF]/15 text-[#60a5fa] transition-colors hover:bg-[#1E90FF]/20 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" strokeWidth={2} />
              </button>
            </form>
          </div>
          <p className="mt-3 text-[11px] text-slate-400">{helper}</p>

          <div
            ref={scrollRef}
            className="mt-3 max-h-[260px] overflow-y-auto pr-1"
          >
            <div className="flex flex-col gap-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm leading-snug",
                    m.role === "user"
                      ? "ml-10 border-white/10 bg-white/5 text-slate-100"
                      : "mr-10 border-[#1E90FF]/15 bg-[#0B1F33]/35 text-slate-100",
                  ].join(" ")}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
              {loading ? (
                <div className="mr-10 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                  Thinking…
                </div>
              ) : null}
              {error ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <FilterChips onSelect={(p) => void sendMessage(p)} />
      </div>
    </section>
  );
}
