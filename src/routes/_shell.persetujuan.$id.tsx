import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  AlasanDanLampiran,
  DaftarBarang,
  InformasiPengajuan,
  RiwayatPengajuan,
} from "@/components/pengajuan-detail";
import { getPengajuan } from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/persetujuan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Persetujuan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Tinjau pengajuan barang lalu setujui, tolak, atau minta perbaikan sesuai kebutuhan unit.",
      },
      { property: "og:title", content: "Detail Persetujuan — Sistem Pengadaan Kampus" },
      {
        property: "og:description",
        content: "Tinjau dan putuskan pengajuan barang kampus.",
      },
    ],
  }),
  component: DetailPersetujuanPage,
});

function DetailPersetujuanPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const p = getPengajuan(id);
  const [tolakTerbuka, setTolakTerbuka] = useState(false);
  const [alasanTolak, setAlasanTolak] = useState("");

  if (!p) {
    return (
      <Panel>
        <EmptyState
          judul="Pengajuan tidak ditemukan"
          deskripsi={`Pengajuan dengan nomor ${id} tidak tersedia.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/persetujuan">Kembali ke daftar persetujuan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Persetujuan", to: "/persetujuan" }, { label: p.nomor }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Persetujuan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{p.nomor}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link to="/persetujuan">
            <ArrowLeft className="size-4" aria-hidden /> Kembali
          </Link>
        </Button>
      </div>

      <InformasiPengajuan p={p} />
      <DaftarBarang p={p} />
      <AlasanDanLampiran p={p} />
      <RiwayatPengajuan p={p} />

      <Panel judul="Tindakan Persetujuan" deskripsi="Pilih keputusan atas pengajuan ini">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              toast.success("Pengajuan disetujui", {
                description: `${p.nomor} diteruskan ke proses pengadaan.`,
              });
              navigate({ to: "/persetujuan" });
            }}
          >
            <Check className="size-4" aria-hidden /> Setujui Pengajuan
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() =>
              toast.success("Permintaan perbaikan dikirim", {
                description: "Pengaju akan menerima notifikasi untuk memperbaiki pengajuan.",
              })
            }
          >
            <RotateCcw className="size-4" aria-hidden /> Minta Perbaikan
          </Button>
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive sm:w-auto"
            onClick={() => setTolakTerbuka(true)}
          >
            <X className="size-4" aria-hidden /> Tolak Pengajuan
          </Button>
        </div>
      </Panel>

      <Dialog open={tolakTerbuka} onOpenChange={setTolakTerbuka}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle>Alasan Penolakan</DialogTitle>
            <DialogDescription>
              Jelaskan alasan penolakan agar pengaju dapat memahami keputusan ini.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label htmlFor="alasanTolak">Alasan</Label>
            <Textarea
              id="alasanTolak"
              rows={4}
              value={alasanTolak}
              onChange={(e) => setAlasanTolak(e.target.value)}
              placeholder="Contoh: Anggaran unit untuk periode ini sudah terpakai."
            />
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setTolakTerbuka(false)}
            >
              Batal
            </Button>
            <Button
              className="w-full sm:w-auto"
              disabled={!alasanTolak.trim()}
              onClick={() => {
                setTolakTerbuka(false);
                toast.success("Pengajuan ditolak", { description: p.nomor });
                navigate({ to: "/persetujuan" });
              }}
            >
              Konfirmasi Penolakan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
