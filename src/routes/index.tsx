import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, FileCheck2, BarChart3, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Masuk — Sistem Pengadaan Barang Kampus" },
      {
        name: "description",
        content:
          "Masuk ke Sistem Pengadaan Barang Kampus untuk mengelola pengajuan dan proses pengadaan barang secara terstruktur dan transparan.",
      },
      { property: "og:title", content: "Masuk — Sistem Pengadaan Barang Kampus" },
      {
        property: "og:description",
        content:
          "Kelola pengajuan dan proses pengadaan barang kampus secara mudah, terstruktur, dan transparan.",
      },
    ],
  }),
  component: AuthPage,
});

type Mode = "login" | "register";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // State untuk daftar unit pilihan (diambil dari database)
  const [unitList, setUnitList] = useState<string[]>([]);

  // State Form Register
  const [registerData, setRegisterData] = useState({
    nama: "",
    email: "",
    password: "",
    konfirmasiPassword: "",
    unit: "",
  });

  // Ambil daftar unit dari database secara real-time saat komponen dimuat
  // Ambil daftar unit dari database secara real-time saat komponen dimuat
  useEffect(() => {
    fetch("http://localhost:5000/api/unit")
      .then((res) => res.json())
      .then((result) => {
        // Cek format data, tangani jika berupa array objek atau array string
        let rawData = [];
        if (result.success && Array.isArray(result.data)) {
          rawData = result.data;
        } else if (Array.isArray(result)) {
          rawData = result;
        }

        if (rawData.length > 0) {
          // Konversi menjadi array string jika isinya berupa objek (misal: { nama: "..." } atau { unit: "..." })
          const formattedUnits = rawData.map((item: any) => 
            typeof item === "string" ? item : (item.nama || item.unit || item.title || JSON.stringify(item))
          );

          setUnitList(formattedUnits);
          setRegisterData((prev) => ({ ...prev, unit: formattedUnits[0] }));
        }
      })
      .catch((err) => console.error("Gagal memuat unit:", err));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (registerData.password !== registerData.konfirmasiPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: registerData.nama,
          email: registerData.email,
          password: registerData.password,
          unit: registerData.unit,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Berhasil daftar: beri pesan sukses, lalu pindahkan mode ke "login"
        setSuccessMessage("Registrasi berhasil! Silakan masuk dengan akun Anda.");
        
        // Reset form
        setRegisterData({ nama: "", email: "", password: "", konfirmasiPassword: "", unit: registerData.unit });
        
        // Pindah ke mode login setelah 1.5 detik
        setTimeout(() => {
          setMode("login");
          setSuccessMessage("");
        }, 1500);
      } else {
        setErrorMessage(result.message || "Terjadi kesalahan saat registrasi.");
      }
    } catch (err) {
      setErrorMessage("Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.message || "Email atau kata sandi salah.");
        return;
      }

      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("auth_user", JSON.stringify(result.data));
      navigate({ to: "/dashboard" });
    } catch {
      setErrorMessage("Gagal terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Branding — fixed di viewport */}
      <section
        className="relative flex flex-col justify-between overflow-hidden bg-sidebar px-6 py-10 text-sidebar-foreground sm:px-10 lg:px-14 lg:py-14 lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-1/2"
        style={{
          backgroundImage: "url('/WhatsApp Image 2026-08-10 at 10.31.41.jpeg')",
          backgroundSize: "auto 100%",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-sidebar/80" aria-hidden />

        <div className="relative z-10 flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-sidebar-accent">
            <GraduationCap className="size-5 text-sidebar-accent-foreground" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-sidebar-primary">Sistem Pengadaan</span>
        </div>

        <div className="relative z-10 mt-10 max-w-xl lg:mt-0">
          <h1 className="text-2xl font-semibold tracking-tight text-sidebar-primary sm:text-3xl lg:text-4xl">
            Sistem Pengadaan Barang
          </h1>

          <ul className="mt-8 space-y-4">
            {[
              { icon: FileCheck2, teks: "Pengajuan barang terdokumentasi rapi" },
              { icon: ShieldCheck, teks: "Alur persetujuan berjenjang yang jelas" },
              { icon: BarChart3, teks: "Laporan pengadaan siap diekspor" },
            ].map((f) => (
              <li key={f.teks} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md bg-sidebar-accent/70">
                  <f.icon className="size-4 text-sidebar-accent-foreground" aria-hidden />
                </span>
                <span className="text-sm text-sidebar-foreground/85">{f.teks}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 mt-10 text-xs text-sidebar-foreground/60 lg:mt-0">
          © 2026 Institut Pariwisata Tedja Indonesia | All rights reserved.
        </p>
      </section>

      {/* Form Section */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:ml-[50%] lg:min-h-screen">
        <div className="w-full max-w-md">
          {errorMessage && (
            <div className="mb-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 rounded-md bg-emerald-500/15 p-3 text-sm text-emerald-600">
              {successMessage}
            </div>
          )}

          {mode === "login" ? (
            <>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Masuk</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gunakan akun kampus Anda untuk mengakses sistem.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleLogin}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@kampus.ac.id"
                    value={loginData.email}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sandi">Kata Sandi</Label>
                  <Input
                    id="sandi"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Checkbox id="ingat" defaultChecked />
                    <Label htmlFor="ingat" className="text-sm font-normal">
                      Ingat saya
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-secondary-foreground underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? <><Loader2 className="size-4 animate-spin" aria-hidden /> Memproses...</> : "Masuk"}
                </Button>
              </form>

              <p className="mt-6 text-xs text-muted-foreground">
                Belum memiliki akses?{" "}
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className="font-medium text-secondary-foreground underline-offset-4 hover:underline"
                >
                  Daftar akun baru
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Daftar Akun</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Buat akun kampus untuk mulai mengajukan pengadaan barang.
              </p>

              <form className="mt-8 space-y-4" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    type="text"
                    value={registerData.nama}
                    onChange={(e) => setRegisterData({ ...registerData, nama: e.target.value })}
                    placeholder="Budi Santoso"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-daftar">Email Kampus</Label>
                  <Input
                    id="email-daftar"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="nama@kampus.ac.id"
                    required
                    className="h-11"
                  />
                </div>

                {/* --- PILIHAN UNIT / FAKULTAS (Dinamis dari Database) --- */}
                <div className="space-y-2">
                  <Label htmlFor="unit-daftar">Unit / Fakultas</Label>
                  <select
                    id="unit-daftar"
                    value={registerData.unit}
                    onChange={(e) => setRegisterData({ ...registerData, unit: e.target.value })}
                    className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    {unitList.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sandi-daftar">Kata Sandi</Label>
                  <Input
                    id="sandi-daftar"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="konfirmasi-sandi">Konfirmasi Kata Sandi</Label>
                  <Input
                    id="konfirmasi-sandi"
                    type="password"
                    value={registerData.konfirmasiPassword}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, konfirmasiPassword: e.target.value })
                    }
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="setuju" required className="mt-0.5" />
                  <Label htmlFor="setuju" className="text-sm font-normal leading-snug">
                    Saya menyetujui ketentuan penggunaan dan kebijakan privasi sistem ini.
                  </Label>
                </div>

                <Button type="submit" className="h-11 w-full" disabled={loading}>
                  {loading ? <Loader2 className="size-4 animate-spin" /> : "Daftar"}
                </Button>
              </form>

              <p className="mt-6 text-xs text-muted-foreground">
                Sudah memiliki akun?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-medium text-secondary-foreground underline-offset-4 hover:underline"
                >
                  Masuk di sini
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}