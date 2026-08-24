import { useState, useEffect, useCallback, type ReactNode } from "react";
import { Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
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
import {
  apiFetchNotifications,
  apiMarkNotificationAsRead,
  apiMarkAllNotificationsAsRead,
  type NotificationItem,
} from "@/lib/api";

const MENU_SEMUA = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Pengajuan Barang", to: "/pengajuan", icon: FileText },
  { label: "Persetujuan", to: "/persetujuan", icon: CheckSquare },
  { label: "Proses Pengadaan", to: "/pengadaan", icon: PackageSearch },
  { label: "Laporan", to: "/laporan", icon: BarChart3 },
] as const;

// Konfigurasi menu per role
const MENU_ROLE: Record<string, string[]> = {
  Pengaju: ["/pengajuan", "/pengadaan"],
  "Persetujuan 1": ["/dashboard", "/persetujuan"],
  "Persetujuan 2": ["/dashboard", "/persetujuan"],
};

// Helper: filter menu berdasarkan role
function getMenuByRole(role: string) {
  const allowed = MENU_ROLE[role];
  if (!allowed) return MENU_SEMUA; // role lain tampilkan semua
  return MENU_SEMUA.filter((m) => allowed.includes(m.to));
}

function SidebarContent({ onNavigate, role }: { onNavigate?: () => void; role: string }) {
  const MENU = getMenuByRole(role);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <img
          src="/logo-ipti.png"
          alt="Logo IPTI"
          className="size-9 shrink-0 object-contain rounded-md"
        />
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

      <div className="shrink-0 border-t border-sidebar-border p-3">
        {(() => {
          const aktif = pathname === "/pengaturan" || pathname.startsWith("/pengaturan/");
          return (
            <Link
              to="/pengaturan"
              onClick={onNavigate}
              aria-current={aktif ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                aktif
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/85 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Settings className="size-4 shrink-0" aria-hidden />
              <span className="truncate">Pengaturan</span>
            </Link>
          );
        })()}
      </div>
    </div>
  );
}

function NotifikasiMenu({ user, role }: { user: string; role: string }) {
  const [notif, setNotif] = useState<NotificationItem[]>([]);

  const fetchNotif = useCallback(async () => {
    if (!user || !role) return;
    try {
      const data = await apiFetchNotifications(role, user);
      setNotif(data);
    } catch (e) {
      console.error("Gagal mengambil notifikasi:", e);
    }
  }, [user, role]);

  useEffect(() => {
    fetchNotif();
    const interval = setInterval(fetchNotif, 10000);
    return () => clearInterval(interval);
  }, [fetchNotif]);

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
          {notif.length === 0 ? (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
              Tidak ada notifikasi baru.
            </div>
          ) : (
            notif.map((n) => (
              <DropdownMenuItem
                key={n._id}
                onClick={async () => {
                  try {
                    await apiMarkNotificationAsRead(n._id);
                    setNotif((prev) =>
                      prev.map((item) => (item._id === n._id ? { ...item, dibaca: true } : item))
                    );
                  } catch (e) {
                    console.error("Gagal menandai notifikasi dibaca:", e);
                  }
                }}
                className="flex flex-col items-start gap-1 py-2.5 whitespace-normal cursor-pointer"
              >
                <span className={cn("text-sm", !n.dibaca && "font-medium")}>{n.teks}</span>
                <span className="text-xs text-muted-foreground">
                  {n.waktu || new Date(n.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </DropdownMenuItem>
            ))
          )}
        </div>
        {notif.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={async (e) => {
                e.preventDefault();
                try {
                  await apiMarkAllNotificationsAsRead(role, user);
                  setNotif((prev) => prev.map((n) => ({ ...n, dibaca: true })));
                } catch (e) {
                  console.error("Gagal menandai semua dibaca:", e);
                }
              }}
              className="justify-center text-sm font-medium cursor-pointer"
            >
              Tandai semua sudah dibaca
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Ganti bagian deklarasi state user di dalam AppLayout menjadi seperti ini:
export function AppLayout({ children }: { children?: ReactNode }) {
  const [drawer, setDrawer] = useState(false);
  const [cariMobile, setCariMobile] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // PERBAIKAN: Gunakan fungsi callback pada useState untuk membaca localStorage secara sinkron saat inisialisasi
  const [user, setUser] = useState(() => {
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    try {
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        return {
          nama: parsed.nama || "Pengguna",
          email: parsed.email || "",
          role: parsed.role || "Pengaju",
        };
      }
    } catch (e) {
      console.error("Gagal parsing user saat inisialisasi");
    }
    // Jika tidak ada di localStorage, baru gunakan default
    return {
      nama: "",
      email: "",
      role: "",
    };
  });

  // useEffect tetap ada untuk menyinkronkan data dengan database (jika ada update di profil)
  useEffect(() => {
    const syncUser = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Gagal sync user");
        }
      }
    };

    // Panggil sekali saat mount
    syncUser();

    // Optional: Bisa ditambahkan event listener jika butuh update realtime antar tab
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  // ... sisanya kode tetap sama

  // Fungsi untuk mendapatkan inisial nama (contoh: "Budi Santoso" -> "BS")
  const getInisial = (nama: string) => {
    return nama
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate({ to: "/" });
  };

  const allMenuItems = [...MENU_SEMUA, { label: "Pengaturan", to: "/pengaturan", icon: Settings }];
  const judul =
    allMenuItems.find((m) => pathname === m.to || pathname.startsWith(m.to + "/"))?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar permanen pada desktop */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent role={user.role} />
        </div>
      </aside>

      {/* Sidebar drawer pada mobile & tablet */}
      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="w-[17rem] border-none bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigasi utama</SheetTitle>
          <SidebarContent role={user.role} onNavigate={() => setDrawer(false)} />
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

              <NotifikasiMenu user={user.nama} role={user.role} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 gap-2 px-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-secondary-foreground">
                      {getInisial(user.nama)}
                    </span>
                    <span className="hidden max-w-28 truncate text-sm font-medium sm:block">
                      {user.nama}
                    </span>
                    <ChevronDown className="hidden size-4 text-muted-foreground sm:block" aria-hidden />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.nama}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user.role}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/pengaturan">Pengaturan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    Keluar
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