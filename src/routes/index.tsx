import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      {/* Branding */}
      <section className="flex flex-col justify-between bg-sidebar px-6 py-10 text-sidebar-foreground sm:px-10 lg:px-14 lg:py-14">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-md bg-sidebar-accent">
            <GraduationCap className="size-5 text-sidebar-accent-foreground" aria-hidden />
          </span>
          <span className="text-sm font-semibold text-sidebar-primary">Sistem Pengadaan</span>
        </div>

        <div className="mt-10 max-w-xl lg:mt-0">
          <h1 className="text-2xl font-semibold tracking-tight text-sidebar-primary sm:text-3xl lg:text-4xl">
            Sistem Pengadaan Barang
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/80 sm:text-base">
            Kelola pengajuan dan proses pengadaan barang kampus secara mudah, terstruktur, dan
            transparan.
          </p>

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

        <p className="mt-10 text-xs text-sidebar-foreground/60 lg:mt-0">
          © 2026 Universitas Nusantara — Bagian Pengadaan
        </p>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
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
              <Link to="/" className="text-sm font-medium text-secondary-foreground underline-offset-4 hover:underline">
                Lupa kata sandi?
              </Link>
            </div>

            <Button type="submit" className="h-11 w-full">
              Masuk
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground">
            Belum memiliki akses? Hubungi Bagian Pengadaan untuk pembuatan akun.
          </p>
        </div>
      </section>
    </div>
  );
}
