import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader, Panel } from "@/components/ui-kit";
import { PENGGUNA, ROLE_LIST, UNIT_LIST as INITIAL_UNIT_LIST } from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Atur profil kampus, profil pengguna, pengguna & role, penomoran dokumen, serta preferensi notifikasi sistem pengadaan.",
      },
      { property: "og:title", content: "Pengaturan — Sistem Pengadaan Barang Kampus" },
      { property: "og:description", content: "Kelola konfigurasi sistem pengadaan kampus." },
    ],
  }),
  component: PengaturanPage,
});

function PengaturanPage() {
  const [tambahTerbuka, setTambahTerbuka] = useState(false);
  
  // State untuk manajemen Unit
  const [unitList, setUnitList] = useState<string[]>(INITIAL_UNIT_LIST);
  const [tambahUnitTerbuka, setTambahUnitTerbuka] = useState(false);
  const [namaUnitBaru, setNamaUnitBaru] = useState("");

  const handleTambahUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaUnitBaru.trim()) return;
    if (unitList.includes(namaUnitBaru.trim())) {
      toast.error("Unit sudah terdaftar");
      return;
    }
    setUnitList([...unitList, namaUnitBaru.trim().toString()]);
    setNamaUnitBaru("");
    setTambahUnitTerbuka(false);
    toast.success("Unit berhasil ditambahkan");
  };

  const handleHapusUnit = (unitTarget: string) => {
    setUnitList(unitList.filter((u) => u !== unitTarget));
    toast.success(`Unit ${unitTarget} berhasil dihapus`);
  };

  return (
    <>
      <PageHeader
        judul="Pengaturan"
        subtitle="Kelola profil kampus, pengguna, unit, dan preferensi sistem"
      />

      <Tabs defaultValue="saya" className="min-w-0">
        <div className="table-scroll pb-1">
          <TabsList className="w-max">
            <TabsTrigger value="saya">Profil Saya</TabsTrigger>
            <TabsTrigger value="pengguna">Pengguna &amp; Role</TabsTrigger>
            <TabsTrigger value="unit">Manajemen Unit</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="saya" className="mt-4 space-y-4 sm:space-y-6">
          <Panel judul="Profil Saya">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Profil berhasil diperbarui");
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid size-16 shrink-0 place-items-center rounded-full bg-primary-soft text-lg font-semibold text-secondary-foreground">
                  BS
                </span>
                <div className="min-w-0 space-y-1.5">
                  <Label htmlFor="foto">Foto Profil</Label>
                  <Input id="foto" type="file" accept="image/*" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="namaSaya">Nama</Label>
                  <Input id="namaSaya" defaultValue="Budi Santoso" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emailSaya">Email</Label>
                  <Input
                    id="emailSaya"
                    type="email"
                    defaultValue="budi.santoso@kampus.ac.id"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Simpan
                </Button>
              </div>
            </form>
          </Panel>

          <Panel judul="Ubah Kata Sandi">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Kata sandi berhasil diubah");
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lama">Kata Sandi Lama</Label>
                  <Input id="lama" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="baru">Kata Sandi Baru</Label>
                  <Input id="baru" type="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="konfirmasi">Konfirmasi Kata Sandi</Label>
                  <Input id="konfirmasi" type="password" />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Ubah Kata Sandi
                </Button>
              </div>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="pengguna" className="mt-4">
          <Panel
            judul="Pengguna &amp; Role"
            deskripsi="Kelola akses pengguna sistem pengadaan"
            aksi={
              <Button size="sm" onClick={() => setTambahTerbuka(true)}>
                <Plus className="size-4" aria-hidden /> Tambah Pengguna
              </Button>
            }
            padat
          >
            <div className="table-scroll hidden md:block">
              <table className="w-full min-w-[48rem] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nama</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Unit</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {PENGGUNA.map((u) => (
                    <tr key={u.email} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{u.nama}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.unit}</td>
                      <td className="px-5 py-3">{u.role}</td>
                      <td className="px-5 py-3">
                        <span
                          className={
                            u.aktif
                              ? "inline-flex rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                              : "inline-flex rounded-full bg-status-cancel-bg px-2.5 py-0.5 text-xs font-medium text-status-cancel"
                          }
                        >
                          {u.aktif ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {PENGGUNA.map((u) => (
                <li key={u.email} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.nama}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span
                      className={
                        u.aktif
                          ? "shrink-0 rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                          : "shrink-0 rounded-full bg-status-cancel-bg px-2.5 py-0.5 text-xs font-medium text-status-cancel"
                      }
                    >
                      {u.aktif ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {u.unit} · {u.role}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>

        {/* Tab Baru: Manajemen Unit */}
        <TabsContent value="unit" className="mt-4">
          <Panel
            judul="Daftar Unit / Fakultas"
            deskripsi="Kelola daftar unit atau departemen dalam sistem pengadaan"
            aksi={
              <Button size="sm" onClick={() => setTambahUnitTerbuka(true)}>
                <Plus className="size-4" aria-hidden /> Tambah Unit
              </Button>
            }
            padat
          >
            <div className="table-scroll hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-wide text-muted-foreground uppercase">
                    <th className="px-5 py-3 font-medium">Nama Unit</th>
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {unitList.map((unitName) => (
                    <tr key={unitName} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{unitName}</td>
                      <td className="px-5 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Hapus ${unitName}`}
                          className="text-destructive hover:text-destructive size-8"
                          onClick={() => handleHapusUnit(unitName)}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {unitList.map((unitName) => (
                <li key={unitName} className="flex items-center justify-between p-4">
                  <p className="text-sm font-medium">{unitName}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive h-8 px-2"
                    onClick={() => handleHapusUnit(unitName)}
                  >
                    Hapus
                  </Button>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
      </Tabs>

      {/* Dialog Tambah Pengguna */}
      <Dialog open={tambahTerbuka} onOpenChange={setTambahTerbuka}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna</DialogTitle>
          </DialogHeader>
          <form
            id="formPengguna"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              setTambahTerbuka(false);
              toast.success("Pengguna berhasil ditambahkan");
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="namaBaru">Nama</Label>
              <Input id="namaBaru" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emailBaru">Email</Label>
              <Input id="emailBaru" type="email" required />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="passwordBaru">Kata Sandi</Label>
              <Input id="passwordBaru" type="password" required />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select defaultValue={unitList[0] || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {unitList.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select defaultValue="Pengaju">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_LIST.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setTambahTerbuka(false)}
            >
              Batal
            </Button>
            <Button type="submit" form="formPengguna" className="w-full sm:w-auto">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Tambah Unit */}
      <Dialog open={tambahUnitTerbuka} onOpenChange={setTambahUnitTerbuka}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:w-full">
          <DialogHeader>
            <DialogTitle>Tambah Unit Baru</DialogTitle>
          </DialogHeader>
          <form id="formUnit" onSubmit={handleTambahUnit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="namaUnit">Nama Unit / Fakultas</Label>
              <Input
                id="namaUnit"
                value={namaUnitBaru}
                onChange={(e) => setNamaUnitBaru(e.target.value)}
                placeholder="Contoh: Fakultas Hukum"
                required
              />
            </div>
          </form>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setTambahUnitTerbuka(false)}
            >
              Batal
            </Button>
            <Button type="submit" form="formUnit" className="w-full sm:w-auto">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}