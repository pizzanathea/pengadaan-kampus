import type { Pengajuan, StatusPengajuan, Prioritas } from "@/data/pengadaan";

export const API_BASE_URL = "http://localhost:5000";

export async function apiFetchUnitList(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/api/unit`);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success || !Array.isArray(json.data)) {
    throw new Error(json?.message || "Gagal mengambil daftar unit.");
  }
  return json.data.filter((unit: unknown): unit is string => typeof unit === "string");
}

export function getLampiranUrl(nama: string) {
  return `${API_BASE_URL}/uploads/${encodeURIComponent(nama)}`;
}

export function getLampiranDownloadUrl(nama: string) {
  return `${API_BASE_URL}/api/pengajuan/lampiran/download/${encodeURIComponent(nama)}`;
}

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
  alasanPenolakan?: string;
  catatanPerbaikan?: string;
  kembaliKe?: string;
  createdAt?: string;
};

export function mapBackendPengajuan(b: BackendPengajuan): Pengajuan {
  const kembaliKe =
    b.kembaliKe === "menunggu" || b.kembaliKe === "menunggu_2" ? b.kembaliKe : undefined;

  return {
    id: b._id,
    nomor: b.nomorPengajuan,
    tanggal: b.tanggalPengajuan,
    pengaju: b.namaPengaju,
    unit: b.unitFakultas,
    prioritas: b.prioritas as Prioritas,
    tanggalDibutuhkan: b.tanggalDibutuhkan,
    status: (b.statusApproval as StatusPengajuan) || "menunggu",
    ...(kembaliKe ? { kembaliKe } : {}),
    alasan: b.alasan,
    ...(b.alasanPenolakan ? { alasanPenolakan: b.alasanPenolakan } : {}),
    ...(b.catatanPerbaikan ? { catatanPerbaikan: b.catatanPerbaikan } : {}),
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

/** Update pengajuan dengan field apa aja (status, alasan, catatan, dll). */
export async function apiUpdatePengajuan(
  id: string,
  patch: Record<string, unknown>,
): Promise<BackendPengajuan> {
  const res = await fetch(`${API_BASE_URL}/api/pengajuan/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(json?.message || "Gagal memperbarui pengajuan.");
  }
  if (!json.success) throw new Error(json.message || "Gagal memperbarui pengajuan.");
  return json.data as BackendPengajuan;
}

/** Alias lama, cuma update status doang — tetep ada buat jaga-jaga kalau ada yang masih makai. */
export function apiUpdateStatusPengajuan(id: string, statusApproval: string) {
  return apiUpdatePengajuan(id, { statusApproval });
}

export type LaporanResponse = {
  data: BackendPengajuan[];
  ringkasan: {
    totalPengajuan: number;
    pengajuanDisetujui: number;
    pengajuanDitolak: number;
    totalNilai: number;
  };
  perStatus: { status: string; jumlah: number }[];
  perUnit: { unit: string; jumlah: number }[];
  perBulan: { bulan: string; jumlah: number }[];
};

export async function apiFetchLaporan(params: {
  periode: string;
  unit: string;
  status: string;
  kategori: string;
}): Promise<LaporanResponse> {
  const query = new URLSearchParams(params);
  const res = await fetch(`${API_BASE_URL}/api/pengajuan/laporan?${query}`);
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Gagal mengambil laporan pengadaan.");
  }
  return json as LaporanResponse;
}