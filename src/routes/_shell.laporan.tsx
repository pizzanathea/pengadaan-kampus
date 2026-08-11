import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

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
  KATEGORI_LIST,
  LABEL_STATUS,
  PENGAJUAN,
  PENGAJUAN_PER_BULAN,
  UNIT_LIST,
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalNilai,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/laporan")({
  head: () => ({
    meta: [
      { title: "Laporan Pengadaan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Laporan pengadaan barang kampus: rekap pengajuan per bulan, per status, per unit, serta ekspor Excel dan PDF.",
      },
      { property: "og:title", content: "Laporan Pengadaan — Sistem Pengadaan Kampus" },
      { property: "og:description", content: "Rekap dan analisis pengadaan barang kampus." },
    ],
  }),
  component: LaporanPage,
});

const WARNA = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function LaporanPage() {
  const [periode, setPeriode] = useState("2026");
  const [unit, setUnit] = useState("semua");
  const [status, setStatus] = useState("semua");
  const [kategori, setKategori] = useState("semua");

  const data = useMemo(
    () =>
      PENGAJUAN.filter(
        (p) =>
          (unit === "semua" || p.unit === unit) &&
          (status === "semua" || p.status === status) &&
          (kategori === "semua" || p.barang.some((b) => b.kategori === kategori)),
      ),
    [unit, status, kategori],
  );

  const kpi = [
    { label: "Total Pengajuan", nilai: String(data.length) },
    {
      label: "Pengajuan Disetujui",
      nilai: String(
        data.filter((p) => ["disetujui", "diproses", "selesai"].includes(p.status)).length,
      ),
    },
    { label: "Pengajuan Ditolak", nilai: String(data.filter((p) => p.status === "ditolak").length) },
    {
      label: "Total Nilai Pengadaan",
      nilai: formatRupiah(data.reduce((s, p) => s + totalNilai(p), 0)),
    },
  ];

  const perStatus = (["menunggu", "disetujui", "ditolak", "diproses", "selesai"] as const).map(
    (s) => ({
      status: LABEL_STATUS[s],
      ringkas: LABEL_STATUS[s].split(" ")[0],
      jumlah: data.filter((p) => p.status === s).length,
    }),
  );

  const perUnit = UNIT_LIST.map((u) => ({
    unit: u,
    ringkas: u.replace("Fakultas ", "F. "),
    jumlah: data.filter((p) => p.unit === u).length,
  })).filter((u) => u.jumlah > 0);

  const tooltipStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
  } as const;

  return (
    <>
      <PageHeader
        judul="Laporan Pengadaan"
        subtitle="Rekap pengajuan dan nilai pengadaan barang kampus"
        aksi={
          <>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => toast.success("Laporan diekspor ke Excel")}
            >
              <FileSpreadsheet className="size-4" aria-hidden /> Ekspor Excel
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => toast.success("Laporan diekspor ke PDF")}
            >
              <FileText className="size-4" aria-hidden /> Ekspor PDF
            </Button>
          </>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Periode</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2026">Tahun 2026</SelectItem>
                <SelectItem value="2026-s1">Semester 1 2026</SelectItem>
                <SelectItem value="2026-s2">Semester 2 2026</SelectItem>
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
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
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
            <Label>Kategori</Label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua kategori</SelectItem>
                {KATEGORI_LIST.map((k) => (
                  <SelectItem key={k} value={k}>
                    {k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {kpi.map((k) => (
          <div key={k.label} className="surface min-w-0 p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">{k.label}</p>
            <p className="mt-2 text-lg font-semibold tracking-tight break-words sm:text-xl">
              {k.nilai}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <Panel judul="Pengajuan per Bulan">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PENGAJUAN_PER_BULAN} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="bulan"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v} pengajuan`, ""]} />
                <Line
                  type="monotone"
                  dataKey="jumlah"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel judul="Pengajuan Berdasarkan Status">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perStatus} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="ringkas"
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(_, payload) => payload?.[0]?.payload?.status ?? ""}
                  formatter={(v: number) => [`${v} pengajuan`, ""]}
                />
                <Bar dataKey="jumlah" radius={[4, 4, 0, 0]} maxBarSize={44}>
                  {perStatus.map((_, i) => (
                    <Cell key={i} fill={WARNA[i % WARNA.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="xl:col-span-2">
          <Panel judul="Pengajuan Berdasarkan Unit">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={perUnit}
                  layout="vertical"
                  margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="ringkas"
                    width={110}
                    tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.unit ?? ""}
                    formatter={(v: number) => [`${v} pengajuan`, ""]}
                  />
                  <Bar dataKey="jumlah" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <Panel judul="Rincian Laporan" deskripsi={`${data.length} pengajuan pada periode terpilih`} padat>
        {data.length === 0 ? (
          <EmptyState
            judul="Data laporan kosong"
            deskripsi="Tidak ada pengajuan yang sesuai dengan filter laporan."
          />
        ) : (
          <>
            <div className="table-scroll hidden md:block">
              <table className="w-full min-w-[54rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Pengaju</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Nilai</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr key={p.nomor} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium whitespace-nowrap">{p.nomor}</td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatTanggal(p.tanggal)}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                      <td className="px-5 py-3">{p.pengaju}</td>
                      <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {formatRupiah(totalNilai(p))}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
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
                    <dt className="text-muted-foreground">Nilai</dt>
                    <dd className="text-right font-medium">{formatRupiah(totalNilai(p))}</dd>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </>
  );
}
