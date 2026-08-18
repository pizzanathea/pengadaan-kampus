import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, CheckCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import { DaftarBarang, InformasiPengajuan } from "@/components/pengajuan-detail";
import { Timeline } from "@/components/timeline";
import { formatTanggal, type StatusPengadaan } from "@/data/pengadaan";

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

  const [pengadaanData, setPengadaanData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusPengadaan>("menunggu-proses");

  useEffect(() => {
    // Mengambil data dari backend MongoDB (menggantikan data statis PENGADAAN & getPengajuan)
    fetch(`http://localhost:5000/api/pengajuan`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          // Cari berdasarkan nomor pengajuan atau _id database
          const found = result.data.find(
            (item: any) => item.nomorPengajuan === id || item._id === id
          );
          if (found) {
            setPengadaanData(found);
            // Mapping status dari backend ke status pengadaan frontend
            const backendStatus = found.statusApproval;
            if (backendStatus === "Disetujui") {
              setStatus("diproses"); // atau disesuaikan dengan logika bisnis Anda
            } else {
              setStatus("menunggu-proses");
            }
          }
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data pengadaan:", err);
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

  if (!pengadaanData) {
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

  // Petakan data agar kompatibel dengan komponen InformasiPengajuan dan DaftarBarang
  const mappedData = {
    ...pengadaanData,
    nomor: pengadaanData.nomorPengajuan || id,
    status: pengadaanData.statusApproval || "Menunggu Review",
    unit: pengadaanData.unitFakultas || "-",
    pengaju: pengadaanData.namaPengaju || "-",
    tanggal: pengadaanData.tanggalPengajuan || "",
    barang: pengadaanData.daftarBarang || [],
  };

  const diproses = status === "diproses" || status === "selesai";
  const selesai = status === "selesai";

  return (
    <>
      <Breadcrumb items={[{ label: "Proses Pengadaan", to: "/pengadaan" }, { label: mappedData.nomor }]} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Proses</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{mappedData.nomor}</span>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pengajuan {mappedData.nomor} · {mappedData.unit} · {formatTanggal(mappedData.tanggal)}
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
            { judul: "Disetujui", oleh: "Kepala Unit", waktu: formatTanggal(mappedData.tanggal), status: "selesai" },
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
              toast.success("Proses pengadaan dimulai", { description: mappedData.nomor });
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
              toast.success("Pengadaan ditandai selesai", { description: mappedData.nomor });
            }}
          >
            <CheckCheck className="size-4" aria-hidden /> Tandai Selesai
          </Button>
        </div>
      </Panel>

      <InformasiPengajuan p={mappedData} />
      <DaftarBarang p={mappedData} />
    </>
  );
}