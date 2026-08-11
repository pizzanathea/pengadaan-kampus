import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, Clock, CheckCircle2, Loader2, PackageCheck, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  PENGAJUAN,
  LABEL_STATUS,
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalNilai,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Ringkasan aktivitas pengadaan barang kampus: total pengajuan, persetujuan tertunda, dan pengajuan terbaru.",
      },
      { property: "og:title", content: "Dashboard — Sistem Pengadaan Barang Kampus" },
      {
        property: "og:description",
        content: "Ringkasan aktivitas pengadaan barang kampus dalam satu halaman.",
      },
    ],
  }),
  component: DashboardPage,
});

function jumlahStatus(status: string) {
  return PENGAJUAN.filter((p) => p.status === status).length;
}

const KPI = [
  { label: "Total Pengajuan", nilai: PENGAJUAN.length, icon: FileText },
  { label: "Menunggu Persetujuan", nilai: jumlahStatus("menunggu"), icon: Clock },
  { label: "Disetujui", nilai: jumlahStatus("disetujui"), icon: CheckCircle2 },
  { label: "Sedang Diproses", nilai: jumlahStatus("diproses"), icon: Loader2 },
  { label: "Selesai", nilai: jumlahStatus("selesai"), icon: PackageCheck },
];

const DATA_GRAFIK = (
  ["menunggu", "disetujui", "ditolak", "diproses", "selesai"] as const
).map((s) => ({
  status: LABEL_STATUS[s],
  ringkas: LABEL_STATUS[s].split(" ")[0],
  jumlah: jumlahStatus(s),
}));

function DashboardPage() {
  const terbaru = PENGAJUAN.slice(0, 6);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ringkasan aktivitas pengadaan barang kampus
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-5">
        {KPI.map((k) => (
          <div key={k.label} className="surface min-w-0 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs leading-snug text-muted-foreground sm:text-sm">{k.label}</p>
              <k.icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{k.nilai}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel judul="Pengajuan Berdasarkan Status" deskripsi="Statistik pengajuan periode ini">
            <div className="h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DATA_GRAFIK} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
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
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.status ?? ""}
                    formatter={(v: number) => [`${v} pengajuan`, ""]}
                  />
                  <Bar dataKey="jumlah" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel judul="Ringkasan Nilai" deskripsi="Estimasi nilai pengajuan">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted-foreground">Total estimasi nilai</dt>
              <dd className="mt-1 text-xl font-semibold break-words sm:text-2xl">
                {formatRupiah(PENGAJUAN.reduce((s, p) => s + totalNilai(p), 0))}
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="text-sm text-muted-foreground">Menunggu persetujuan</dt>
              <dd className="mt-1 text-base font-medium break-words">
                {formatRupiah(
                  PENGAJUAN.filter((p) => p.status === "menunggu").reduce(
                    (s, p) => s + totalNilai(p),
                    0,
                  ),
                )}
              </dd>
            </div>
            <div className="border-t border-border pt-4">
              <dt className="text-sm text-muted-foreground">Sudah selesai</dt>
              <dd className="mt-1 text-base font-medium break-words">
                {formatRupiah(
                  PENGAJUAN.filter((p) => p.status === "selesai").reduce(
                    (s, p) => s + totalNilai(p),
                    0,
                  ),
                )}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel
        judul="Pengajuan Terbaru"
        deskripsi="Enam pengajuan terakhir yang masuk"
        aksi={
          <Button variant="outline" size="sm" asChild>
            <Link to="/pengajuan">Lihat semua</Link>
          </Button>
        }
        padat
      >
        {/* Desktop: tabel */}
        <div className="table-scroll hidden md:block">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="px-5 py-3 font-medium">Nomor</th>
                <th className="px-5 py-3 font-medium">Pengaju</th>
                <th className="px-5 py-3 font-medium">Unit</th>
                <th className="px-5 py-3 font-medium">Barang</th>
                <th className="px-5 py-3 text-right font-medium">Nilai</th>
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {terbaru.map((p) => (
                <tr key={p.nomor} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="px-5 py-3 font-medium whitespace-nowrap">
                    <Link
                      to="/pengajuan/$id"
                      params={{ id: p.nomor }}
                      className="underline-offset-4 hover:underline"
                    >
                      {p.nomor}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{p.pengaju}</td>
                  <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                  <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {formatRupiah(totalNilai(p))}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                    {formatTanggal(p.tanggal)}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: list card */}
        <ul className="divide-y divide-border md:hidden">
          {terbaru.map((p) => (
            <li key={p.nomor} className="p-4">
              <Link to="/pengajuan/$id" params={{ id: p.nomor }} className="block min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="truncate text-sm font-medium">{p.nomor}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {p.pengaju} · {p.unit}
                </p>
                <p className="mt-1 truncate text-sm">{ringkasanBarang(p)}</p>
                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span>{formatTanggal(p.tanggal)}</span>
                  <span className="font-medium text-foreground">
                    {formatRupiah(totalNilai(p))}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
