import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck, FileCheck2, BarChart3 } from "lucide-react";

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

  return (
    <div className="relative min-h-screen w-full">
      {/* Branding — fixed di viewport, posisi konten gak pernah ikut geser walau tinggi form berubah */}
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
        {/* Overlay gelap supaya teks tetap kebaca di atas gambar */}
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

      {/* Form — bagian ini yang ganti-ganti sesuai mode, page tetap sama */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:ml-[50%] lg:min-h-screen">
        <div className="w-full max-w-md">
          {mode === "login" ? (
            <>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Masuk</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gunakan akun kampus Anda untuk mengakses sistem.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/dashboard" });
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@kampus.ac.id"
                    defaultValue="budi.santoso@kampus.ac.id"
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
                    defaultValue="password"
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

                <Button type="submit" className="h-11 w-full">
                  Masuk
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

              <form
                className="mt-8 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/dashboard" });
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    type="text"
                    autoComplete="name"
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
                    inputMode="email"
                    autoComplete="email"
                    placeholder="nama@kampus.ac.id"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit / Fakultas</Label>
                  <Input
                    id="unit"
                    type="text"
                    placeholder="Contoh: Fakultas Teknik"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sandi-daftar">Kata Sandi</Label>
                  <Input
                    id="sandi-daftar"
                    type="password"
                    autoComplete="new-password"
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
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="setuju" required className="mt-0.5" />
                  <Label htmlFor="setuju" className="text-sm font-normal leading-snug">
                    Saya menyetujui ketentuan penggunaan dan kebijakan privasi sistem ini.
                  </Label>
                </div>

                <Button type="submit" className="h-11 w-full">
                  Daftar
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
