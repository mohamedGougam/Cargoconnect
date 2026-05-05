import { pagePaddingX } from "@/lib/layout";

export function HeroSection() {
  return (
    <section
      className={`w-full border-b border-white/5 py-9 sm:py-10 lg:py-11 ${pagePaddingX}`}
    >
      <div className="mx-auto w-full max-w-none text-center">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight">
          Global Maritime Logistics, Matched Intelligently
        </h1>
        <p className="mx-auto mt-4 max-w-[52rem] text-pretty text-sm leading-relaxed text-slate-400 sm:text-[15px]">
          Cargoconnect connects shipment senders, ports, and vessel owners
          through an AI-powered marketplace for faster, smarter, and more
          accessible maritime logistics.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#ai-search"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E90FF] px-5 text-sm font-semibold text-white shadow-lg shadow-[#1E90FF]/20 transition-transform hover:scale-[1.02] hover:bg-[#1a7fe6]"
          >
            Search Shipments
          </a>
          <a
            href="#ports"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] hover:bg-white/10"
          >
            Explore Ports
          </a>
        </div>
      </div>
    </section>
  );
}
