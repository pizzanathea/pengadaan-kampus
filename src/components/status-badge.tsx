import { cn } from "@/lib/utils";
import { LABEL_STATUS, LABEL_STATUS_PENGADAAN } from "@/data/pengadaan";
import type { StatusPengadaan, StatusPengajuan } from "@/data/pengadaan";

const KELAS: Record<string, string> = {
  menunggu: "bg-status-wait-bg text-status-wait ring-status-wait/20",
  "menunggu-proses": "bg-status-wait-bg text-status-wait ring-status-wait/20",
  disetujui: "bg-status-approved-bg text-status-approved ring-status-approved/20",
  ditolak: "bg-status-rejected-bg text-status-rejected ring-status-rejected/20",
  diproses: "bg-status-process-bg text-status-process ring-status-process/20",
  selesai: "bg-status-done-bg text-status-done ring-status-done/20",
  dibatalkan: "bg-status-cancel-bg text-status-cancel ring-status-cancel/20",
};

export function StatusBadge({
  status,
  className,
}: {
  status: StatusPengajuan | StatusPengadaan;
  className?: string;
}) {
  const label =
    (LABEL_STATUS as Record<string, string>)[status] ??
    (LABEL_STATUS_PENGADAAN as Record<string, string>)[status] ??
    status;

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        KELAS[status],
        className,
      )}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" aria-hidden />
      {label}
    </span>
  );
}

const KELAS_PRIORITAS: Record<string, string> = {
  Rendah: "bg-muted text-muted-foreground ring-border",
  Sedang: "bg-status-process-bg text-status-process ring-status-process/20",
  Tinggi: "bg-status-wait-bg text-status-wait ring-status-wait/20",
  Mendesak: "bg-status-rejected-bg text-status-rejected ring-status-rejected/20",
};

export function PrioritasBadge({ prioritas }: { prioritas: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        KELAS_PRIORITAS[prioritas],
      )}
    >
      {prioritas}
    </span>
  );
}
