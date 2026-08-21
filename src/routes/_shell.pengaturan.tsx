import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { ROLE_LIST } from "@/data/pengadaan";

export const Route = createFileRoute("/_shell/pengaturan")({
  head: () => ({
    meta: [
      { title: "Pengaturan — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Atur profil kampus, profil pengguna, pengguna & role, penomoran dokumen, serta preferensi notifikasi sistem pengadaan.",
      },
      { property: "og:title", content: "Pengaturan — Sistem Pengadaan Kampus" },
      { property: "og:description", content: "Kelola konfigurasi sistem pengadaan kampus." },
    ],
  }),
  component: PengaturanPage,
});

function PengaturanPage() {
  const [tambahTerbuka, setTambahTerbuka] = useState(false);
  const [editTerbuka, setEditTerbuka] = useState(false);
  
  // State untuk manajemen Unit dari Database
  const [unitList, setUnitList] = useState<string[]>([]);
  const [loadingUnit, setLoadingUnit] = useState(true);
  const [tambahUnitTerbuka, setTambahUnitTerbuka] = useState(false);
  const [namaUnitBaru, setNamaUnitBaru] = useState("");

  // State untuk Profil Saya & Daftar Pengguna
  const [profilData, setProfilData] = useState({ nama: "", email: "" });
  const [passwordData, setPasswordData] = useState({ lama: "", baru: "", konfirmasi: "" });
  const [daftarPengguna, setDaftarPengguna] = useState<any[]>([]);

  // State untuk form Tambah & Edit Pengguna
  const [formUserBaru, setFormUserBaru] = useState({
    nama: "",
    email: "",
    password: "",
    unit: "",
    role: "Pengaju",
  });

  const [formUserEdit, setFormUserEdit] = useState({
    _id: "",
    nama: "",
    email: "",
    unit: "",
    role: "Pengaju",
    aktif: true,
  });

  const fetchDaftarPengguna = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/auth/users", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          setDaftarPengguna(result.data);
        }
      })
      .catch((err) => console.error("Gagal memuat daftar pengguna:", err));
  };

  // Ambil data profil user, unit, dan daftar pengguna saat halaman dimuat
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setProfilData({ nama: parsedUser.nama || "", email: parsedUser.email || "" });
      } catch (e) {
        console.error("Gagal parsing user dari localStorage");
      }
    }

    const token = localStorage.getItem("token");
    const headers = { "Authorization": `Bearer ${token}` };

    fetch("http://localhost:5000/api/auth/me", { headers })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setProfilData({ nama: result.data.nama, email: result.data.email });
          localStorage.setItem("user", JSON.stringify(result.data));
        }
      })
      .catch((err) => console.error("Gagal memuat profil:", err));

    fetchDaftarPengguna();

    fetch("http://localhost:5000/api/unit")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data)) {
          const units = result.data.map((u: any) => (typeof u === "string" ? u : u.nama));
          setUnitList(units);
          if (units.length > 0) {
            setFormUserBaru((prev) => ({ ...prev, unit: units[0] }));
          }
        }
      })
      .catch((err) => console.error("Gagal memuat unit:", err))
      .finally(() => setLoadingUnit(false));
  }, []);

  // Handle Update Profil (Nama & Email)
  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(profilData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Profil berhasil diperbarui");
        localStorage.setItem("user", JSON.stringify(result.data));
      } else {
        toast.error(result.message || "Gagal memperbarui profil");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  // Handle Ubah Kata Sandi
  const handleUbahPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.baru !== passwordData.konfirmasi) {
      toast.error("Konfirmasi kata sandi baru tidak cocok!");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/api/auth/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordLama: passwordData.lama,
          passwordBaru: passwordData.baru,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Kata sandi berhasil diubah");
        setPasswordData({ lama: "", baru: "", konfirmasi: "" });
      } else {
        toast.error(result.message || "Gagal mengubah kata sandi");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  // Handle Tambah Pengguna Baru ke Database
  const handleTambahPengguna = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      ...formUserBaru,
      unit: formUserBaru.unit || unitList[0],
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Pengguna berhasil ditambahkan ke database");
        setTambahTerbuka(false);
        setFormUserBaru({ nama: "", email: "", password: "", unit: unitList[0] || "", role: "Pengaju" });
        fetchDaftarPengguna();
      } else {
        toast.error(result.message || "Gagal menambahkan pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  // Handle Edit Pengguna
  const handleBukaEdit = (user: any) => {
    setFormUserEdit({
      _id: user._id,
      nama: user.nama,
      email: user.email,
      unit: user.unit,
      role: user.role,
      aktif: user.aktif !== false,
    });
    setEditTerbuka(true);
  };

  const handleSimpanEditPengguna = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${formUserEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formUserEdit),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Pengguna berhasil diperbarui");
        setEditTerbuka(false);
        fetchDaftarPengguna();
      } else {
        toast.error(result.message || "Gagal memperbarui pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  // Handle Hapus Pengguna
  const handleHapusPengguna = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) return;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Pengguna berhasil dihapus");
        fetchDaftarPengguna();
      } else {
        toast.error(result.message || "Gagal menghapus pengguna");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  const handleTambahUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = namaUnitBaru.trim();
    if (!trimmedName) return;

    if (unitList.includes(trimmedName)) {
      toast.error("Unit sudah terdaftar");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/unit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama: trimmedName }),
      });

      const result = await response.json();

      if (result.success) {
        setUnitList([...unitList, trimmedName]);
        setNamaUnitBaru("");
        setTambahUnitTerbuka(false);
        toast.success("Unit berhasil ditambahkan ke database");
      } else {
        toast.error("Gagal menambah unit: " + result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
  };

  const handleHapusUnit = async (unitTarget: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/unit/${encodeURIComponent(unitTarget)}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setUnitList(unitList.filter((u) => u !== unitTarget));
        toast.success(`Unit ${unitTarget} berhasil dihapus`);
      } else {
        toast.error("Gagal menghapus unit: " + result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan koneksi ke server");
    }
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
            <form className="space-y-4" onSubmit={handleUpdateProfil}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="namaSaya">Nama</Label>
                  <Input
                    id="namaSaya"
                    value={profilData.nama}
                    onChange={(e) => setProfilData({ ...profilData, nama: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="emailSaya">Email</Label>
                  <Input
                    id="emailSaya"
                    type="email"
                    value={profilData.email}
                    onChange={(e) => setProfilData({ ...profilData, email: e.target.value })}
                    required
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
            <form className="space-y-4" onSubmit={handleUbahPassword}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lama">Kata Sandi Lama</Label>
                  <Input
                    id="lama"
                    type="password"
                    value={passwordData.lama}
                    onChange={(e) => setPasswordData({ ...passwordData, lama: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="baru">Kata Sandi Baru</Label>
                  <Input
                    id="baru"
                    type="password"
                    value={passwordData.baru}
                    onChange={(e) => setPasswordData({ ...passwordData, baru: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="konfirmasi">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="konfirmasi"
                    type="password"
                    value={passwordData.konfirmasi}
                    onChange={(e) => setPasswordData({ ...passwordData, konfirmasi: e.target.value })}
                    required
                  />
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
                  {daftarPengguna.map((u) => (
                    <tr key={u._id || u.email} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{u.nama}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.unit}</td>
                      <td className="px-5 py-3">{u.role}</td>
                      <td className="px-5 py-3">
                        <span
                          className={
                            u.aktif !== false
                              ? "inline-flex rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                              : "inline-flex rounded-full bg-status-cancel-bg px-2.5 py-0.5 text-xs font-medium text-status-cancel"
                          }
                        >
                          {u.aktif !== false ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-blue-600 hover:text-blue-700"
                          onClick={() => handleBukaEdit(u)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          onClick={() => handleHapusPengguna(u._id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {daftarPengguna.map((u) => (
                <li key={u._id || u.email} className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.nama}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <span
                      className={
                        u.aktif !== false
                          ? "shrink-0 rounded-full bg-status-approved-bg px-2.5 py-0.5 text-xs font-medium text-status-approved"
                          : "shrink-0 rounded-full bg-status-cancel-bg px-2.5 py-0.5 text-xs font-medium text-status-cancel"
                      }
                    >
                      {u.aktif !== false ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {u.unit} · {u.role}
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleBukaEdit(u)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleHapusPengguna(u._id)}>
                      Hapus
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>

        {/* Tab Manajemen Unit Terhubung ke Database */}
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
            {loadingUnit ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Memuat daftar unit...</p>
            ) : unitList.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">Belum ada unit tersedia di database.</p>
            ) : (
              <>
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
              </>
            )}
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
            onSubmit={handleTambahPengguna}
          >
            <div className="space-y-1.5">
              <Label htmlFor="namaBaru">Nama</Label>
              <Input
                id="namaBaru"
                value={formUserBaru.nama}
                onChange={(e) => setFormUserBaru({ ...formUserBaru, nama: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emailBaru">Email</Label>
              <Input
                id="emailBaru"
                type="email"
                value={formUserBaru.email}
                onChange={(e) => setFormUserBaru({ ...formUserBaru, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="passwordBaru">Kata Sandi</Label>
              <Input
                id="passwordBaru"
                type="password"
                value={formUserBaru.password}
                onChange={(e) => setFormUserBaru({ ...formUserBaru, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select
                value={formUserBaru.unit || unitList[0] || ""}
                onValueChange={(val) => setFormUserBaru({ ...formUserBaru, unit: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Unit" />
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
              <Select
                value={formUserBaru.role}
                onValueChange={(val) => setFormUserBaru({ ...formUserBaru, role: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Role" />
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

      {/* Dialog Edit Pengguna */}
      <Dialog open={editTerbuka} onOpenChange={setEditTerbuka}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-lg sm:w-full">
          <DialogHeader>
            <DialogTitle>Edit Pengguna</DialogTitle>
          </DialogHeader>
          <form
            id="formEditPengguna"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            onSubmit={handleSimpanEditPengguna}
          >
            <div className="space-y-1.5">
              <Label htmlFor="namaEdit">Nama</Label>
              <Input
                id="namaEdit"
                value={formUserEdit.nama}
                onChange={(e) => setFormUserEdit({ ...formUserEdit, nama: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="emailEdit">Email</Label>
              <Input
                id="emailEdit"
                type="email"
                value={formUserEdit.email}
                onChange={(e) => setFormUserEdit({ ...formUserEdit, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Unit</Label>
              <Select
                value={formUserEdit.unit || unitList[0] || ""}
                onValueChange={(val) => setFormUserEdit({ ...formUserEdit, unit: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Unit" />
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
              <Select
                value={formUserEdit.role}
                onValueChange={(val) => setFormUserEdit({ ...formUserEdit, role: val })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Role" />
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Status Akun</Label>
              <Select
                value={formUserEdit.aktif ? "aktif" : "nonaktif"}
                onValueChange={(val) => setFormUserEdit({ ...formUserEdit, aktif: val === "aktif" })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setEditTerbuka(false)}
            >
              Batal
            </Button>
            <Button type="submit" form="formEditPengguna" className="w-full sm:w-auto">
              Simpan Perubahan
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