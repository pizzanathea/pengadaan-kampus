import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { DaftarBarang, InformasiPengajuan } from "@/components/pengajuan-detail";
import { Timeline } from "@/components/timeline";
import {
  PENGADAAN,
  formatTanggal,
  getPengajuan,
  type StatusPengadaan,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengadaan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Proses Pengadaan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Pantau alur proses pengadaan barang kampus dari disetujui, sedang diproses, hingga selesai.",
      },
      { property: "og:title", content: "Detail Proses Pengadaan — Sistem Pengadaan Kampus" },
      { property: "og:description", content: "Alur proses pengadaan barang kampus." },
    ],
  }),
  component: DetailPengadaanPage,
});

function DetailPengadaanPage() {
  const { id } = Route.useParams();
  const awal = PENGADAAN.find((d) => d.nomor === id);
  const [status, setStatus] = useState<StatusPengadaan>(awal?.status ?? "menunggu-proses");

  if (!awal) {
    return (
      <Panel>
        <EmptyState
          judul="Pengadaan tidak ditemukan"
          deskripsi={`Pengadaan dengan nomor ${id} tidak tersedia.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/pengadaan">Kembali ke daftar pengadaan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  const p = getPengajuan(awal.nomorPengajuan);
  const diproses = status === "diproses" || status === "selesai";
  const selesai = status === "selesai";

  return (
    <>
      <Breadcrumb items={[{ label: "Proses Pengadaan", to: "/pengadaan" }, { label: awal.nomor }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Proses</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{awal.nomor}</span>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pengajuan {awal.nomorPengajuan} · {awal.unit} · {formatTanggal(awal.tanggal)}
          </p>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/pengadaan">
            <ArrowLeft className="size-4" aria-hidden /> Kembali
          </Link>
        </Button>
      </div>

      <Panel judul="Alur Pengadaan" deskripsi="Disetujui → Sedang Diproses → Selesai">
        <Timeline
          langkah={[
            { judul: "Disetujui", oleh: "Kepala Unit", waktu: formatTanggal(awal.tanggal), status: "selesai" },
            {
              judul: "Sedang Diproses",
              oleh: "Admin Pengadaan",
              status: diproses ? (selesai ? "selesai" : "aktif") : "menunggu",
            },
            { judul: "Selesai", status: selesai ? "selesai" : "menunggu" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={diproses}
            onClick={() => {
              setStatus("diproses");
              toast.success("Proses pengadaan dimulai", { description: awal.nomor });
            }}
          >
            <Play className="size-4" aria-hidden /> Mulai Proses
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={!diproses || selesai}
            onClick={() => {
              setStatus("selesai");
              toast.success("Pengadaan ditandai selesai", { description: awal.nomor });
            }}
          >
            <CheckCheck className="size-4" aria-hidden /> Tandai Selesai
          </Button>
        </div>
      </Panel>

      {p ? (
        <>
          <InformasiPengajuan p={p} />
          <DaftarBarang p={p} />
        </>
      ) : null}
    </>
  );
}
