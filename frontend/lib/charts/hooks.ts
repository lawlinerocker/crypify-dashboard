import useSWR from "swr";
import { useEffect, useMemo, useState } from "react";
import { RANGE_SECONDS } from "./constants";
import { fetcher } from "./fetcher";
import { RangeKey, CoinMeta, Candle } from "../types/coin.types";

export function useRangeAnchor(range: RangeKey, deps: any[] = []) {
  const [anchorSec, setAnchorSec] = useState(() =>
    Math.floor(Date.now() / 1000)
  );
  useEffect(() => setAnchorSec(Math.floor(Date.now() / 1000)), deps);
  const to = anchorSec;
  const from = to - RANGE_SECONDS[range];
  return { from, to, anchorSec };
}

export function useCoinsList() {
  const { data } = useSWR("/api/coins", fetcher, { keepPreviousData: true });
  return Array.isArray(data) ? (data as CoinMeta[]) : [];
}

export function useCoinMeta(symbol: string, provided?: Partial<CoinMeta>) {
  const list = useCoinsList();
  return useMemo(() => {
    if (provided) return provided as CoinMeta;
    const lower = symbol.toLowerCase();
    return (
      list.find((c) => (c.symbol || "").toLowerCase() === lower) ||
      list.find((c) => (c.id || "").toLowerCase() === lower)
    );
  }, [list, provided, symbol]);
}

export function useHistory(symbol: string, from: number, to: number) {
  const key = `/api/history/range?symbol=${symbol}&asset=crypto&from=${from}&to=${to}`;
  const { data } = useSWR(key, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
    dedupingInterval: 10_000,
  });
  const series: Candle[] = (data?.history ?? []) as Candle[];
  return series;
}

export function useMergedCompare(symbols: string[], from: number, to: number) {
  const { data } = useSWR(
    ["compare", symbols.join(","), from, to],
    async () => {
      const res = await Promise.all(
        symbols.map(async (s) => {
          const r = await fetch(
            `/api/history/range?symbol=${s}&asset=crypto&from=${from}&to=${to}`
          );
          const j = await r.json();
          return { sym: s, rows: (j.history || []) as Candle[] };
        })
      );
      return res;
    },
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      dedupingInterval: 10_000,
    }
  );

  return useMemo(() => {
    const counts: Record<string, number> = {};
    const rawByTime: Record<
      number,
      Record<string, { close: number; volume: number }>
    > = {};
    const byTime: Record<number, any> = {};
    const latestPerSym: Record<
      string,
      { time: number; close: number; volume: number }
    > = {};

    if (!data) return { merged: [] as any[], rawByTime, counts, latestPerSym };

    for (const { sym, rows } of data) {
      counts[sym] = rows?.length || 0;
      if (rows?.length) {
        const last = rows[rows.length - 1];
        latestPerSym[sym] = {
          time: last.time,
          close: last.close,
          volume: last.volume,
        };
      }
      if (!rows?.length) continue;

      const base = rows[0].close;
      if (!base || !Number.isFinite(base)) continue;

      for (const r of rows) {
        if (!byTime[r.time]) byTime[r.time] = { time: r.time };
        if (!rawByTime[r.time]) rawByTime[r.time] = {};
        byTime[r.time][sym] = ((r.close - base) / base) * 100;
        rawByTime[r.time][sym] = { close: r.close, volume: r.volume };
      }
    }
    const mergedArr = Object.values(byTime).sort(
      (a: any, b: any) => a.time - b.time
    );
    return { merged: mergedArr, rawByTime, counts, latestPerSym };
  }, [data]);
}
