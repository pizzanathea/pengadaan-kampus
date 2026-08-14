import type { Pengajuan, StatusPengajuan, Prioritas } from "@/data/pengadaan";

export const API_BASE_URL = "http://localhost:5000";

export type BackendBarang = {
  nama: string;
  kategori: string;
  spesifikasi: string;
  jumlah: number;
  satuan: string;
  harga: number;
};

export type BackendPengajuan = {
  _id: string;
  nomorPengajuan: string;
  tanggalPengajuan: string;
  namaPengaju: string;
  unitFakultas: string;
  prioritas: string;
  tanggalDibutuhkan: string;
  daftarBarang: BackendBarang[];
  alasan: string;
  lampiran: string[];
  estimasiTotal: number;
  statusApproval: string;
  createdAt?: string;
};

export function mapBackendPengajuan(b: BackendPengajuan): Pengajuan {
  return {
    id: b._id,
    nomor: b.nomorPengajuan,
    tanggal: b.tanggalPengajuan,
    pengaju: b.namaPengaju,
    unit: b.unitFakultas,
    prioritas: b.prioritas as Prioritas,
    tanggalDibutuhkan: b.tanggalDibutuhkan,
    status: (b.statusApproval as StatusPengajuan) || "menunggu",
    alasan: b.alasan,
    lampiran: (b.lampiran || []).map((nama) => ({ nama, ukuran: "-" })),
    barang: b.daftarBarang,
  };
}

export async function apiFetchPengajuanList(): Promise<BackendPengajuan[]> {
  const res = await fetch(`${API_BASE_URL}/api/pengajuan`);
  if (!res.ok) throw new Error("Gagal mengambil data pengajuan dari server.");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Gagal mengambil data pengajuan.");
  return json.data as BackendPengajuan[];
}

export async function apiUpdateStatusPengajuan(
  id: string,
  statusApproval: string,
): Promise<BackendPengajuan> {
  const res = await fetch(`${API_BASE_URL}/api/pengajuan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statusApproval }),
  });
  if (!res.ok) throw new Error("Gagal memperbarui status pengajuan.");
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Gagal memperbarui status pengajuan.");
  return json.data as BackendPengajuan;
}