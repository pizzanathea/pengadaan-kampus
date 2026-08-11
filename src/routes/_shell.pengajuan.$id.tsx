import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  AlasanDanLampiran,
  DaftarBarang,
  InformasiPengajuan,
  RiwayatPengajuan,
} from "@/components/pengajuan-detail";
import { getPengajuan } from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengajuan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Pengajuan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Detail pengajuan barang kampus: informasi pengaju, daftar barang, alasan, lampiran, dan riwayat pengajuan.",
      },
      { property: "og:title", content: "Detail Pengajuan — Sistem Pengadaan Kampus" },
      {
        property: "og:description",
        content: "Rincian lengkap satu pengajuan barang beserta riwayat prosesnya.",
      },
    ],
  }),
  component: DetailPengajuanPage,
});

function DetailPengajuanPage() {
  const { id } = Route.useParams();
  const p = getPengajuan(id);

  if (!p) {
    return (
      <Panel>
        <EmptyState
          judul="Pengajuan tidak ditemukan"
          deskripsi={`Pengajuan dengan nomor ${id} tidak tersedia.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/pengajuan">Kembali ke daftar pengajuan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Pengajuan Barang", to: "/pengajuan" }, { label: p.nomor }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Pengajuan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{p.nomor}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="size-4" aria-hidden /> Cetak
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/pengajuan">
              <ArrowLeft className="size-4" aria-hidden /> Kembali
            </Link>
          </Button>
        </div>
      </div>

      <InformasiPengajuan p={p} />
      <DaftarBarang p={p} />
      <AlasanDanLampiran p={p} />
      <RiwayatPengajuan p={p} />
    </>
  );
}
