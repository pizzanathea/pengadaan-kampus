import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  judul,
  subtitle,
  aksi,
}: {
  judul: string;
  subtitle?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{judul}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {aksi ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">{aksi}</div>
      ) : null}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, i) => (
          <li key={item.label} className="flex min-w-0 items-center gap-1">
            {i > 0 ? <ChevronRight className="size-3.5 shrink-0" aria-hidden /> : null}
            {item.to && i < items.length - 1 ? (
              <Link to={item.to} className="truncate hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span className="truncate font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Panel({
  judul,
  deskripsi,
  aksi,
  children,
  padat,
}: {
  judul?: string;
  deskripsi?: string;
  aksi?: ReactNode;
  children: ReactNode;
  padat?: boolean;
}) {
  return (
    <section className="surface min-w-0 overflow-hidden">
      {judul ? (
        <header className="flex flex-col gap-2 border-b border-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold tracking-tight sm:text-base">
              {judul}
            </h2>
            {deskripsi ? (
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{deskripsi}</p>
            ) : null}
          </div>
          {aksi ? <div className="shrink-0">{aksi}</div> : null}
        </header>
      ) : null}
      <div className={padat ? "" : "p-4 sm:p-5"}>{children}</div>
    </section>
  );
}

export function EmptyState({
  judul = "Belum ada data",
  deskripsi = "Data akan muncul di sini setelah tersedia.",
  aksi,
}: {
  judul?: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <p className="text-sm font-medium">{judul}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{deskripsi}</p>
      {aksi ? <div className="mt-3">{aksi}</div> : null}
    </div>
  );
}

export function LoadingState({ baris = 4 }: { baris?: number }) {
  return (
    <div className="space-y-3 p-4" aria-busy="true" aria-live="polite">
      {Array.from({ length: baris }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}

export function ErrorState({
  pesan = "Terjadi kesalahan saat memuat data.",
  onCoba,
}: {
  pesan?: string;
  onCoba?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <p className="text-sm font-medium text-destructive">{pesan}</p>
      {onCoba ? (
        <button
          onClick={onCoba}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
        >
          Coba lagi
        </button>
      ) : null}
    </div>
  );
}
