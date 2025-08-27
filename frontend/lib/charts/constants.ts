import type { RangeKey } from "@/lib/types/coin.types";

export const RANGE_SECONDS: Record<RangeKey, number> = {
  "24h": 24 * 60 * 60,
  "7d": 7 * 24 * 60 * 60,
  "1m": 30 * 24 * 60 * 60,
  "3m": 90 * 24 * 60 * 60,
  "1y": 365 * 24 * 60 * 60,
};

export const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#14b8a6",
];

export const FEW_POINTS = 16;
