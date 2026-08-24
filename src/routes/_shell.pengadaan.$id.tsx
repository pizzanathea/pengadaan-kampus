import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { DaftarBarang, InformasiPengajuan, CatatanKeputusan } from "@/components/pengajuan-detail";
import { Timeline } from "@/components/timeline";

export const Route = createFileRoute("/_shell/pengadaan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Proses Pengadaan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Pantau alur proses pengadaan barang kampus dari disetujui, sedang diproses, hingga selesai.",
      },
    ],
  }),
  component: DetailPengadaanPage,
});

function DetailPengadaanPage() {
  const { id } = Route.useParams();

  const [pengajuan, setPengajuan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("diproses");

  // Ambil data pengajuan dari backend berdasarkan nomorPengajuan atau _id
  useEffect(() => {
    fetch("http://localhost:5000/api/pengajuan")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find(
            (item: any) => item.nomorPengajuan === id || item._id === id
          );
          if (found) {
            setPengajuan(found);
            // Menyesuaikan status berdasarkan data database
            setStatus(found.statusApproval || "diproses");
          }
        }
      })
      .catch((err) => {
        console.error("Gagal memuat detail pengadaan:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Panel>
        <p className="p-6 text-center text-sm text-muted-foreground">Memuat detail proses pengadaan...</p>
      </Panel>
    );
  }

  if (!pengajuan) {
    return (
      <Panel>
        <EmptyState
          judul="Pengadaan tidak ditemukan"
          deskripsi={`Pengadaan dengan nomor ${id} tidak tersedia di database.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/pengadaan">Kembali ke daftar pengadaan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  // Fungsi untuk memperbarui status ke backend saat tombol "Tandai Selesai" diklik
  const handleTandaiSelesai = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/pengajuan/${pengajuan._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statusApproval: "selesai" }),
      });

      const responseText = await response.text();
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (err) {
        throw new Error(responseText || "Gagal mengurai respons server");
      }

      if (result.success) {
        setStatus("selesai");
        toast.success("Pengadaan ditandai selesai", { description: pengajuan.nomorPengajuan });
      } else {
        toast.error("Gagal memperbarui status: " + result.message);
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan: " + error.message);
    }
  };

  const isSelesai = status === "selesai";
  const isDitolak = status === "ditolak";
  const isPerluPerbaikan = status === "perlu_perbaikan";
  const diproses = !isSelesai;

  // Format data agar kompatibel dengan komponen InformasiPengajuan & DaftarBarang
  const mappedData = {
    ...pengajuan,
    nomor: pengajuan.nomorPengajuan,
    status: status,
    unit: pengajuan.unitFakultas,
    pengaju: pengajuan.namaPengaju,
    tanggal: pengajuan.tanggalPengajuan,
    barang: pengajuan.daftarBarang || [],
    lampiran: pengajuan.lampiran || [],
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Proses Pengadaan", to: "/pengadaan" }, { label: pengajuan.nomorPengajuan }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Proses</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{pengajuan.nomorPengajuan}</span>
            <StatusBadge status={status as any} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pengajuan {pengajuan.nomorPengajuan} · {pengajuan.unitFakultas} · {pengajuan.tanggalPengajuan}
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
            {
              judul: "Disetujui",
              oleh: "Kepala Unit",
              waktu: pengajuan.tanggalPengajuan,
              status: "selesai",
            },
            {
              judul: "Sedang Diproses",
              oleh: "Admin Pengadaan",
              status: diproses ? (isSelesai ? "selesai" : "aktif") : "menunggu",
            },
            { judul: "Selesai", status: isSelesai ? "selesai" : "menunggu" },
          ]}
        />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            disabled={isSelesai || isDitolak || isPerluPerbaikan}
            onClick={handleTandaiSelesai}
          >
            <CheckCheck className="size-4" aria-hidden />
            {isDitolak
              ? "Pengajuan Ditolak"
              : isPerluPerbaikan
                ? "Menunggu Perbaikan"
                : isSelesai
                  ? "Selesai"
                  : "Tandai Selesai"}
          </Button>
        </div>
      </Panel>

      <InformasiPengajuan p={mappedData} />
      <DaftarBarang p={mappedData} />
      <CatatanKeputusan p={mappedData} />
    </>
  );
}