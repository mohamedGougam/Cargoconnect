import { cn } from "@/lib/utils";

type StatItemProps = {
  label: string;
  value: React.ReactNode;
  emphasize?: boolean;
  className?: string;
};

export function StatItem({ label, value, emphasize, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span
        className={cn(
          "text-sm text-slate-100",
          emphasize && "text-base font-semibold tabular-nums text-[#60a5fa]",
        )}
      >
        {value}
      </span>
    </div>
  );
}
