"use client";
import React from "react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { fmtTooltipHeader } from "@/lib/charts/fmt";
import { ToolTipsProps } from "@/lib/types/chart.types";

export function CompareRawTooltip({
  active,
  label,
  symbols,
  getRowAt,
  colorFor,
  labelFor,
}: ToolTipsProps) {
  if (!active || label == null) return null;
  const t = Number(label);

  return (
    <div className="rounded-lg border border-line bg-[#151618] p-3 text-sm min-w-[240px]">
      <div className="mb-2 text-gray-300">{fmtTooltipHeader(t)}</div>
      <div className="space-y-1">
        {symbols.map((s) => {
          const row = getRowAt(t, s);
          const meta = labelFor(s);
          const color = colorFor(s);
          return (
            <div key={s} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: color }}
                />
                <span className="text-gray-300">
                  {(meta.symbol || s).toUpperCase()}
                </span>
              </div>
              <div className="text-right">
                <div className="text-white">
                  {row ? formatCurrency(row.close) : "—"}
                </div>
                <div className="text-gray-400 text-xs">
                  Vol {row ? formatCurrencyCompact(row.volume, 2) : "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
