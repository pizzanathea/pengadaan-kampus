import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumb, EmptyState, Panel } from "@/components/ui-kit";
import { StatusBadge } from "@/components/status-badge";
import {
  AlasanDanLampiran,
  CatatanKeputusan,
  DaftarBarang,
  InformasiPengajuan,
  RiwayatPengajuan,
} from "@/components/pengajuan-detail";
import { KATEGORI_LIST, PRIORITAS_LIST, SATUAN_LIST, UNIT_LIST, formatRupiah } from "@/data/pengadaan";
import { usePengajuanData } from "@/hooks/use-pengajuan";
import { apiUpdatePengajuan } from "@/lib/api";

type BarisEdit = {
  key: number;
  nama: string;
  kategori: string;
  spesifikasi: string;
  jumlah: number;
  satuan: string;
  harga: number;
};

const barisKosong = (): BarisEdit => ({
  key: Date.now(),
  nama: "",
  kategori: KATEGORI_LIST[0] || "Elektronik",
  spesifikasi: "",
  jumlah: 1,
  satuan: SATUAN_LIST[0] || "Unit",
  harga: 0,
});

export const Route = createFileRoute("/_shell/pengajuan/$id")({
  head: () => ({
    meta: [
      { title: "Detail Pengajuan — Sistem Pengadaan Barang Kampus" },
      { name: "description", content: "Lihat dan perbaiki pengajuan barang." },
    ],
  }),
  component: DetailPengajuanPage,
});

function DetailPengajuanPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: semuaPengajuan, loading, error } = usePengajuanData();
  const p = semuaPengajuan.find((item) => item.nomor === id || item.id === id);

  const [mengedit, setMengedit] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);
  const [namaPengaju, setNamaPengaju] = useState("");
  const [unitFakultas, setUnitFakultas] = useState("");
  const [prioritas, setPrioritas] = useState("");
  const [tanggalDibutuhkan, setTanggalDibutuhkan] = useState("");
  const [alasan, setAlasan] = useState("");
  const [baris, setBaris] = useState<BarisEdit[]>([]);

  useEffect(() => {
    if (!p) return;
    setNamaPengaju(p.pengaju);
    setUnitFakultas(p.unit);
    setPrioritas(p.prioritas);
    setTanggalDibutuhkan(p.tanggalDibutuhkan);
    setAlasan(p.alasan);
    setBaris(
      p.barang.length > 0
        ? p.barang.map((barang, index) => ({ ...barang, key: index + 1 }))
        : [barisKosong()],
    );
  }, [p]);

  const batalkanEdit = () => {
    setMengedit(false);
    if (!p) return;
    setNamaPengaju(p.pengaju);
    setUnitFakultas(p.unit);
    setPrioritas(p.prioritas);
    setTanggalDibutuhkan(p.tanggalDibutuhkan);
    setAlasan(p.alasan);
    setBaris(p.barang.map((barang, index) => ({ ...barang, key: index + 1 })));
  };

  const ubahBaris = (key: number, patch: Partial<BarisEdit>) => {
    setBaris((sebelumnya) =>
      sebelumnya.map((item) => (item.key === key ? { ...item, ...patch } : item)),
    );
  };

  const simpanPerbaikan = async () => {
    if (!p) return;
    if (
      !namaPengaju.trim() ||
      !unitFakultas ||
      !prioritas ||
      !tanggalDibutuhkan ||
      !alasan.trim() ||
      baris.length === 0 ||
      baris.some((item) => !item.nama.trim() || item.jumlah < 1)
    ) {
      toast.error("Lengkapi semua data pengajuan dan daftar barang terlebih dahulu.");
      return;
    }

    setMenyimpan(true);
    try {
      await apiUpdatePengajuan(p.id, {
        namaPengaju,
        unitFakultas,
        prioritas,
        tanggalDibutuhkan,
        alasan,
        daftarBarang: baris,
        statusApproval: p.kembaliKe || "menunggu",
      });
      toast.success("Perbaikan berhasil dikirim ulang", {
        description: "Pengajuan diteruskan ke tahap persetujuan yang sesuai.",
      });
      navigate({ to: "/pengajuan" });
    } catch (e) {
      toast.error("Gagal menyimpan dan mengirim ulang", {
        description: e instanceof Error ? e.message : "Terjadi kesalahan koneksi ke server.",
      });
    } finally {
      setMenyimpan(false);
    }
  };

  if (loading) {
    return (
      <Panel>
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Memuat data...
        </div>
      </Panel>
    );
  }

  if (error) {
    return <Panel><EmptyState judul="Gagal memuat data" deskripsi={error} /></Panel>;
  }

  if (!p) {
    return (
      <Panel>
        <EmptyState
          judul="Pengajuan tidak ditemukan"
          deskripsi={`Pengajuan dengan nomor ${id} tidak tersedia.`}
          aksi={<Button asChild variant="outline"><Link to="/pengajuan">Kembali ke daftar pengajuan</Link></Button>}
        />
      </Panel>
    );
  }

  return (
    <>
      <Breadcrumb items={[{ label: "Pengajuan", to: "/pengajuan" }, { label: p.nomor }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Detail Pengajuan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{p.nomor}</span>
            <StatusBadge status={p.status} />
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          {p.status === "perlu_perbaikan" && !mengedit ? (
            <Button onClick={() => setMengedit(true)} className="w-full sm:w-auto">
              <Pencil className="size-4" aria-hidden /> Edit Pengajuan
            </Button>
          ) : null}
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link to="/pengajuan"><ArrowLeft className="size-4" aria-hidden /> Kembali</Link>
          </Button>
        </div>
      </div>

      {mengedit ? (
        <div className="space-y-4">
          <Panel judul="Edit Informasi Pengajuan">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label>Nama Pengaju</Label><Input value={namaPengaju} onChange={(e) => setNamaPengaju(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Unit / Fakultas</Label><Select value={unitFakultas} onValueChange={setUnitFakultas}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{UNIT_LIST.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Prioritas</Label><Select value={prioritas} onValueChange={setPrioritas}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{PRIORITAS_LIST.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Tanggal Dibutuhkan</Label><Input type="date" value={tanggalDibutuhkan} onChange={(e) => setTanggalDibutuhkan(e.target.value)} /></div>
            </div>
          </Panel>

          <Panel judul="Edit Daftar Barang" aksi={<Button type="button" variant="outline" size="sm" onClick={() => setBaris((sebelumnya) => [...sebelumnya, barisKosong()])}><Plus className="size-4" aria-hidden /> Tambah Barang</Button>}>
            <div className="space-y-3">
              {baris.map((item, index) => (
                <fieldset key={item.key} className="rounded-md border border-border p-3">
                  <legend className="px-1 text-xs font-medium text-muted-foreground">Barang {index + 1}</legend>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    <div className="space-y-1.5 xl:col-span-2"><Label>Nama Barang</Label><Input value={item.nama} onChange={(e) => ubahBaris(item.key, { nama: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Kategori</Label><Select value={item.kategori} onValueChange={(value) => ubahBaris(item.key, { kategori: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{KATEGORI_LIST.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1.5 xl:col-span-3"><Label>Spesifikasi</Label><Input value={item.spesifikasi} onChange={(e) => ubahBaris(item.key, { spesifikasi: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Jumlah</Label><Input type="number" min={1} value={item.jumlah} onChange={(e) => ubahBaris(item.key, { jumlah: Number(e.target.value) })} /></div>
                    <div className="space-y-1.5"><Label>Satuan</Label><Select value={item.satuan} onValueChange={(value) => ubahBaris(item.key, { satuan: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SATUAN_LIST.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
                    <div className="space-y-1.5"><Label>Harga</Label><Input type="number" min={0} value={item.harga} onChange={(e) => ubahBaris(item.key, { harga: Number(e.target.value) })} /></div>
                    <div className="flex items-end justify-between gap-3 xl:col-span-3"><span className="text-sm font-medium">{formatRupiah(item.jumlah * item.harga)}</span><Button type="button" variant="ghost" size="sm" disabled={baris.length === 1} onClick={() => setBaris((sebelumnya) => sebelumnya.filter((lain) => lain.key !== item.key))} className="text-destructive hover:text-destructive"><Trash2 className="size-4" aria-hidden /> Hapus</Button></div>
                  </div>
                </fieldset>
              ))}
            </div>
          </Panel>

          <Panel judul="Edit Alasan Pengajuan"><Textarea rows={5} value={alasan} onChange={(e) => setAlasan(e.target.value)} /></Panel>
          <div className="flex flex-col justify-end gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={batalkanEdit} disabled={menyimpan}><X className="size-4" aria-hidden /> Batal</Button>
            <Button type="button" onClick={simpanPerbaikan} disabled={menyimpan}><Save className="size-4" aria-hidden /> {menyimpan ? "Menyimpan..." : "Simpan & Kirim Ulang"}</Button>
          </div>
        </div>
      ) : (
        <>
          <InformasiPengajuan p={p} />
          <DaftarBarang p={p} />
          <AlasanDanLampiran p={p} />
          <CatatanKeputusan p={p} />
          <RiwayatPengajuan p={p} />
        </>
      )}
    </>
  );
}
