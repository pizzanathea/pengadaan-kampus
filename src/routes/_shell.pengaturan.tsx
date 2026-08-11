import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
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
import { PENGGUNA, ROLE_LIST, UNIT_LIST } from "@/data/pengadaan";

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

  return (
    <>
      <PageHeader
        judul="Pengaturan"
        subtitle="Kelola profil kampus, pengguna, dan preferensi sistem"
      />

      <Tabs defaultValue="kampus" className="min-w-0">
        <div className="table-scroll pb-1">
          <TabsList className="w-max">
            <TabsTrigger value="kampus">Profil Kampus</TabsTrigger>
            <TabsTrigger value="saya">Profil Saya</TabsTrigger>
            <TabsTrigger value="pengguna">Pengguna &amp; Role</TabsTrigger>
            <TabsTrigger value="sistem">Sistem</TabsTrigger>
            <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="kampus" className="mt-4">
          <Panel judul="Profil Kampus">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Profil kampus disimpan");
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="namaKampus">Nama Kampus</Label>
                  <Input id="namaKampus" defaultValue="Universitas Nusantara" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emailKampus">Email</Label>
                  <Input
                    id="emailKampus"
                    type="email"
                    defaultValue="pengadaan@kampus.ac.id"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="telp">Nomor Telepon</Label>
                  <Input id="telp" type="tel" defaultValue="(021) 555-0123" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="logo">Logo Kampus</Label>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input id="logo" type="file" accept="image/*" className="min-w-0" />
                    <Button type="button" variant="outline" className="w-full sm:w-auto">
                      <Upload className="size-4" aria-hidden /> Unggah
                    </Button>
                  </div>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea
                    id="alamat"
                    rows={3}
                    defaultValue="Jl. Pendidikan No. 45, Depok, Jawa Barat 16424"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  Batal
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Simpan
                </Button>
              </div>
            </form>
          </Panel>
        </TabsContent>

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
                    <th className="px-5 py-3 text-right font-medium">Aksi</th>
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
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Edit ${u.nama}`}>
                            <Pencil className="size-4" aria-hidden />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Hapus ${u.nama}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </Button>
                        </div>
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive"
                    >
                      Hapus
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="sistem" className="mt-4">
          <Panel judul="Pengaturan Sistem">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Pengaturan sistem disimpan");
              }}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="namaSistem">Nama Sistem</Label>
                  <Input id="namaSistem" defaultValue="Sistem Pengadaan Barang Kampus" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formatPengajuan">Format Nomor Pengajuan</Label>
                  <Input id="formatPengajuan" defaultValue="PB-{TAHUN}-{URUT:5}" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formatPengadaan">Format Nomor Pengadaan</Label>
                  <Input id="formatPengadaan" defaultValue="PGD-{TAHUN}-{URUT:4}" />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                  Simpan
                </Button>
              </div>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="notifikasi" className="mt-4">
          <Panel judul="Pengaturan Notifikasi" deskripsi="Pilih notifikasi yang ingin Anda terima">
            <ul className="divide-y divide-border">
              {[
                {
                  id: "n1",
                  judul: "Pengajuan baru masuk",
                  ket: "Dikirim saat ada pengajuan baru pada unit Anda.",
                  aktif: true,
                },
                {
                  id: "n2",
                  judul: "Pengajuan membutuhkan persetujuan",
                  ket: "Dikirim saat pengajuan menunggu keputusan Anda.",
                  aktif: true,
                },
                {
                  id: "n3",
                  judul: "Perubahan status pengadaan",
                  ket: "Dikirim saat pengadaan mulai diproses atau selesai.",
                  aktif: true,
                },
                {
                  id: "n4",
                  judul: "Ringkasan mingguan melalui email",
                  ket: "Rekap aktivitas pengadaan setiap hari Senin.",
                  aktif: false,
                },
              ].map((n) => (
                <li key={n.id} className="flex items-start justify-between gap-4 py-4 first:pt-0">
                  <div className="min-w-0">
                    <Label htmlFor={n.id} className="text-sm font-medium">
                      {n.judul}
                    </Label>
                    <p className="mt-1 text-xs text-muted-foreground">{n.ket}</p>
                  </div>
                  <Switch id={n.id} defaultChecked={n.aktif} className="mt-1 shrink-0" />
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
      </Tabs>

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
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select defaultValue="Fakultas Teknik">
                <SelectTrigger className="w-full">
                  <SelectValue />
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
    </>
  );
}
