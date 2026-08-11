import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Eye } from "lucide-react";

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
  PENGAJUAN,
  LABEL_STATUS,
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalKuantitas,
  totalNilai,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengajuan/")({
  head: () => ({
    meta: [
      { title: "Pengajuan Barang — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Kelola seluruh pengajuan kebutuhan barang unit dan fakultas, lengkap dengan pencarian dan filter status.",
      },
      { property: "og:title", content: "Pengajuan Barang — Sistem Pengadaan Kampus" },
      {
        property: "og:description",
        content: "Kelola seluruh pengajuan kebutuhan barang kampus.",
      },
    ],
  }),
  component: PengajuanPage,
});

function PengajuanPage() {
  const [cari, setCari] = useState("");
  const [status, setStatus] = useState("semua");
  const [unit, setUnit] = useState("semua");
  const [tanggal, setTanggal] = useState("");

  const data = useMemo(
    () =>
      PENGAJUAN.filter((p) => {
        const q = cari.trim().toLowerCase();
        const cocokCari =
          !q ||
          p.nomor.toLowerCase().includes(q) ||
          p.pengaju.toLowerCase().includes(q) ||
          p.barang.some((b) => b.nama.toLowerCase().includes(q));
        return (
          cocokCari &&
          (status === "semua" || p.status === status) &&
          (unit === "semua" || p.unit === unit) &&
          (!tanggal || p.tanggal === tanggal)
        );
      }),
    [cari, status, unit, tanggal],
  );

  return (
    <>
      <PageHeader
        judul="Pengajuan Barang"
        subtitle="Kelola seluruh pengajuan kebutuhan barang"
        aksi={
          <Button asChild className="w-full sm:w-auto">
            <Link to="/pengajuan/buat">
              <Plus className="size-4" aria-hidden /> Buat Pengajuan
            </Link>
          </Button>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Semua status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                {Object.entries(LABEL_STATUS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger className="w-full">
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

          <div className="space-y-1.5">
            <Label htmlFor="tanggal">Tanggal</Label>
            <Input
              id="tanggal"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <Panel judul="Daftar Pengajuan" deskripsi={`${data.length} pengajuan ditemukan`} padat>
        {data.length === 0 ? (
          <EmptyState
            judul="Pengajuan tidak ditemukan"
            deskripsi="Ubah kata kunci pencarian atau filter yang digunakan."
          />
        ) : (
          <>
            <div className="table-scroll hidden lg:block">
              <table className="w-full min-w-[62rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor Pengajuan</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 font-medium">Pengaju</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Jumlah</th>
                    <th className="px-5 py-3 text-right font-medium">Estimasi Biaya</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.nomor} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 font-medium whitespace-nowrap">{p.nomor}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatTanggal(p.tanggal)}
                      </td>
                      <td className="px-5 py-3">{p.pengaju}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                      <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                      <td className="px-5 py-3 text-right">{totalKuantitas(p)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {formatRupiah(totalNilai(p))}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/pengajuan/$id" params={{ id: p.nomor }}>
                            <Eye className="size-4" aria-hidden /> Detail
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border lg:hidden">
              {data.map((p) => (
                <li key={p.nomor} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.nomor}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatTanggal(p.tanggal)} · {p.unit}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Pengaju</dt>
                    <dd className="truncate text-right">{p.pengaju}</dd>
                    <dt className="text-muted-foreground">Barang</dt>
                    <dd className="truncate text-right">{ringkasanBarang(p)}</dd>
                    <dt className="text-muted-foreground">Jumlah</dt>
                    <dd className="text-right">{totalKuantitas(p)}</dd>
                    <dt className="text-muted-foreground">Estimasi</dt>
                    <dd className="text-right font-medium">{formatRupiah(totalNilai(p))}</dd>
                  </dl>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/pengajuan/$id" params={{ id: p.nomor }}>
                      Lihat Detail
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </>
  );
}
