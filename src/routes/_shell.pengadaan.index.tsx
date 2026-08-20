import { useMemo, useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState, PageHeader, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengadaan/")({
  head: () => ({
    meta: [
      { title: "Proses Pengadaan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Kelola pengajuan yang telah disetujui hingga proses pengadaan barang kampus dinyatakan selesai.",
      },
      { property: "og:title", content: "Proses Pengadaan — Sistem Pengadaan Kampus" },
      { property: "og:description", content: "Kelola pengajuan yang telah disetujui." },
    ],
  }),
  component: PengadaanPage,
});

function PengadaanPage() {
  const [status, setStatus] = useState("semua");
  const [unit, setUnit] = useState("semua");
  const [pengadaanList, setPengadaanList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil data langsung dari endpoint backend pengajuan
  useEffect(() => {
    fetch("http://localhost:5000/api/pengajuan")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          setPengadaanList(result.data);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data pengadaan:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter data berdasarkan status approval dan unit fakultas
  const data = useMemo(
    () =>
      pengadaanList.filter((d) => {
        const itemStatus = d.statusApproval || "menunggu";
        const itemUnit = d.unitFakultas || "";

        const matchStatus = status === "semua" || itemStatus === status;
        const matchUnit = unit === "semua" || itemUnit === unit;

        return matchStatus && matchUnit;
      }),
    [pengadaanList, status, unit],
  );

  return (
    <>
      <PageHeader judul="Proses Pengadaan" subtitle="Kelola pengajuan barang dari database" />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="menunggu_2">Menunggu II</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
                <SelectItem value="perlu_perbaikan">Perlu Perbaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua unit</SelectItem>
                {UNIT_LIST.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>

      <Panel judul="Daftar Pengadaan" deskripsi={`${data.length} pengadaan ditampilkan`} padat>
        {loading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Memuat data pengadaan...</p>
        ) : data.length === 0 ? (
          <EmptyState
            judul="Belum ada pengadaan"
            deskripsi="Data pengajuan belum tersedia di database."
          />
        ) : (
          <>
            <div className="table-scroll hidden lg:block">
              <table className="w-full min-w-248 text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor Pengajuan</th>
                    <th className="px-5 py-3 font-medium">Nama Pengaju</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Estimasi Total</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d) => {
                    const idUnik = d._id || d.nomorPengajuan;
                    const ringkasanBarang = d.daftarBarang && d.daftarBarang.length > 0
                      ? `${d.daftarBarang[0].nama} ${d.daftarBarang.length > 1 ? `(+${d.daftarBarang.length - 1} lainnya)` : ""}`
                      : "-";

                    return (
                      <tr
                        key={idUnik}
                        className="border-b border-border last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-5 py-3 font-medium whitespace-nowrap">{d.nomorPengajuan}</td>
                        <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                          {d.namaPengaju}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{d.unitFakultas}</td>
                        <td className="px-5 py-3">{ringkasanBarang}</td>
                        <td className="px-5 py-3 text-right whitespace-nowrap font-medium">
                          {formatRupiah(d.estimasiTotal || 0)}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={d.statusApproval} />
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                          {formatTanggal(d.tanggalPengajuan)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/pengadaan/$id" params={{ id: d.nomorPengajuan }}>
                              <Eye className="size-4" aria-hidden /> Detail
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border lg:hidden">
              {data.map((d) => {
                const idUnik = d._id || d.nomorPengajuan;
                const ringkasanBarang = d.daftarBarang && d.daftarBarang.length > 0
                  ? `${d.daftarBarang[0].nama} ${d.daftarBarang.length > 1 ? `(+${d.daftarBarang.length - 1} lainnya)` : ""}`
                  : "-";

                return (
                  <li key={idUnik} className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{d.nomorPengajuan}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.namaPengaju} · {d.unitFakultas}
                        </p>
                      </div>
                      <StatusBadge status={d.statusApproval} />
                    </div>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                      <dt className="text-muted-foreground">Barang</dt>
                      <dd className="truncate text-right">{ringkasanBarang}</dd>
                      <dt className="text-muted-foreground">Total Nilai</dt>
                      <dd className="text-right font-medium">
                        {formatRupiah(d.estimasiTotal || 0)}
                      </dd>
                      <dt className="text-muted-foreground">Tanggal</dt>
                      <dd className="text-right">{formatTanggal(d.tanggalPengajuan)}</dd>
                    </dl>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link
                        to="/pengajuan/$id"
                        params={{ id: d.nomorPengajuan }}
                        search={{ role: "persetujuan_1" }}
                      >
                        Lihat Detail
                      </Link>
                    </Button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </Panel>
    </>
  );
}