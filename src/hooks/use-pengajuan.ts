import { useCallback, useEffect, useState } from "react";
import type { Pengajuan } from "@/data/pengadaan";
import { apiFetchPengajuanList, mapBackendPengajuan } from "@/lib/api";

export function usePengajuanData() {
  const [data, setData] = useState<Pengajuan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await apiFetchPengajuanList();
      setData(raw.map(mapBackendPengajuan));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal memuat data pengajuan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}