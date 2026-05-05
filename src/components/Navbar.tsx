import Link from "next/link";
import { pagePaddingX } from "@/lib/layout";

const links = [
  { href: "#marketplace", label: "Marketplace" },
  { href: "#ports", label: "Ports" },
  { href: "#routes", label: "Routes" },
  { href: "#vessels", label: "Vessels" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0B1F33]/85 backdrop-blur-md">
      <div
        className={`mx-auto flex h-14 w-full max-w-none items-center justify-between gap-4 ${pagePaddingX}`}
      >
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-white"
        >
          Cargoconnect
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-4 md:flex lg:gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="inline-flex rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white transition-transform hover:scale-[1.02] hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            Request Demo
          </button>
        </div>
      </div>
    </header>
  );
}
