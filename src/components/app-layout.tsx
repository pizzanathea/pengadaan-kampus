import { useState, type ReactNode } from "react";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  PackageSearch,
  BarChart3,
  Settings,
  Menu,
  Bell,
  Search,
  X,
  ChevronDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NOTIFIKASI } from "@/data/pengadaan";

const MENU = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Pengajuan Barang", to: "/pengajuan", icon: FileText },
  { label: "Persetujuan", to: "/persetujuan", icon: CheckSquare },
  { label: "Proses Pengadaan", to: "/pengadaan", icon: PackageSearch },
  { label: "Laporan", to: "/laporan", icon: BarChart3 },
  { label: "Pengaturan", to: "/pengaturan", icon: Settings },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="grid size-9 shrink-0 place-items-center rounded-md bg-sidebar-accent text-sm font-bold text-sidebar-accent-foreground">
          SP
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-primary">Sistem Pengadaan</p>
          <p className="truncate text-xs text-sidebar-foreground/70">Barang Kampus</p>
        </div>
      </div>

      <nav aria-label="Navigasi utama" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <p className="px-2 pb-2 text-[11px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">
          Utama
        </p>
        <ul className="space-y-1">
          {MENU.map((item) => {
            const aktif =
              pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={aktif ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    aktif
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-sidebar-border p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            BS
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-primary">Budi Santoso</p>
            <p className="truncate text-xs text-sidebar-foreground/70">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifikasiMenu() {
  const [notif, setNotif] = useState(NOTIFIKASI);
  const belumDibaca = notif.filter((n) => !n.dibaca).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Notifikasi, ${belumDibaca} belum dibaca`}
          className="relative"
        >
          <Bell className="size-5" aria-hidden />
          {belumDibaca > 0 ? (
            <span className="absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground">
              {belumDibaca}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(22rem,calc(100vw-1.5rem))]"
      >
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Notifikasi</span>
          <span className="text-xs font-normal text-muted-foreground">
            {belumDibaca} belum dibaca
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-72 overflow-y-auto">
          {notif.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex flex-col items-start gap-1 py-2.5 whitespace-normal"
            >
              <span className={cn("text-sm", !n.dibaca && "font-medium")}>{n.teks}</span>
              <span className="text-xs text-muted-foreground">{n.waktu}</span>
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            setNotif((prev) => prev.map((n) => ({ ...n, dibaca: true })));
          }}
          className="justify-center text-sm font-medium"
        >
          Tandai semua sudah dibaca
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppLayout({ children }: { children?: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [cariMobile, setCariMobile] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const judul =
    MENU.find((m) => pathname === m.to || pathname.startsWith(m.to + "/"))?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar permanen pada desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent />
        </div>
      </aside>

      {/* Sidebar drawer pada mobile & tablet */}
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[17rem] border-none bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigasi utama</SheetTitle>
          <SidebarContent onNavigate={() => setDrawer(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
          <div className="grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Buka menu navigasi"
                onClick={() => setDrawer(true)}
              >
                <Menu className="size-5" aria-hidden />
              </Button>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold sm:text-base">{judul}</p>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  Sistem Pengadaan Barang Kampus
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
              <div className="relative hidden md:block">
                <Search
                  className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  type="search"
                  placeholder="Cari pengajuan..."
                  aria-label="Cari"
                  className="w-44 pl-9 lg:w-64"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={cariMobile ? "Tutup pencarian" : "Cari"}
                onClick={() => setCariMobile((v) => !v)}
              >
                {cariMobile ? <X className="size-5" /> : <Search className="size-5" />}
              </Button>

              <NotifikasiMenu />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 gap-2 px-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-secondary-foreground">
                      BS
                    </span>
                    <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                      Budi Santoso
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">Budi Santoso</p>
                    <p className="text-xs font-normal text-muted-foreground">Administrator</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/pengaturan">Pengaturan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/">Keluar</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {cariMobile ? (
            <div className="border-t border-border px-4 py-3 md:hidden">
              <Input type="search" placeholder="Cari pengajuan..." aria-label="Cari" autoFocus />
            </div>
          ) : null}
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-7xl min-w-0 space-y-6">{children ?? <Outlet />}</div>
        </main>
      </div>
    </div>
  );
}
