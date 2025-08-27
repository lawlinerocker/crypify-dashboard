export function formatCurrency(n: number, digits: number = 2) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatCurrencyCompact(n: number, digits: number = 2) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: digits,
  });
}

export function formatCurrencySmart(
  n: number,
  digits: number = 2,
  threshold: number = 100_000
) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  return abs >= threshold
    ? n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      })
    : n.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
}

export function tsToShort(t: any) {
  let d: Date;
  if (typeof t === "number") {
    d = new Date(t > 1e12 ? t : t * 1000);
  } else {
    d = new Date(t);
  }
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
