import type { ReactNode } from "react";

export function BrandMark({ className }: { className?: string }) {
  return <img src="/logo_blue.png" alt="PV Cloud" className={`h-auto w-32 lg:w-40 ${className ?? ""}`} />;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-foreground/80">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "soft" | "solid";
}) {
  const cls =
    tone === "solid"
      ? "bg-primary text-primary-foreground"
      : tone === "soft"
        ? "bg-primary-soft text-primary-soft-foreground"
        : "bg-slate-100 text-slate-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {children}
    </span>
  );
}
