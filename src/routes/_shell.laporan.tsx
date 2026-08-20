import { useEffect, useMemo, useState } from "react";
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
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
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
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalNilai,
} from "@/data/pengadaan";
import { apiFetchLaporan, apiFetchUnitList, mapBackendPengajuan, type LaporanResponse } from "@/lib/api";

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

const WARNA = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tahunSekarang = new Date().getFullYear();
const pilihanTahun = Array.from({ length: 5 }, (_, index) => String(tahunSekarang - 2 + index));

function LaporanPage() {
  const [periode, setPeriode] = useState("2026");
  const [unit, setUnit] = useState("semua");
  const [status, setStatus] = useState("semua");
  const [kategori, setKategori] = useState("semua");
  const [laporan, setLaporan] = useState<LaporanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unitList, setUnitList] = useState<string[]>([]);

  useEffect(() => {
    let aktif = true;
    setLoading(true);
    setError(null);
    setLaporan(null);
    apiFetchLaporan({ periode, unit, status, kategori })
      .then((hasil) => {
        if (aktif) setLaporan(hasil);
      })
      .catch((e) => {
        if (aktif) setError(e instanceof Error ? e.message : "Gagal memuat laporan.");
      })
      .finally(() => {
        if (aktif) setLoading(false);
      });
    return () => {
      aktif = false;
    };
  }, [periode, unit, status, kategori]);

  useEffect(() => {
    apiFetchUnitList().then(setUnitList).catch(() => setUnitList([]));
  }, []);

  const data = useMemo(() => (laporan?.data ?? []).map(mapBackendPengajuan), [laporan]);

  const kpi = [
    { label: "Total Pengajuan", nilai: String(laporan?.ringkasan.totalPengajuan ?? 0) },
    {
      label: "Pengajuan Disetujui",
      nilai: String(
        laporan?.ringkasan.pengajuanDisetujui ?? 0,
      ),
    },
    {
      label: "Pengajuan Ditolak",
      nilai: String(laporan?.ringkasan.pengajuanDitolak ?? 0),
    },
    {
      label: "Total Nilai Pengadaan",
      nilai: formatRupiah(laporan?.ringkasan.totalNilai ?? 0),
    },
  ];

  const perStatus = (laporan?.perStatus ?? []).map((item) => ({
    status: LABEL_STATUS[item.status as keyof typeof LABEL_STATUS] ?? item.status,
    ringkas: (LABEL_STATUS[item.status as keyof typeof LABEL_STATUS] ?? item.status).split(" ")[0],
    jumlah: item.jumlah,
  }));

  const perUnit = (laporan?.perUnit ?? []).map((item) => ({
    unit: item.unit,
    ringkas: item.unit.replace("Fakultas ", "F. "),
    jumlah: item.jumlah,
  }));

  const tooltipStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
  } as const;

  const namaFile = `laporan-pengadaan-${periode}`;

  const eksporExcel = async () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Rincian Laporan");
    sheet.views = [{ state: "frozen", ySplit: 5 }];
    sheet.mergeCells("A1:G1");
    sheet.getCell("A1").value = "LAPORAN PENGADAAN BARANG KAMPUS";
    sheet.getCell("A1").font = { bold: true, size: 16, color: { argb: "FFFFFFFF" } };
    sheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF173F5F" } };
    sheet.getCell("A1").alignment = { horizontal: "center" };
    sheet.mergeCells("A2:G2");
    sheet.getCell("A2").value = `Periode: ${periode} | Unit: ${unit} | Status: ${status} | Kategori: ${kategori}`;
    sheet.getCell("A2").font = { italic: true, color: { argb: "FF5B6770" } };
    sheet.mergeCells("A3:G3");
    sheet.getCell("A3").value = `Total pengajuan: ${data.length} | Total nilai: ${formatRupiah(laporan?.ringkasan.totalNilai ?? 0)}`;
    sheet.getCell("A3").font = { bold: true, color: { argb: "FF173F5F" } };
    sheet.addRow([]);
    const header = sheet.addRow(["Nomor", "Tanggal", "Unit", "Pengaju", "Barang", "Nilai", "Status"]);
    header.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF20639B" } };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });
    data.forEach((p) => {
      const row = sheet.addRow([p.nomor, p.tanggal, p.unit, p.pengaju, ringkasanBarang(p), totalNilai(p), LABEL_STATUS[p.status]]);
      row.getCell(6).numFmt = '"Rp" #,##0';
      if (row.number % 2 === 0) row.eachCell((cell) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF1F5F9" } }; });
    });
    sheet.columns = [
      { width: 18 }, { width: 14 }, { width: 28 }, { width: 24 }, { width: 30 }, { width: 18 }, { width: 24 },
    ];
    sheet.autoFilter = { from: "A5", to: `G${sheet.rowCount}` };
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${namaFile}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File Excel berhasil diunduh");
  };

  const eksporPdf = () => {
    if (data.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    pdf.setFillColor(23, 63, 95);
    pdf.rect(0, 0, 210, 30, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(17);
    pdf.text("Laporan Pengadaan Barang", 14, 15);
    pdf.setFontSize(9);
    pdf.text("Sistem Pengadaan Barang Kampus", 14, 22);
    pdf.setTextColor(40, 50, 60);
    pdf.setFontSize(9);
    pdf.text(`Periode: ${periode} | Unit: ${unit} | Status: ${status} | Kategori: ${kategori}`, 14, 39);
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(14, 45, 182, 18, 3, 3, "F");
    pdf.setFontSize(9);
    pdf.text(`Total Pengajuan: ${data.length}`, 20, 53);
    pdf.text(`Disetujui: ${laporan?.ringkasan.pengajuanDisetujui ?? 0}`, 75, 53);
    pdf.text(`Ditolak: ${laporan?.ringkasan.pengajuanDitolak ?? 0}`, 120, 53);
    pdf.text(`Nilai: ${formatRupiah(laporan?.ringkasan.totalNilai ?? 0)}`, 155, 53);
    autoTable(pdf, {
      startY: 70,
      head: [["Nomor", "Tanggal", "Unit", "Pengaju", "Barang", "Nilai", "Status"]],
      body: data.map((p) => [p.nomor, formatTanggal(p.tanggal), p.unit, p.pengaju, ringkasanBarang(p), formatRupiah(totalNilai(p)), LABEL_STATUS[p.status]]),
      theme: "grid",
      headStyles: { fillColor: [32, 99, 155], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: { fontSize: 7, cellPadding: 2, textColor: [40, 50, 60] },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 23 }, 2: { cellWidth: 30 }, 3: { cellWidth: 25 }, 4: { cellWidth: 28 }, 5: { cellWidth: 25 }, 6: { cellWidth: 26 } },
    });
    pdf.save(`${namaFile}.pdf`);
    toast.success("File PDF berhasil diunduh");
  };

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
              onClick={eksporExcel}
              disabled={loading}
            >
              <FileSpreadsheet className="size-4" aria-hidden /> Ekspor Excel
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={eksporPdf}
              disabled={loading}
            >
              <FileText className="size-4" aria-hidden /> Ekspor PDF
            </Button>
          </>
        }
      />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Tahun</Label>
            <Select value={periode} onValueChange={setPeriode}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pilihanTahun.map((tahun) => (
                  <SelectItem key={tahun} value={tahun}>
                    Tahun {tahun}
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
                {unitList.map((u) => (
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
            <p className="mt-2 text-lg font-semibold tracking-tight wrap-break-word sm:text-xl">
              {k.nilai}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <Panel judul="Pengajuan per Bulan">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={laporan?.perBulan ?? []}
                margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
              >
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
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`${v} pengajuan`, ""]}
                />
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
                  <Bar
                    dataKey="jumlah"
                    fill="var(--chart-1)"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        judul="Rincian Laporan"
        deskripsi={`${data.length} pengajuan pada tahun terpilih`}
        padat
      >
        {loading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Memuat laporan...</p>
        ) : error ? (
          <EmptyState judul="Gagal memuat laporan" deskripsi={error} />
        ) : data.length === 0 ? (
          <EmptyState
            judul="Data laporan kosong"
            deskripsi="Tidak ada pengajuan yang sesuai dengan filter laporan."
          />
        ) : (
          <>
            <div className="table-scroll hidden md:block">
              <table className="w-full min-w-216 text-sm">
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
