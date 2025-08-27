import type { RangeKey } from "@/lib/types/coin.types";

export const fmtHMS = (tsSec: number) =>
  new Date(tsSec * 1000).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

export const fmtRangeLabel = (from: number, to: number) => {
  const f = new Date(from * 1000);
  const t = new Date(to * 1000);
  const sameYear = f.getFullYear() === t.getFullYear();
  const left = f.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: sameYear ? undefined : "numeric",
  });
  const right = t.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${left} to ${right}`;
};

export const fmtXTick = (tsSec: number, range: RangeKey) => {
  if (range === "24h") return fmtHMS(tsSec);
  if (range === "1y")
    return new Date(tsSec * 1000).toLocaleDateString(undefined, {
      month: "short",
    });
  return new Date(tsSec * 1000).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export const fmtTooltipHeader = (tsSec: number) =>
  new Date(tsSec * 1000).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
