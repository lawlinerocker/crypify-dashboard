"use client";
import React, { useMemo, useState, useTransition } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { formatCurrencyCompact } from "@/lib/format";
import { RangeButtons } from "@/components/charts/RangeButtons";
import { GradientDefs } from "@/components/charts/GradientDefs";
import { PriceTooltip } from "@/components/charts/PriceToolTips";
import { COLORS, RANGE_SECONDS } from "@/lib/charts/constants";
import { fmtRangeLabel, fmtXTick } from "@/lib/charts/fmt";
import { useCoinMeta, useHistory } from "@/lib/charts/hooks";
import { tightYDomain } from "@/lib/charts/utils";
import { RangeKey } from "@/lib/types/coin.types";
import { PriceChartProps } from "@/lib/types/chart.types";

export default function PriceChart({ symbol, coin }: PriceChartProps) {
  const [range, setRange] = useState<RangeKey>("7d");
  const [isPending, startTransition] = useTransition();

  const toSec = Math.floor(Date.now() / 1000);
  const fromSec = useMemo(() => {
    return toSec - RANGE_SECONDS[range];
  }, [range, toSec]);

  const meta = useCoinMeta(symbol, coin);
  const series = useHistory(symbol, fromSec, toSec);

  const yDomain = useMemo(() => tightYDomain(series), [series]);

  const stroke = useMemo(() => {
    if (series.length < 2) return COLORS[0];
    const first = series[0].close;
    const last = series[series.length - 1].close;
    return last >= first ? "#22c55e" : "#ef4444";
  }, [series]);

  const rangeLabel = useMemo(
    () => fmtRangeLabel(fromSec, toSec),
    [fromSec, toSec]
  );

  return (
    <div className="dark:bg-card bg-card-light rounded-2xl p-5 border border-line">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-start gap-3">
          <img
            src={meta?.image || "/placeholder.png"}
            alt={meta?.name || symbol}
            className="w-7 h-7 rounded-full mt-0.5"
          />
          <div>
            <div className="text-xl font-semibold">
              {(meta?.symbol || symbol || "").toUpperCase()}
            </div>
            <div className="text-xs text-gray-400">
              {meta?.name || meta?.id || symbol.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500 mt-1">{rangeLabel}</div>
          </div>
        </div>
        <RangeButtons
          range={range}
          onChange={(rk) => startTransition(() => setRange(rk))}
          disabled={isPending}
        />
      </div>

      <div className="h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series}>
            <GradientDefs ids={["price"]} colors={[stroke]} />
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              stroke="#aaa"
              tickFormatter={(v: number) => fmtXTick(v, range)}
              minTickGap={32}
            />
            <YAxis
              domain={yDomain}
              stroke="#aaa"
              tickFormatter={(v) => `${formatCurrencyCompact(v)}`}
              width={80}
              allowDecimals
            />
            <Tooltip
              content={<PriceTooltip />}
              cursor={{ stroke: "#555", strokeWidth: 1, opacity: 0.3 }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={stroke}
              fill={`url(#grad-price)`}
              strokeWidth={2}
              dot={false}
              isAnimationActive
              animationDuration={450}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
