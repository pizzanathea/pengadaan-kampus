import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Loader2 } from "lucide-react";

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
import { PrioritasBadge, StatusBadge } from "@/components/status-badge";
import {
  PRIORITAS_LIST,
  formatRupiah,
  formatTanggal,
  ringkasanBarang,
  totalNilai,
} from "@/data/pengadaan";
import { usePengajuanData } from "@/hooks/use-pengajuan";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/_shell/persetujuan/")({
  head: () => ({
    meta: [
      { title: "Persetujuan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content: "Daftar pengajuan barang yang membutuhkan persetujuan Anda.",
      },
    ],
  }),
  component: PersetujuanPage,
});

type Role = "persetujuan_1" | "persetujuan_2";

const ROLE_CONFIG: Record<
  Role,
  {
    judul: string;
    subtitle: string;
    deskripsiPanel: string;
    defaultStatus: string;
    statusScope: string[];
    statusOptions: { value: string; label: string }[];
    emptyJudul: string;
    emptyDeskripsi: string;
  }
> = {
  persetujuan_1: {
    judul: "Persetujuan",
    subtitle: "Pengajuan yang membutuhkan persetujuan Anda",
    deskripsiPanel: "Daftar Persetujuan",
    defaultStatus: "menunggu",
    statusScope: ["menunggu", "disetujui", "ditolak", "perlu_perbaikan"],
    statusOptions: [
      { value: "menunggu", label: "Menunggu Persetujuan" },
      { value: "perlu_perbaikan", label: "Perlu Perbaikan" },
      { value: "disetujui", label: "Disetujui" },
      { value: "ditolak", label: "Ditolak" },
      { value: "semua", label: "Semua" },
    ],
    emptyJudul: "Tidak ada pengajuan",
    emptyDeskripsi: "Belum ada pengajuan yang sesuai dengan filter yang dipilih.",
  },
  persetujuan_2: {
    judul: "Persetujuan Keuangan",
    subtitle: "Pengajuan yang sudah disetujui Persetujuan 1 dan menunggu persetujuan akhir Anda",
    deskripsiPanel: "Daftar Persetujuan Keuangan",
    defaultStatus: "menunggu_2",
    statusScope: ["menunggu_2", "disetujui", "ditolak", "perlu_perbaikan"],
    statusOptions: [
      { value: "menunggu_2", label: "Menunggu Persetujuan Keuangan" },
      { value: "perlu_perbaikan", label: "Perlu Perbaikan" },
      { value: "disetujui", label: "Disetujui" },
      { value: "ditolak", label: "Ditolak" },
      { value: "semua", label: "Semua" },
    ],
    emptyJudul: "Belum ada pengajuan",
    emptyDeskripsi:
      "Belum ada pengajuan yang lolos Persetujuan 1, atau tidak ada yang sesuai dengan filter yang dipilih.",
  },
};

function PersetujuanPage() {
  const { data: semuaPengajuan, loading, error } = usePengajuanData();
  const [unitList, setUnitList] = useState<string[]>([]);
  const [loadingUnit, setLoadingUnit] = useState(true);

  const [role, setRole] = useState<Role>("persetujuan_1");
  const config = ROLE_CONFIG[role];

  const [status, setStatus] = useState(config.defaultStatus);
  const [unit, setUnit] = useState("semua");
  const [prioritas, setPrioritas] = useState("semua");

  useEffect(() => {
    let aktif = true;
    fetch(`${API_BASE_URL}/api/unit`)
      .then((response) => response.json())
      .then((result) => {
        if (aktif && result.success && Array.isArray(result.data)) {
          setUnitList(result.data.filter((item: unknown): item is string => typeof item === "string"));
        }
      })
      .catch(() => {
        if (aktif) setUnitList([]);
      })
      .finally(() => {
        if (aktif) setLoadingUnit(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const handleRoleChange = (r: Role) => {
    setRole(r);
    setStatus(ROLE_CONFIG[r].defaultStatus);
  };

  const data = useMemo(
    () =>
      semuaPengajuan.filter(
        (p) =>
          config.statusScope.includes(p.status) &&
          (status === "semua" ? true : p.status === status) &&
              (unit === "semua" || p.unit === unit) &&
              (prioritas === "semua" || p.prioritas === prioritas),
      ),
            [semuaPengajuan, config, status, unit, prioritas],
  );

  return (
    <>
      <div className="mb-4 flex items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs">
        <span className="font-medium text-muted-foreground">Testing sebagai role:</span>
        <Select value={role} onValueChange={(v) => handleRoleChange(v as Role)}>
          <SelectTrigger className="h-8 w-55 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="persetujuan_1">Persetujuan 1</SelectItem>
            <SelectItem value="persetujuan_2">Persetujuan 2 (Keuangan)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PageHeader judul={config.judul} subtitle={config.subtitle} />

      <Panel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
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
                {loadingUnit ? (
                  <SelectItem value="memuat" disabled>Memuat unit...</SelectItem>
                ) : null}
                {unitList.map((u) => (
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua prioritas</SelectItem>
                {PRIORITAS_LIST.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Panel>

      <Panel judul={config.deskripsiPanel} deskripsi={`${data.length} pengajuan ditampilkan`} padat>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" aria-hidden /> Memuat data...
          </div>
        ) : error ? (
          <EmptyState judul="Gagal memuat data" deskripsi={error} />
        ) : data.length === 0 ? (
          <EmptyState judul={config.emptyJudul} deskripsi={config.emptyDeskripsi} />
        ) : (
          <>
            <div className="table-scroll hidden lg:block">
              <table className="w-full min-w-248 text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nomor</th>
                    <th className="px-5 py-3 font-medium">Pengaju</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Barang</th>
                    <th className="px-5 py-3 text-right font-medium">Nilai</th>
                    <th className="px-5 py-3 font-medium">Prioritas</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((p) => (
                    <tr
                      key={p.nomor}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-5 py-3 font-medium whitespace-nowrap">{p.nomor}</td>
                      <td className="px-5 py-3">{p.pengaju}</td>
                      <td className="px-5 py-3 text-muted-foreground">{p.unit}</td>
                      <td className="px-5 py-3">{ringkasanBarang(p)}</td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        {formatRupiah(totalNilai(p))}
                      </td>
                      <td className="px-5 py-3">
                        <PrioritasBadge prioritas={p.prioritas} />
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatTanggal(p.tanggal)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            to="/persetujuan/$id"
                            params={{ id: p.nomor }}
                            search={{ role }}
                          >
                            <Eye className="size-4" aria-hidden /> Tinjau
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border lg:hidden">
              {data.map((p) => (
                <li key={p.nomor} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.nomor}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {p.pengaju} · {p.unit}
                      </p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <PrioritasBadge prioritas={p.prioritas} />
                    <span>{formatTanggal(p.tanggal)}</span>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                    <dt className="text-muted-foreground">Barang</dt>
                    <dd className="truncate text-right">{ringkasanBarang(p)}</dd>
                    <dt className="text-muted-foreground">Nilai</dt>
                    <dd className="text-right font-medium">{formatRupiah(totalNilai(p))}</dd>
                  </dl>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link to="/persetujuan/$id" params={{ id: p.nomor }} search={{ role }}>
                      Tinjau Pengajuan
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Panel>
    </>
  );
}
