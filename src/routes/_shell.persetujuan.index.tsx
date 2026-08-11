import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye } from "lucide-react";

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
import { EmptyState, PageHeader, Panel } from "@/components/ui-kit";
import { PrioritasBadge, StatusBadge } from "@/components/status-badge";
import {
  PENGAJUAN,
  PRIORITAS_LIST,
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalNilai,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/persetujuan/")({
  head: () => ({
    meta: [
      { title: "Persetujuan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Daftar pengajuan barang yang membutuhkan persetujuan Anda, lengkap dengan filter unit, prioritas, dan tanggal.",
      },
      { property: "og:title", content: "Persetujuan — Sistem Pengadaan Barang Kampus" },
      {
        property: "og:description",
        content: "Pengajuan yang membutuhkan persetujuan Anda.",
      },
    ],
  }),
  component: PersetujuanPage,
});

function PersetujuanPage() {
  const [status, setStatus] = useState("menunggu");
  const [unit, setUnit] = useState("semua");
  const [prioritas, setPrioritas] = useState("semua");
  const [tanggal, setTanggal] = useState("");

  const data = useMemo(
    () =>
      PENGAJUAN.filter(
        (p) =>
          (status === "semua" ? ["menunggu", "disetujui", "ditolak"].includes(p.status) : p.status === status) &&
          (unit === "semua" || p.unit === unit) &&
          (prioritas === "semua" || p.prioritas === prioritas) &&
          (!tanggal || p.tanggal === tanggal),
      ),
    [status, unit, prioritas, tanggal],
  );

  return (
    <>
      <PageHeader
        judul="Persetujuan"
        subtitle="Pengajuan yang membutuhkan persetujuan Anda"
      />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menunggu">Menunggu Persetujuan</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
                <SelectItem value="semua">Semua</SelectItem>
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
            <Label>Prioritas</Label>
            <Select value={prioritas} onValueChange={setPrioritas}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua prioritas</SelectItem>
                {PRIORITAS_LIST.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tgl">Tanggal</Label>
            <Input
              id="tgl"
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />
          </div>
        </div>
      </Panel>

      <Panel
        judul="Daftar Persetujuan"
        deskripsi={`${data.length} pengajuan ditampilkan`}
        padat
      >
        {data.length === 0 ? (
          <EmptyState
            judul="Tidak ada pengajuan"
            deskripsi="Belum ada pengajuan yang sesuai dengan filter yang dipilih."
          />
        ) : (
          <>
            <div className="table-scroll hidden lg:block">
              <table className="w-full min-w-[62rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor</th>
                    <th className="px-5 py-3 font-medium">Pengaju</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Nilai</th>
                    <th className="px-5 py-3 font-medium">Prioritas</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.nomor} className="border-b border-border last:border-0 hover:bg-muted/50">
                      <td className="px-5 py-3 font-medium whitespace-nowrap">{p.nomor}</td>
                      <td className="px-5 py-3">{p.pengaju}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                      <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {formatRupiah(totalNilai(p))}
                      </td>
                      <td className="px-5 py-3">
                        <PrioritasBadge prioritas={p.prioritas} />
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatTanggal(p.tanggal)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/persetujuan/$id" params={{ id: p.nomor }}>
                            <Eye className="size-4" aria-hidden /> Tinjau
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
                        {p.pengaju} · {p.unit}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <PrioritasBadge prioritas={p.prioritas} />
                    <span>{formatTanggal(p.tanggal)}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Barang</dt>
                    <dd className="truncate text-right">{ringkasanBarang(p)}</dd>
                    <dt className="text-muted-foreground">Nilai</dt>
                    <dd className="text-right font-medium">{formatRupiah(totalNilai(p))}</dd>
                  </dl>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link to="/persetujuan/$id" params={{ id: p.nomor }}>
                      Tinjau Pengajuan
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
