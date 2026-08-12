import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Printer, AlertCircle, Plus, Trash2, Save, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  AlasanDanLampiran,
  DaftarBarang,
  InformasiPengajuan,
  RiwayatPengajuan,
} from "@/components/pengajuan-detail";
import { getPengajuan } from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengajuan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Pengajuan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content:
          "Detail pengajuan barang kampus: informasi pengaju, daftar barang, alasan, lampiran, dan riwayat pengajuan.",
      },
      { property: "og:title", content: "Detail Pengajuan — Sistem Pengadaan Kampus" },
      {
        property: "og:description",
        content: "Rincian lengkap satu pengajuan barang beserta riwayat prosesnya.",
      },
    ],
  }),
  component: DetailPengajuanPage,
});

function DetailPengajuanPage() {
  const { id } = Route.useParams();
  const p = getPengajuan(id);

  // State editable untuk Daftar Barang (ditambahkan kategori & spesifikasi)
  const [barangList, setBarangList] = useState<any[]>(
    p?.barang || [
      { nama: "Laptop Core i7", kategori: "Elektronik", spesifikasi: "RAM 16GB, SSD 512GB", jumlah: 5, satuan: "Unit", perkiraanHarga: 12500000 },
      { nama: "Proyektor Epson", kategori: "Elektronik", spesifikasi: "Full HD 3400 Lumens", jumlah: 2, satuan: "Unit", perkiraanHarga: 6000000 },
    ]
  );
  const [isEditBarang, setIsEditBarang] = useState(false);

  // State editable untuk Alasan & Lampiran
  const [alasan, setAlasan] = useState(p?.alasan || "Keperluan peningkatan laboratorium.");
  const [isEditAlasan, setIsEditAlasan] = useState(false);

  const [lampiranList, setLampiranList] = useState<any[]>(
    p?.lampiran ? (Array.isArray(p.lampiran) ? p.lampiran : [p.lampiran]) : ["proposal-kegiatan.pdf", "rancangan-anggaran.xlsx"]
  );
  const [isEditLampiran, setIsEditLampiran] = useState(false);

  if (!p) {
    return (
      <Panel>
        <EmptyState
          judul="Pengajuan tidak ditemukan"
          deskripsi={`Pengajuan dengan nomor ${id} tidak tersedia.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/persetujuan">Kembali ke daftar pengajuan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  const isDitolak = p.status.toLowerCase().includes("tolak") || p.status.toLowerCase().includes("rejected");

  const handleSimpanPerubahan = () => {
    setIsEditBarang(false);
    setIsEditAlasan(false);
    setIsEditLampiran(false);
    toast.success("Perubahan pengajuan berhasil disimpan", {
      description: `Data untuk pengajuan ${p.nomor} telah diperbarui.`,
    });
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Pengajuan Barang", to: "/pengajuan" }, { label: p.nomor }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Pengajuan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{p.nomor}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Printer className="size-4" aria-hidden /> Cetak
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/pengajuan">
              <ArrowLeft className="size-4" aria-hidden /> Kembali
            </Link>
          </Button>
        </div>
      </div>

      <InformasiPengajuan p={p} />

      {/* Panel Daftar Barang dengan mode klik untuk ubah (termasuk Kategori & Spesifikasi) */}
      <Panel
        judul="Daftar Barang"
        deskripsi="Klik tombol edit untuk mengubah, menambah, atau menghapus daftar barang"
        aksi={
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setIsEditBarang(!isEditBarang)}
          >
            <Pencil className="size-3.5" /> {isEditBarang ? "Selesai Edit" : "Ubah Daftar Barang"}
          </Button>
        }
      >
        {isEditBarang ? (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-3 py-2 font-medium">Nama Barang</th>
                    <th className="px-3 py-2 font-medium">Kategori</th>
                    <th className="px-3 py-2 font-medium">Spesifikasi</th>
                    <th className="px-3 py-2 font-medium w-20">Jumlah</th>
                    <th className="px-3 py-2 font-medium w-24">Satuan</th>
                    <th className="px-3 py-2 font-medium w-36">Harga (Rp)</th>
                    <th className="px-3 py-2 font-medium w-16 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {barangList.map((item, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2">
                        <Input
                          value={item.nama || ""}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], nama: e.target.value };
                            setBarangList(updated);
                          }}
                          placeholder="Nama barang"
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={item.kategori || ""}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], kategori: e.target.value };
                            setBarangList(updated);
                          }}
                          placeholder="Kategori"
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={item.spesifikasi || ""}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], spesifikasi: e.target.value };
                            setBarangList(updated);
                          }}
                          placeholder="Spesifikasi"
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={item.jumlah ?? 1}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], jumlah: Number(e.target.value) };
                            setBarangList(updated);
                          }}
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          value={item.satuan || ""}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], satuan: e.target.value };
                            setBarangList(updated);
                          }}
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          type="number"
                          value={item.perkiraanHarga ?? 0}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], perkiraanHarga: Number(e.target.value) };
                            setBarangList(updated);
                          }}
                          className="h-9"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive size-9"
                          onClick={() => {
                            setBarangList(barangList.filter((_, i) => i !== index));
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setBarangList([...barangList, { nama: "", kategori: "", spesifikasi: "", jumlah: 1, satuan: "Unit", perkiraanHarga: 0 }]);
              }}
            >
              <Plus className="size-4" /> Tambah Barang
            </Button>
          </div>
        ) : (
          <DaftarBarang p={{ ...p, barang: barangList }} />
        )}
      </Panel>

      {/* Panel Alasan & Lampiran dengan tombol ubah terpisah */}
      <Panel
        judul="Alasan &amp; Lampiran"
        deskripsi="Tinjau alasan dan berkas lampiran pengadaan"
      >
        <div className="space-y-6">
          {/* Bagian Alasan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alasan Pengajuan</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setIsEditAlasan(!isEditAlasan)}
              >
                <Pencil className="size-3" /> {isEditAlasan ? "Tutup" : "Ubah Alasan"}
              </Button>
            </div>
            {isEditAlasan ? (
              <Textarea
                rows={3}
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
              />
            ) : (
              <p className="text-sm rounded-md bg-muted/40 p-3">{alasan}</p>
            )}
          </div>

          {/* Bagian Lampiran */}
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Berkas Lampiran</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={() => setIsEditLampiran(!isEditLampiran)}
              >
                <Pencil className="size-3" /> {isEditLampiran ? "Selesai" : "Kelola Lampiran"}
              </Button>
            </div>

            <div className="space-y-2">
              {lampiranList.map((file, idx) => {
                const fileName = typeof file === "object" && file !== null ? (file.nama || file.name || JSON.stringify(file)) : file;
                return (
                  <div key={idx} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm bg-muted/40">
                    <span className="truncate font-medium">{fileName}</span>
                    {isEditLampiran && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive h-8 px-2"
                        onClick={() => {
                          setLampiranList(lampiranList.filter((_, i) => i !== idx));
                        }}
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {isEditLampiran && (
              <div className="pt-2">
                <Input
                  type="file"
                  className="cursor-pointer text-xs"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setLampiranList([...lampiranList, e.target.files[0].name]);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Panel>

      <RiwayatPengajuan p={p} />

      {isDitolak && (
        <Panel judul="Alasan Penolakan" deskripsi="Keterangan mengapa pengajuan ini ditolak oleh reviewer">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
            <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
            <div className="space-y-1 text-sm">
              <p className="font-medium">Pengajuan tidak dapat disetujui</p>
              <p className="text-muted-foreground">
                {(p as any).alasanPenolakan || "Anggaran unit untuk periode ini sudah terpakai dan melewati batas maksimal pengajuan per semester."}
              </p>
            </div>
          </div>
        </Panel>
      )}

      <div className="flex justify-end pt-2">
        <Button onClick={handleSimpanPerubahan} className="gap-1.5">
          <Save className="size-4" aria-hidden /> Simpan Perubahan
        </Button>
      </div>
    </>
  );
}