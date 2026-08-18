import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  LABEL_STATUS_PENGADAAN,
  PENGADAAN,
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
  getPengajuan,
  ringkasanBarang,
  totalNilai,
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
  const [tanggal, setTanggal] = useState("");

  const data = useMemo(
    () =>
      PENGADAAN.filter(
        (d) =>
          (status === "semua" || d.status === status) &&
          (unit === "semua" || d.unit === unit) &&
          (!tanggal || d.tanggal === tanggal),
      ),
    [status, unit, tanggal],
  );

  return (
    <>
      <PageHeader judul="Proses Pengadaan" subtitle="Kelola pengajuan yang telah disetujui" />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua status</SelectItem>
                {Object.entries(LABEL_STATUS_PENGADAAN).map(([k, v]) => (
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
          <div className="space-y-1.5">
            <Label htmlFor="tglPengadaan">Tanggal</Label>
            <Input
              id="tglPengadaan"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <Panel judul="Daftar Pengadaan" deskripsi={`${data.length} pengadaan ditampilkan`} padat>
        {data.length === 0 ? (
          <EmptyState
            judul="Belum ada pengadaan"
            deskripsi="Pengadaan akan muncul setelah pengajuan disetujui."
          />
        ) : (
          <>
            <div className="table-scroll hidden lg:block">
              <table className="w-full min-w-[62rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor Pengadaan</th>
                    <th className="px-5 py-3 font-medium">Nomor Pengajuan</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Nilai</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((d) => {
                    const p = getPengajuan(d.nomorPengajuan);
                    return (
                      <tr
                        key={d.nomor}
                        className="border-b border-border last:border-0 hover:bg-muted/50"
                      >
                        <td className="px-5 py-3 font-medium whitespace-nowrap">{d.nomor}</td>
                        <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                          {d.nomorPengajuan}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">{d.unit}</td>
                        <td className="px-5 py-3">{p ? ringkasanBarang(p) : "-"}</td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          {p ? formatRupiah(totalNilai(p)) : "-"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                          {formatTanggal(d.tanggal)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/pengadaan/$id" params={{ id: d.nomor }}>
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
                const p = getPengajuan(d.nomorPengajuan);
                return (
                  <li key={d.nomor} className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{d.nomor}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {d.nomorPengajuan} · {d.unit}
                        </p>
                      </div>
                      <StatusBadge status={d.status} />
                    </div>
                    <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                      <dt className="text-muted-foreground">Barang</dt>
                      <dd className="truncate text-right">{p ? ringkasanBarang(p) : "-"}</dd>
                      <dt className="text-muted-foreground">Nilai</dt>
                      <dd className="text-right font-medium">
                        {p ? formatRupiah(totalNilai(p)) : "-"}
                      </dd>
                      <dt className="text-muted-foreground">Tanggal</dt>
                      <dd className="text-right">{formatTanggal(d.tanggal)}</dd>
                    </dl>
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link to="/pengadaan/$id" params={{ id: d.nomor }}>
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
