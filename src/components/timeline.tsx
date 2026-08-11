import { Check, Circle, Dot } from "lucide-react";
import { cn } from "@/lib/utils";

export type LangkahTimeline = {
  judul: string;
  oleh?: string;
  waktu?: string;
  status: "selesai" | "aktif" | "menunggu";
};

export function Timeline({ langkah }: { langkah: LangkahTimeline[] }) {
  return (
    <ol className="space-y-0">
      {langkah.map((l, i) => {
        const terakhir = i === langkah.length - 1;
        return (
          <li key={l.judul} className="flex min-w-0 gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full ring-1 ring-inset",
                  l.status === "selesai" &&
                    "bg-status-approved-bg text-status-approved ring-status-approved/25",
                  l.status === "aktif" &&
                    "bg-status-wait-bg text-status-wait ring-status-wait/25",
                  l.status === "menunggu" && "bg-muted text-muted-foreground ring-border",
                )}
              >
                {l.status === "selesai" ? (
                  <Check className="size-3.5" aria-hidden />
                ) : l.status === "aktif" ? (
                  <Dot className="size-5" aria-hidden />
                ) : (
                  <Circle className="size-3" aria-hidden />
                )}
              </span>
              {!terakhir ? <span className="w-px flex-1 bg-border" aria-hidden /> : null}
            </div>
            <div className={cn("min-w-0", terakhir ? "pb-0" : "pb-6")}>
              <p
                className={cn(
                  "text-sm break-words",
                  l.status === "menunggu"
                    ? "text-muted-foreground"
                    : "font-medium text-foreground",
                )}
              >
                {l.judul}
              </p>
              {l.oleh ? (
                <p className="text-xs text-muted-foreground break-words">{l.oleh}</p>
              ) : null}
              {l.waktu ? <p className="text-xs text-muted-foreground">{l.waktu}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
