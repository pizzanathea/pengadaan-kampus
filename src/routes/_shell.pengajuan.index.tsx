import { useState, useEffect, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Eye, RefreshCw } from "lucide-react";
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
  formatRupiah,
  formatTanggal,
  totalNilai,
  totalKuantitas,
  ringkasanBarang,
} from "@/data/pengadaan";
import { apiFetchUnitList, mapBackendPengajuan, apiUpdatePengajuan } from "@/lib/api";

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
  const [listPengajuan, setListPengajuan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mengirimUlang, setMengirimUlang] = useState<string | null>(null);
  const [unitList, setUnitList] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [cari, setCari] = useState("");
  const [status, setStatus] = useState("semua");
  const [unit, setUnit] = useState("semua");
  const [tanggal, setTanggal] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Gagal mengambil data user dari localStorage");
      }
    }
  }, []);

  const muatData = () => {
    setLoading(true);
    fetch("http://localhost:5000/api/pengajuan")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setListPengajuan(result.data.map(mapBackendPengajuan));
        } else {
          toast.error("Gagal memuat data pengajuan");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Terjadi kesalahan koneksi ke server");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    muatData();
  }, []);

  useEffect(() => {
    apiFetchUnitList().then(setUnitList).catch(() => setUnitList([]));
  }, []);

  const handleKirimUlang = async (p: any) => {
    setMengirimUlang(p.id);
    try {
      // kembaliKe dari backend nentuin balik ke tahap mana — kalau gak ada
      // (data lama), default aman ke "menunggu" (mulai dari Persetujuan 1 lagi).
      const statusBaru = p.kembaliKe || "menunggu";
      await apiUpdatePengajuan(p.id, { statusApproval: statusBaru });
      toast.success("Pengajuan dikirim ulang", {
        description:
          statusBaru === "menunggu_2"
            ? `${p.nomor} langsung diteruskan ke Persetujuan Keuangan.`
            : `${p.nomor} diteruskan ke Persetujuan 1.`,
      });
      muatData();
    } catch (e) {
      toast.error("Gagal mengirim ulang pengajuan", {
        description: e instanceof Error ? e.message : "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setMengirimUlang(null);
    }
  };

  const data = useMemo(
    () =>
      listPengajuan.filter((p: any) => {
        const q = cari.trim().toLowerCase();
        const cocokCari =
          !q ||
          p.nomor?.toLowerCase().includes(q) ||
          p.pengaju?.toLowerCase().includes(q) ||
          p.barang?.some((b: any) => b.nama.toLowerCase().includes(q));

        const cocokUser =
          !currentUser ||
          ["Super Admin", "Admin", "Persetujuan 1", "Persetujuan 2"].includes(currentUser.role) ||
          p.pengaju === currentUser.nama;

        return (
          cocokCari &&
          cocokUser &&
          (status === "semua" || p.status === status) &&
          (unit === "semua" || p.unit === unit) &&
          (!tanggal || p.tanggal === tanggal)
        );
      }),
    [listPengajuan, cari, status, unit, tanggal, currentUser],
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
              <Search
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
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
                <SelectItem value="menunggu">Menunggu Persetujuan</SelectItem>
                <SelectItem value="menunggu_2">Menunggu Persetujuan Keuangan</SelectItem>
                <SelectItem value="perlu_perbaikan">Perlu Perbaikan</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
                <SelectItem value="diproses">Sedang Diproses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
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
                {unitList.map((u) => (
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
                  <tr key={p.id} className="border-b hover:bg-muted/50">
                    <td className="px-5 py-3 font-medium">{p.nomor}</td>
                    <td className="px-5 py-3 text-muted-foreground">{formatTanggal(p.tanggal)}</td>
                    <td className="px-5 py-3">{p.pengaju}</td>
                    <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                    <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                    <td className="px-5 py-3 text-right">{totalKuantitas(p)}</td>
                    <td className="px-5 py-3 text-right">{formatRupiah(totalNilai(p))}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {p.status === "perlu_perbaikan" ? (
                          <Button
                            variant="default"
                            size="sm"
                            disabled={mengirimUlang === p.id}
                            onClick={() => handleKirimUlang(p)}
                          >
                            <RefreshCw className="size-4" aria-hidden /> Kirim Ulang
                          </Button>
                        ) : null}
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            to="/pengajuan/$id"
                            params={{ id: p.id }}
                            search={{ role: "persetujuan_1" }}
                          >
                            <Eye className="size-4" /> Detail
                          </Link>
                        </Button>
                      </div>
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
