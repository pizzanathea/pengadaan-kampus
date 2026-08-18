import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Printer,
  AlertCircle,
  Plus,
  Trash2,
  Save,
  Pencil,
  Eye,
  Upload,
} from "lucide-react";
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

export const Route = createFileRoute("/_shell/pengajuan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Pengajuan — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content: "Detail pengajuan barang kampus dari database.",
      },
    ],
  }),
  component: DetailPengajuanPage,
});

function DetailPengajuanPage() {
  const { id } = Route.useParams();

  const [p, setP] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [barangList, setBarangList] = useState<any[]>([]);
  const [isEditBarang, setIsEditBarang] = useState(false);

  const [alasan, setAlasan] = useState("");
  const [isEditAlasan, setIsEditAlasan] = useState(false);

  const [lampiranList, setLampiranList] = useState<any[]>([]);
  const [isEditLampiran, setIsEditLampiran] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/pengajuan`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const found = result.data.find(
            (item: any) => item.nomorPengajuan === id || item._id === id,
          );
          if (found) {
            setP(found);
            setBarangList(found.daftarBarang || []);
            setAlasan(found.alasan || "");
            setLampiranList(found.lampiran || []);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Panel>
        <p className="p-6 text-center text-sm text-muted-foreground">Memuat detail pengajuan...</p>
      </Panel>
    );
  }

  if (!p) {
    return (
      <Panel>
        <EmptyState
          judul="Pengajuan tidak ditemukan"
          deskripsi={`Pengajuan dengan nomor ${id} tidak tersedia di database.`}
          aksi={
            <Button asChild variant="outline">
              <Link to="/pengajuan">Kembali ke daftar pengajuan</Link>
            </Button>
          }
        />
      </Panel>
    );
  }

  const mappedData = {
    ...p,
    nomor: p.nomorPengajuan || id,
    status: p.statusApproval || "Menunggu Review",
    unit: p.unitFakultas || "-",
    pengaju: p.namaPengaju || "-",
    tanggal: p.tanggalPengajuan || "",
    barang: barangList,
    lampiran: lampiranList,
  };

  const statusStr = p.statusApproval || "";
  const isDitolak =
    statusStr.toLowerCase().includes("tolak") || statusStr.toLowerCase().includes("rejected");

  // Fungsi saat menyimpan perubahan / kelola lampiran di halaman detail ($id.tsx)
  const handleSimpanPerubahan = async () => {
    const formData = new FormData();
    formData.append("alasan", alasan);

    // Menggunakan 'barangList' yang sesuai dengan state halaman ini
    formData.append("daftarBarang", JSON.stringify(barangList));

    // Memproses lampiran: file fisik baru atau nama file string lama
    lampiranList.forEach((file: any) => {
      if (file instanceof File) {
        formData.append("lampiran", file);
      } else {
        const namaFileLama = typeof file === "string" ? file : (file.nama || file.name);
        formData.append("lampiranLama", namaFileLama);
      }
    });

    try {
      const response = await fetch(`http://localhost:5000/api/pengajuan/${p._id || id}`, {
        method: "PUT",
        body: formData, // Tanpa headers Content-Type agar FormData terbaca dengan benar
      });

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (err) {
        throw new Error(responseText || "Gagal mengurai respons server");
      }

      if (result.success) {
        toast.success("Perubahan berhasil disimpan!");
        setIsEditAlasan(false);
        setIsEditLampiran(false);
        setIsEditBarang(false);
      } else {
        toast.error("Gagal: " + result.message);
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan: " + error.message);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Pengajuan Barang", to: "/pengajuan" }, { label: mappedData.nomor }]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Pengajuan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{mappedData.nomor}</span>
            <StatusBadge status={mappedData.status} />
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

      <InformasiPengajuan p={mappedData} />

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
                          value={item.harga ?? item.perkiraanHarga ?? 0}
                          onChange={(e) => {
                            const updated = [...barangList];
                            updated[index] = { ...updated[index], harga: Number(e.target.value) };
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
                setBarangList([
                  ...barangList,
                  { nama: "", kategori: "", spesifikasi: "", jumlah: 1, satuan: "Unit", harga: 0 },
                ]);
              }}
            >
              <Plus className="size-4" /> Tambah Barang
            </Button>
          </div>
        ) : (
          <DaftarBarang p={mappedData} />
        )}
      </Panel>

      <Panel judul="Alasan &amp; Lampiran" deskripsi="Tinjau alasan dan berkas lampiran pengadaan">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Alasan Pengajuan
              </span>
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
              <Textarea rows={3} value={alasan} onChange={(e) => setAlasan(e.target.value)} />
            ) : (
              <p className="text-sm rounded-md bg-muted/40 p-3">{alasan}</p>
            )}
          </div>

          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Berkas Lampiran
              </span>
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
              {lampiranList.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Belum ada berkas lampiran yang diunggah.
                </p>
              ) : (
                lampiranList.map((file, idx) => {

                  const fileName = typeof file === "object" && file !== null ? (file.nama || file.name || file.toString()) : file;


                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm bg-muted/40"
                    >
                      <span className="truncate font-medium">{fileName}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-muted-foreground hover:text-foreground"
                          title="Lihat / Pratinjau Lampiran"
                          onClick={() => {
                            // Jika berupa File objek baru di memori, buat object URL, jika dari server gunakan path uploads
                            if (file instanceof File) {
                              const objectUrl = URL.createObjectURL(file);
                              window.open(objectUrl, "_blank");
                            } else {
                              const fileUrl = `http://localhost:5000/uploads/${fileName}`;
                              toast.success(`Membuka berkas: ${fileName}`);
                              window.open(fileUrl, "_blank");
                            }
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>

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
                    </div>
                  );
                })
              )}
            </div>

            {isEditLampiran && (
              <div className="pt-2">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border p-4 text-center hover:bg-muted/50">
                  <Upload className="size-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Tambah file lampiran baru</span>
                  <input
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={(e) => {
                      // Menyimpan objek File mentah agar terbaca sebagai instance File saat disimpan
                      const newFiles = Array.from(e.target.files ?? []);
                      setLampiranList((prev) => [...prev, ...newFiles]);
                      toast.success("File berhasil ditambahkan");
                    }}
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </Panel>

      <RiwayatPengajuan p={mappedData} />

      {isDitolak && (
        <Panel judul="Alasan Penolakan" deskripsi="Keterangan mengapa pengajuan ini ditolak">
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive">
            <AlertCircle className="size-5 shrink-0 mt-0.5" aria-hidden />
            <div className="space-y-1 text-sm">
              <p className="font-medium">Pengajuan tidak dapat disetujui</p>
              <p className="text-muted-foreground">
                {p.catatanAdmin || "Anggaran unit untuk periode ini sudah terpakai."}
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
