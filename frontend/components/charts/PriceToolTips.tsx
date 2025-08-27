"use client";
import React from "react";
import { formatCurrency } from "@/lib/format";
import { fmtTooltipHeader } from "@/lib/charts/fmt";

export function PriceTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-lg border border-line bg-[#151618] p-3 text-sm">
      <div className="mb-1 text-gray-300">
        {fmtTooltipHeader(Number(label))}
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1">
        <span className="text-gray-400">Open</span>
        <span className="text-white">{formatCurrency(p.open)}</span>
        <span className="text-gray-400">High</span>
        <span className="text-white">{formatCurrency(p.high)}</span>
        <span className="text-gray-400">Low</span>
        <span className="text-white">{formatCurrency(p.low)}</span>
        <span className="text-gray-400">Close</span>
        <span className="text-white">{formatCurrency(p.close)}</span>
        <span className="text-gray-400">Volume</span>
        <span className="text-white">{formatCurrency(p.volume, 0)}</span>
      </div>
    </div>
  );
}
