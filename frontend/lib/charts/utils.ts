import { Candle } from "../types/coin.types";

export function tightYDomain(series: Candle[]): [number, number] {
  if (!series?.length) return [0, 1];
  let min = Number.POSITIVE_INFINITY,
    max = Number.NEGATIVE_INFINITY;
  for (const p of series) {
    if (p.close < min) min = p.close;
    if (p.close > max) max = p.close;
  }
  if (!isFinite(min) || !isFinite(max) || min === max) {
    const pad = (min || 1) * 0.01;
    return [(min || 0) - pad, (max || 0) + pad];
  }
  const pad = (max - min) * 0.05;
  return [min - pad, max + pad];
}

export const colorFor = (sym: string, symbols: string[], palette: string[]) =>
  palette[symbols.indexOf(sym) % palette.length];

export function getRowAtFactory(
  raw: Record<number, Record<string, { close: number; volume: number }>>
) {
  return (t: number, sym: string) => {
    if (raw[t]?.[sym]) return raw[t][sym];
    let best: { close: number; volume: number } | undefined;
    let bestDiff = Infinity;
    for (const tsStr in raw) {
      const ts = Number(tsStr);
      const rec = raw[ts]?.[sym];
      if (rec) {
        const d = Math.abs(ts - t);
        if (d < bestDiff) {
          bestDiff = d;
          best = rec;
        }
      }
    }
    return best;
  };
}
