import type { Pengajuan } from "@/data/pengadaan";
import { formatRupiah, formatTanggal, totalNilai } from "@/data/pengadaan";
import { Panel } from "@/components/ui-kit";
import { StatusBadge, PrioritasBadge } from "@/components/status-badge";
import { Timeline, type LangkahTimeline } from "@/components/timeline";
import { FileText } from "lucide-react";

export function InformasiPengajuan({ p }: { p: Pengajuan }) {
  const items = [
    { label: "Pengaju", nilai: p.pengaju },
    { label: "Unit", nilai: p.unit },
    { label: "Tanggal Pengajuan", nilai: formatTanggal(p.tanggal) },
    { label: "Prioritas", nilai: <PrioritasBadge prioritas={p.prioritas} /> },
    { label: "Tanggal Dibutuhkan", nilai: formatTanggal(p.tanggalDibutuhkan) },
    { label: "Estimasi Total", nilai: formatRupiah(totalNilai(p)) },
  ];

  return (
    <Panel judul="Informasi Pengajuan">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((i) => (
          <div key={i.label} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{i.label}</dt>
            <dd className="mt-1 text-sm font-medium wrap-break-word">{i.nilai}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

export function DaftarBarang({ p }: { p: Pengajuan }) {
  return (
    <Panel judul="Daftar Barang" deskripsi={`${p.barang.length} jenis barang diajukan`} padat>
      <div className="table-scroll hidden md:block">
        <table className="w-full min-w-184 text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3 font-medium">Nama Barang</th>
              <th className="px-5 py-3 font-medium">Kategori</th>
              <th className="px-5 py-3 font-medium">Spesifikasi</th>
              <th className="px-5 py-3 text-right font-medium">Jumlah</th>
              <th className="px-5 py-3 font-medium">Satuan</th>
              <th className="px-5 py-3 text-right font-medium">Estimasi Harga</th>
              <th className="px-5 py-3 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {p.barang.map((b) => (
              <tr key={b.nama + b.spesifikasi} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{b.nama}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.kategori}</td>
                <td className="px-5 py-3 text-muted-foreground">{b.spesifikasi}</td>
                <td className="px-5 py-3 text-right">{b.jumlah}</td>
                <td className="px-5 py-3">{b.satuan}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap">{formatRupiah(b.harga)}</td>
                <td className="px-5 py-3 text-right whitespace-nowrap font-medium">
                  {formatRupiah(b.harga * b.jumlah)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/60">
              <td className="px-5 py-3 font-medium" colSpan={6}>
                Estimasi Total
              </td>
              <td className="px-5 py-3 text-right font-semibold whitespace-nowrap">
                {formatRupiah(totalNilai(p))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {p.barang.map((b) => (
          <li key={b.nama + b.spesifikasi} className="space-y-2 p-4">
            <p className="text-sm font-medium">{b.nama}</p>
            <p className="text-xs text-muted-foreground wrap-break-word">
              {b.kategori} · {b.spesifikasi}
            </p>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Jumlah</dt>
              <dd className="text-right">
                {b.jumlah} {b.satuan}
              </dd>
              <dt className="text-muted-foreground">Estimasi Harga</dt>
              <dd className="text-right">{formatRupiah(b.harga)}</dd>
              <dt className="text-muted-foreground">Total</dt>
              <dd className="text-right font-medium">{formatRupiah(b.harga * b.jumlah)}</dd>
            </dl>
          </li>
        ))}
        <li className="flex items-center justify-between gap-3 bg-muted/60 p-4 text-sm">
          <span className="font-medium">Estimasi Total</span>
          <span className="font-semibold break-all">{formatRupiah(totalNilai(p))}</span>
        </li>
      </ul>
    </Panel>
  );
}

export function AlasanDanLampiran({ p }: { p: Pengajuan }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
      <Panel judul="Alasan Pengajuan">
        <p className="text-sm leading-relaxed text-muted-foreground wrap-break-word">{p.alasan}</p>
      </Panel>
      <Panel judul="Lampiran">
        {p.lampiran.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada lampiran pada pengajuan ini.</p>
        ) : (
          <ul className="space-y-2">
            {p.lampiran.map((l) => (
              <li
                key={l.nama}
                className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
              >
                <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <span className="min-w-0 flex-1 truncate text-sm">{l.nama}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{l.ukuran}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export function CatatanKeputusan({ p }: { p: Pengajuan }) {
  if (!p.alasanPenolakan && !p.catatanPerbaikan) return null;

  return (
    <Panel judul="Alasan Keputusan">
      <div className="space-y-4 text-sm">
        {p.alasanPenolakan ? (
          <div>
            <p className="font-medium text-destructive">Alasan Penolakan</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {p.alasanPenolakan}
            </p>
          </div>
        ) : null}
        {p.catatanPerbaikan ? (
          <div>
            <p className="font-medium text-amber-700 dark:text-amber-400">Catatan Perbaikan</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed text-muted-foreground">
              {p.catatanPerbaikan}
            </p>
          </div>
        ) : null}
      </div>
    </Panel>
  );
}

export function riwayatPengajuan(p: Pengajuan): LangkahTimeline[] {
  const dibuat = formatTanggal(p.tanggal);

  const ditolak = p.status === "ditolak";
  // Lolos tahap 1 kalau statusnya udah lewat dari "menunggu" — baik lagi nunggu
  // Keuangan, udah disetujui final, lagi diproses, atau udah selesai.
  const lolosTahap1 = ["menunggu_2", "disetujui", "diproses", "selesai"].includes(p.status);
  // Disetujui final artinya udah lolos tahap 2 (Keuangan).
  const disetujuiFinal = ["disetujui", "diproses", "selesai"].includes(p.status);
  const diproses = ["diproses", "selesai"].includes(p.status);
  const selesaiSemua = p.status === "selesai";

  return [
    { judul: "Pengajuan dibuat", oleh: p.pengaju, waktu: `${dibuat} — 08:30`, status: "selesai" },
    { judul: "Pengajuan diajukan", oleh: p.pengaju, waktu: `${dibuat} — 08:45`, status: "selesai" },
    {
      judul: lolosTahap1
        ? "Disetujui Persetujuan 1"
        : ditolak
          ? "Pengajuan ditolak"
          : "Menunggu Persetujuan 1",
      oleh: "Persetujuan 1",
      status: lolosTahap1 || ditolak ? "selesai" : "aktif",
    },
    {
      judul: disetujuiFinal
        ? "Disetujui Persetujuan Keuangan"
        : ditolak
          ? "Tidak diteruskan ke Keuangan"
          : "Menunggu Persetujuan Keuangan",
      oleh: "Persetujuan 2 (Keuangan)",
      status: disetujuiFinal ? "selesai" : lolosTahap1 && !ditolak ? "aktif" : "menunggu",
    },
    {
      judul: "Proses pengadaan",
      oleh: "Admin Pengadaan",
      status: diproses ? (selesaiSemua ? "selesai" : "aktif") : "menunggu",
    },
    { judul: "Selesai", status: selesaiSemua ? "selesai" : "menunggu" },
  ];
}

export function RiwayatPengajuan({ p }: { p: Pengajuan }) {
  return (
    <Panel judul="Riwayat Pengajuan">
      <Timeline langkah={riwayatPengajuan(p)} />
    </Panel>
  );
}

export function StatusRingkas({ p }: { p: Pengajuan }) {
  return <StatusBadge status={p.status} />;
}
