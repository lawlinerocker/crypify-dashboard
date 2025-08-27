"use client";
import React, { useMemo } from "react";
import useSWR from "swr";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatCurrencySmart,
} from "@/lib/format";
import { fetcher } from "@/lib/charts/fetcher";
import { Candle, CoinsDto } from "@/lib/types/coin.types";

function PercentPill({ value }: { value: number | null }) {
  if (value === null || !Number.isFinite(value)) return null;
  const isUp = value >= 0;
  const cls = isUp
    ? "text-green-500 bg-green-500/10"
    : "text-red-500 bg-red-500/10";
  const sign = value > 0 ? "+" : "";
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${cls}`}
    >
      {sign}
      {value.toFixed(2)}%
    </span>
  );
}

export default function CoinDetails({ coin }: { coin: CoinsDto }) {
  const {
    id,
    symbol,
    name,
    image,
    market_cap,
    fully_diluted_valuation,
    total_volume,
    circulating_supply,
    total_supply,
    max_supply,
    high_24h,
    low_24h,
    ath,
    ath_date,
    atl,
    atl_date,
    current_price,
    ath_change_percentage,
    atl_change_percentage,
  } = coin || {};

  const now = Math.floor(Date.now() / 1000);
  const sevenDays = 7 * 24 * 60 * 60;
  const { data: hist7d } = useSWR(
    id
      ? `/api/history/range?symbol=${id}&asset=crypto&from=${
          now - sevenDays
        }&to=${now}`
      : null,
    fetcher
  );
  const series7d: Candle[] = hist7d?.history ?? [];

  const range7d = useMemo(() => {
    if (!series7d.length) return null;
    let min = Number.POSITIVE_INFINITY,
      max = Number.NEGATIVE_INFINITY;
    for (const p of series7d) {
      if (p.close < min) min = p.close;
      if (p.close > max) max = p.close;
    }
    return { min, max };
  }, [series7d]);

  const range24h = useMemo(() => {
    if (typeof low_24h === "number" && typeof high_24h === "number")
      return { min: low_24h, max: high_24h };
    return null;
  }, [low_24h, high_24h]);

  const athPct: number | null = useMemo(() => {
    if (
      typeof ath_change_percentage === "number" &&
      Number.isFinite(ath_change_percentage)
    )
      return ath_change_percentage;
    if (typeof current_price === "number" && typeof ath === "number" && ath > 0)
      return ((current_price - ath) / ath) * 100;
    return null;
  }, [ath_change_percentage, current_price, ath]);

  const atlPct: number | null = useMemo(() => {
    if (
      typeof atl_change_percentage === "number" &&
      Number.isFinite(atl_change_percentage)
    )
      return atl_change_percentage;
    if (typeof current_price === "number" && typeof atl === "number" && atl > 0)
      return ((current_price - atl) / atl) * 100;
    return null;
  }, [atl_change_percentage, current_price, atl]);

  const Stat = ({
    label,
    value,
    hint,
    badge,
  }: {
    label: string;
    value: React.ReactNode;
    hint?: React.ReactNode;
    badge?: React.ReactNode;
  }) => (
    <div className="rounded-xl border border-line dark:bg-card bg-card-light p-4">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {label}
        </div>
        {badge}
      </div>
      <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </div>
      )}
    </div>
  );

  const fmtDate = (iso?: string) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-3">
        <img src={image} alt={name} className="w-7 h-7 rounded-full" />
        <div>
          <div className="text-xl font-semibold">
            {(symbol || "").toUpperCase()}
          </div>
          <div className="text-xs text-gray-400">{name}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Stat
          label="Market Cap"
          value={formatCurrencyCompact(market_cap ?? 0, 2)}
          hint={formatCurrency(market_cap ?? 0, 0)}
        />
        <Stat
          label="Fully Diluted Valuation"
          value={formatCurrencyCompact(fully_diluted_valuation ?? 0, 2)}
          hint={formatCurrency(fully_diluted_valuation ?? 0, 0)}
        />
        <Stat
          label="24h Trading Volume"
          value={formatCurrencyCompact(total_volume ?? 0, 2)}
          hint={formatCurrency(total_volume ?? 0, 0)}
        />
        <Stat
          label="Circulating Supply"
          value={formatCurrency(circulating_supply ?? 0, 0)}
          hint={name}
        />
        <Stat
          label="Total Supply"
          value={
            typeof total_supply === "number"
              ? formatCurrency(total_supply, 0)
              : "—"
          }
        />
        <Stat
          label="Max Supply"
          value={
            typeof max_supply === "number" ? formatCurrency(max_supply, 0) : "—"
          }
        />
      </div>

      <div className="rounded-2xl border border-line dark:bg-card bg-card-light p-4">
        <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Historical Price
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Stat
            label="24h Range"
            value={
              range24h
                ? `${formatCurrencySmart(range24h.min)} — ${formatCurrencySmart(
                    range24h.max
                  )}`
                : "—"
            }
          />
          <Stat
            label="7d Range"
            value={
              range7d
                ? `${formatCurrencySmart(range7d.min)} — ${formatCurrencySmart(
                    range7d.max
                  )}`
                : "—"
            }
          />
          <Stat
            label="All-Time High"
            value={typeof ath === "number" ? formatCurrencySmart(ath) : "—"}
            hint={ath_date ? `on ${fmtDate(ath_date)}` : undefined}
            badge={<PercentPill value={athPct} />}
          />
          <Stat
            label="All-Time Low"
            value={typeof atl === "number" ? formatCurrencySmart(atl) : "—"}
            hint={atl_date ? `on ${fmtDate(atl_date)}` : undefined}
            badge={<PercentPill value={atlPct} />}
          />
        </div>
      </div>
    </div>
  );
}
