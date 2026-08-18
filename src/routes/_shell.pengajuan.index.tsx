import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Eye } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel, PageHeader, EmptyState } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  LABEL_STATUS,
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengajuan/")({
  head: () => ({
    meta: [
      { title: "Pengajuan Barang — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content: "Kelola seluruh pengajuan kebutuhan barang unit dan fakultas.",
      },
    ],
  }),
  component: PengajuanPage,
});

function PengajuanPage() {
  // Ditambahkan <any[]> agar TypeScript tidak protes
  const [listPengajuan, setListPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [cari, setCari] = useState("");
  const [status, setStatus] = useState("semua");
  const [unit, setUnit] = useState("semua");
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/pengajuan")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setListPengajuan(result.data);
        } else {
          toast.error("Gagal memuat data pengajuan");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Terjadi kesalahan koneksi ke server");
      })
      .finally(() => setLoading(false));
  }, []);

  const ringkasanBarang = (p: any) => {
    if (!p.daftarBarang || p.daftarBarang.length === 0) return "-";
    if (p.daftarBarang.length === 1) return p.daftarBarang[0].nama;
    return `${p.daftarBarang[0].nama} (+${p.daftarBarang.length - 1} lainnya)`;
  };

  const totalKuantitas = (p: any) => {
    if (!p.daftarBarang) return 0;
    return p.daftarBarang.reduce((sum: number, b: any) => sum + (b.jumlah || 0), 0);
  };

  const data = useMemo(
    () =>
      listPengajuan.filter((p: any) => {
        const q = cari.trim().toLowerCase();
        const cocokCari =
          !q ||
          p.nomorPengajuan?.toLowerCase().includes(q) ||
          p.namaPengaju?.toLowerCase().includes(q) ||
          p.daftarBarang?.some((b: any) => b.nama.toLowerCase().includes(q));

        return (
          cocokCari &&
          (status === "semua" || p.statusApproval === status) &&
          (unit === "semua" || p.unitFakultas === unit) &&
          (!tanggal || p.tanggalPengajuan === tanggal)
        );
      }),
    [listPengajuan, cari, status, unit, tanggal]
  );

  return (
    <>
      <PageHeader
        judul="Pengajuan Barang"
        subtitle="Kelola seluruh pengajuan kebutuhan barang dari database"
        aksi={
          <Button asChild className="w-full sm:w-auto">
            <Link to="/pengajuan/buat">
              <Plus className="size-4" aria-hidden /> Buat Pengajuan
            </Link>
          </Button>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="cari">Cari</Label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                id="cari"
                value={cari}
                onChange={(e) => setCari(e.target.value)}
                placeholder="Nomor, pengaju, atau barang"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                <SelectItem value="Menunggu Review">Menunggu Review</SelectItem>
                <SelectItem value="Disetujui">Disetujui</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Semua unit" />
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

      <Panel judul="Daftar Pengajuan" deskripsi={`${data.length} pengajuan ditemukan`} padat>
        {loading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Memuat data...</p>
        ) : data.length === 0 ? (
          <EmptyState judul="Tidak ada data" deskripsi="Ubah filter atau buat pengajuan baru." />
        ) : (
          <div className="table-scroll hidden lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="px-5 py-3">Nomor</th>
                  <th className="px-5 py-3">Tanggal</th>
                  <th className="px-5 py-3">Pengaju</th>
                  <th className="px-5 py-3">Unit</th>
                  <th className="px-5 py-3">Barang</th>
                  <th className="px-5 py-3 text-right">Jumlah</th>
                  <th className="px-5 py-3 text-right">Estimasi</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.map((p: any) => (
                  <tr key={p._id} className="border-b hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium">{p.nomorPengajuan}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatTanggal(p.tanggalPengajuan)}</td>
                    <td className="px-5 py-3">{p.namaPengaju}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.unitFakultas}</td>
                    <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                    <td className="px-5 py-3 text-right">{totalKuantitas(p)}</td>
                    <td className="px-5 py-3 text-right">{formatRupiah(p.estimasiTotal)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.statusApproval} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/pengajuan/$id" params={{ id: p.nomorPengajuan }}>
                          <Eye className="size-4" /> Detail
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}