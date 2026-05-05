import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  default:
    "border-slate-200 bg-slate-50 text-slate-700",
  accent:
    "border-[#1E90FF]/30 bg-[#1E90FF]/10 text-[#0B1F33]",
  teal:
    "border-teal-200/80 bg-teal-50 text-teal-900",
};

type BadgeProps = {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium tracking-tight",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
