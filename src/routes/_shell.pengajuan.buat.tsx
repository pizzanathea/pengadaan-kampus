import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Panel, PageHeader, Breadcrumb } from "@/components/ui-kit";
import {
  UNIT_LIST,
  KATEGORI_LIST,
  SATUAN_LIST,
  PRIORITAS_LIST,
  formatRupiah,
} from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengajuan/buat")({
  head: () => ({
    meta: [
      { title: "Buat Pengajuan Barang — Sistem Pengadaan Kampus" },
      {
        name: "description",
        content: "Formulir pengajuan barang kampus.",
      },
    ],
  }),
  component: BuatPengajuanPage,
});

type Baris = {
  key: number;
  nama: string;
  kategori: string;
  spesifikasi: string;
  jumlah: number;
  satuan: string;
  harga: string;
};

const barisBaru = (key: number): Baris => ({
  key,
  nama: "",
  kategori: "Elektronik",
  spesifikasi: "",
  jumlah: 1,
  satuan: "Unit",
  harga: "",
});

function BuatPengajuanPage() {
  const navigate = useNavigate();
  const [baris, setBaris] = useState<Baris[]>([barisBaru(1)]);

  // State lampiran diubah menampung nama file yang diunggah
  // Ubah dari: const [berkas, setBerkas] = useState<string[]>([]);
  // Menjadi:
  const [berkas, setBerkas] = useState<any[]>([]);

  const [nomorUnik] = useState(
    `PB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
  );
  const [tanggalPengajuan, setTanggalPengajuan] = useState("");
  const [namaPengaju, setNamaPengaju] = useState("");
  const [unitFakultas, setUnitFakultas] = useState("");
  const [prioritas, setPrioritas] = useState("Sedang");
  const [tanggalDibutuhkan, setTanggalDibutuhkan] = useState("");
  const [alasan, setAlasan] = useState("");

  const ubah = (key: number, patch: Partial<Baris>) =>
    setBaris((prev) => prev.map((b) => (b.key === key ? { ...b, ...patch } : b)));

  const totalBarang = baris.length;
  const totalKuantitas = baris.reduce((s, b) => s + (Number(b.jumlah) || 0), 0);

  const estimasiTotal = baris.reduce((s, b) => {
    const hargaNum = Number(String(b.harga).replace(/[^0-9]/g, "")) || 0;
    return s + (Number(b.jumlah) || 0) * hargaNum;
  }, 0);

  return (
    <>
      <Breadcrumb
        items={[{ label: "Pengajuan Barang", to: "/pengajuan" }, { label: "Buat Pengajuan" }]}
      />

      <PageHeader
        judul="Buat Pengajuan Barang"
        subtitle="Lengkapi informasi pengajuan dan detail barang yang dibutuhkan"
        aksi={
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/pengajuan">
              <ArrowLeft className="size-4" aria-hidden /> Kembali
            </Link>
          </Button>
        }
      />

      <form
        className="space-y-6"
        onSubmit={async (e) => {
          e.preventDefault();

          const daftarBarangPayload = baris.map((b) => ({
            ...b,
            harga: Number(String(b.harga).replace(/[^0-9]/g, "")) || 0,
          }));

          // Gunakan FormData agar file fisik dapat terkirim ke backend
          const formData = new FormData();
          formData.append("nomorPengajuan", nomorUnik);
          formData.append("tanggalPengajuan", tanggalPengajuan);
          formData.append("namaPengaju", namaPengaju);
          formData.append("unitFakultas", unitFakultas);
          formData.append("prioritas", prioritas);
          formData.append("tanggalDibutuhkan", tanggalDibutuhkan);
          formData.append("daftarBarang", JSON.stringify(daftarBarangPayload));
          formData.append("alasan", alasan);

          // Masukkan file fisik asli dari state 'berkas' ke dalam formData
          berkas.forEach((file: any) => {
            formData.append("lampiran", file);
          });

          try {
            const response = await fetch("http://localhost:5000/api/pengajuan", {
              method: "POST",
              body: formData, // Tanpa headers Content-Type, biarkan browser mengaturnya
            });

            const responseText = await response.text();
            let result;

            try {
              result = JSON.parse(responseText);
            } catch (err) {
              throw new Error(responseText || "Gagal mengurai respons server");
            }

            if (result.success) {
              toast.success("Pengajuan berhasil diajukan", {
                description: "Pengajuan dan berkas lampiran berhasil disimpan.",
              });
              navigate({ to: "/pengajuan" });
            } else {
              toast.error("Gagal menyimpan: " + result.message);
            }
          } catch (error: any) {
            toast.error("Terjadi kesalahan: " + error.message);
          }
        }}
      >
        <Panel judul="Informasi Pengajuan">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nomor">Nomor Pengajuan</Label>
              <Input id="nomor" value={nomorUnik} readOnly className="bg-muted" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tglPengajuan">Tanggal Pengajuan</Label>
              <Input
                id="tglPengajuan"
                type="date"
                value={tanggalPengajuan}
                onChange={(e) => setTanggalPengajuan(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pengaju">Nama Pengaju</Label>
              <Input
                id="pengaju"
                value={namaPengaju}
                onChange={(e) => setNamaPengaju(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit / Fakultas</Label>
              <Select value={unitFakultas} onValueChange={setUnitFakultas}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih unit atau fakultas" />
                </SelectTrigger>
                <SelectContent>
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
                  <SelectValue placeholder="Pilih tingkat prioritas" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITAS_LIST.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tglButuh">Tanggal Dibutuhkan</Label>
              <Input
                id="tglButuh"
                type="date"
                value={tanggalDibutuhkan}
                onChange={(e) => setTanggalDibutuhkan(e.target.value)}
                required
              />
            </div>
          </div>
        </Panel>

        <Panel
          judul="Detail Barang"
          deskripsi="Tambahkan satu baris untuk setiap barang yang dibutuhkan"
          aksi={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBaris((prev) => [...prev, barisBaru(Date.now())])}
            >
              <Plus className="size-4" aria-hidden /> Tambah Barang
            </Button>
          }
        >
          <div className="space-y-4">
            {baris.map((b, i) => (
              <fieldset key={b.key} className="rounded-lg border border-border p-4">
                <legend className="px-1 text-xs font-medium text-muted-foreground">
                  Barang {i + 1}
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                  <div className="space-y-1.5 xl:col-span-2">
                    <Label htmlFor={`nama-${b.key}`}>Nama Barang</Label>
                    <Input
                      id={`nama-${b.key}`}
                      value={b.nama}
                      onChange={(e) => ubah(b.key, { nama: e.target.value })}
                      placeholder="Contoh: Laptop"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Kategori</Label>
                    <Select value={b.kategori} onValueChange={(v) => ubah(b.key, { kategori: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {KATEGORI_LIST.map((k) => (
                          <SelectItem key={k} value={k}>
                            {k}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 xl:col-span-3">
                    <Label htmlFor={`spek-${b.key}`}>Spesifikasi</Label>
                    <Input
                      id={`spek-${b.key}`}
                      value={b.spesifikasi}
                      onChange={(e) => ubah(b.key, { spesifikasi: e.target.value })}
                      placeholder="Contoh: Core i7, RAM 16GB"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`jml-${b.key}`}>Jumlah</Label>
                    <Input
                      id={`jml-${b.key}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={b.jumlah}
                      onChange={(e) => ubah(b.key, { jumlah: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Satuan</Label>
                    <Select value={b.satuan} onValueChange={(v) => ubah(b.key, { satuan: v })}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SATUAN_LIST.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`harga-${b.key}`}>Estimasi Harga</Label>
                    <Input
                      id={`harga-${b.key}`}
                      type="text"
                      placeholder="Contoh: 5000000"
                      value={b.harga}
                      onChange={(e) => ubah(b.key, { harga: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Total</Label>
                    <p className="flex h-9 items-center rounded-md bg-muted px-3 text-sm font-medium break-all">
                      {formatRupiah(
                        (Number(b.jumlah) || 0) *
                          (Number(String(b.harga).replace(/[^0-9]/g, "")) || 0),
                      )}
                    </p>
                  </div>
                  <div className="flex items-end xl:col-span-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={baris.length === 1}
                      onClick={() => setBaris((prev) => prev.filter((x) => x.key !== b.key))}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden /> Hapus barang
                    </Button>
                  </div>
                </div>
              </fieldset>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
          <div className="space-y-4 sm:space-y-6 xl:col-span-2">
            <Panel judul="Alasan Pengajuan">
              <div className="space-y-1.5">
                <Label htmlFor="alasan">Alasan / justifikasi kebutuhan</Label>
                <Textarea
                  id="alasan"
                  rows={5}
                  value={alasan}
                  onChange={(e) => setAlasan(e.target.value)}
                  required
                  placeholder="Jelaskan kebutuhan barang beserta manfaatnya bagi unit Anda"
                />
              </div>
            </Panel>

            <Panel
              judul="Lampiran"
              deskripsi="Format PDF, Excel, atau gambar. Maksimal 5 MB per file."
            >
              <label
                htmlFor="lampiran"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-8 text-center hover:bg-muted/50"
              >
                <Upload className="size-5 text-muted-foreground" aria-hidden />
                <span className="text-sm font-medium">Pilih dokumen untuk diunggah</span>
                <span className="text-xs text-muted-foreground">
                  atau tarik dan lepas file ke area ini
                </span>
                <input
                  id="lampiran"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    // Simpan objek File mentah ke state 'berkas'
                    const uploadedFiles = Array.from(e.target.files ?? []);
                    setBerkas((prev) => [...prev, ...uploadedFiles]);
                  }}
                />
              </label>
              {berkas.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {berkas.map((file: any, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm"
                    >
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setBerkas((prev) => prev.filter((_, i) => i !== index))}
                        className="shrink-0 text-xs font-medium text-destructive hover:underline"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Panel>
          </div>

          <Panel judul="Ringkasan">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Total Barang</dt>
                <dd className="font-medium">{totalBarang}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-muted-foreground">Total Kuantitas</dt>
                <dd className="font-medium">{totalKuantitas}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <dt className="text-muted-foreground">Estimasi Total</dt>
                <dd className="text-right text-base font-semibold break-all">
                  {formatRupiah(estimasiTotal)}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row xl:flex-col">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => toast.success("Pengajuan disimpan sebagai draf")}
              >
                Simpan sebagai Draf
              </Button>
              <Button type="submit" className="w-full">
                Ajukan Pengadaan
              </Button>
            </div>
          </Panel>
        </div>
      </form>
    </>
  );
}
