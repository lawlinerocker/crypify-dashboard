"use client";
import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { RangeButtons } from "@/components/charts/RangeButtons";
import { GradientDefs } from "@/components/charts/GradientDefs";
import { CompareRawTooltip } from "@/components/charts/CompareRawToolTips";
import { COLORS, FEW_POINTS } from "@/lib/charts/constants";
import { fmtRangeLabel, fmtXTick } from "@/lib/charts/fmt";
import {
  useCoinsList,
  useMergedCompare,
  useRangeAnchor,
} from "@/lib/charts/hooks";
import { colorFor, getRowAtFactory } from "@/lib/charts/utils";
import { CompareChartsDto } from "@/lib/types/chart.types";
import { CoinMeta, RangeKey } from "@/lib/types/coin.types";

export default function CompareChart({
  baseSymbol,
  baseCoin,
  initialPeers = [],
  initialRange = "7d",
  maxPeers = 3,
}: CompareChartsDto) {
  const [range, setRange] = useState<RangeKey>(initialRange);
  const [peers, setPeers] = useState<string[]>(initialPeers.slice(0, maxPeers));

  const { from, to } = useRangeAnchor(range, [range, peers.join(",")]);
  const rangeLabel = useMemo(() => fmtRangeLabel(from, to), [from, to]);

  const coinList = useCoinsList();
  const symbols = useMemo(() => [baseSymbol, ...peers], [baseSymbol, peers]);

  const { merged, rawByTime, counts, latestPerSym } = useMergedCompare(
    symbols,
    from,
    to
  );
  const anyFew = symbols.some((s) => (counts[s] || 0) < FEW_POINTS);
  const ChartTag = anyFew ? LineChart : AreaChart;

  const labelFor = (id: string): CoinMeta => {
    const hit =
      coinList.find((c) => (c.id || "").toLowerCase() === id.toLowerCase()) ||
      coinList.find((c) => (c.symbol || "").toLowerCase() === id.toLowerCase());
    return hit || { id, symbol: id.toUpperCase(), name: id, image: "" };
  };

  const candidates = coinList.slice(0, 80);
  const addPeer = (id: string) =>
    setPeers((p) =>
      id && !p.includes(id) && p.length < maxPeers ? [...p, id] : p
    );
  const removePeer = (id: string) => setPeers((p) => p.filter((x) => x !== id));

  const getRowAt = getRowAtFactory(rawByTime);

  return (
    <div className="mt-6 bg-card-light dark:bg-card rounded-2xl border border-line-light dark:border-line p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            Compare{" "}
            <span className="text-gray-400">
              {(baseCoin?.symbol || baseSymbol).toString().toUpperCase()} vs
              others
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{rangeLabel}</div>
        </div>
        <RangeButtons range={range} onChange={setRange} />
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {peers.map((id) => {
          const m = labelFor(id);
          return (
            <button
              key={id}
              onClick={() => removePeer(id)}
              className="flex items-center gap-2 px-2 py-1 rounded-full border border-line-light dark:border-line text-xs text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500"
              title="Remove"
            >
              {m.image ? (
                <img
                  src={m.image}
                  className="w-4 h-4 rounded-full"
                  alt={m.symbol}
                />
              ) : null}
              <span>{(m.symbol || id).toUpperCase()}</span>
              <span className="text-gray-500">×</span>
            </button>
          );
        })}
        {peers.length < maxPeers && (
          <select
            className="bg-bg-light dark:bg-bg border border-line-light dark:border-line rounded-lg px-2 py-1 text-sm text-gray-700 dark:text-gray-200"
            onChange={(e) => {
              addPeer(e.target.value);
              e.currentTarget.selectedIndex = 0;
            }}
            defaultValue=""
          >
            <option value="" disabled>
              + Add coin
            </option>
            {candidates.map((c) => (
              <option
                key={c.id}
                value={c.id}
                className="bg-bg-light dark:bg-card"
              >
                {(c.symbol || "").toUpperCase()} — {c.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ChartTag data={merged}>
            <GradientDefs ids={symbols} colors={COLORS} />
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
              stroke="#aaa"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              width={60}
              allowDecimals
            />
            <Tooltip
              content={
                <CompareRawTooltip
                  symbols={symbols}
                  getRowAt={getRowAt}
                  colorFor={(sym: string) => colorFor(sym, symbols, COLORS)}
                  labelFor={labelFor}
                />
              }
              cursor={{ stroke: "#555", strokeWidth: 1, opacity: 0.3 }}
            />
            <Legend
              wrapperStyle={{ color: "#ccc" }}
              formatter={(v) => (labelFor(v).symbol || v).toUpperCase()}
            />

            {symbols.map((sym) => {
              const color = colorFor(sym, symbols, COLORS);
              const few = (counts[sym] || 0) < FEW_POINTS;
              return few ? (
                <Line
                  key={sym}
                  type="monotone"
                  dataKey={sym}
                  stroke={color}
                  dot={{ r: 2 }}
                  activeDot={{ r: 3 }}
                  strokeWidth={2}
                  isAnimationActive
                  connectNulls
                />
              ) : (
                <Area
                  key={sym}
                  type="monotone"
                  dataKey={sym}
                  stroke={color}
                  fill={`url(#grad-${sym})`}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive
                  animationDuration={450}
                  connectNulls
                />
              );
            })}
          </ChartTag>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {symbols.map((id, i) => {
          const meta = labelFor(id);
          const latest = latestPerSym[id];
          const color = COLORS[i % COLORS.length];
          return (
            <div
              key={id}
              className="rounded-lg border border-line-light dark:border-line p-3 flex items-center justify-between bg-bg-light dark:bg-bg"
            >
              <div className="flex items-center gap-2">
                {meta.image ? (
                  <img
                    src={meta.image}
                    alt={meta.symbol}
                    className="w-5 h-5 rounded-full"
                  />
                ) : null}
                <div className="text-sm text-gray-300">
                  <span className="font-semibold mr-1" style={{ color }}>
                    {(meta.symbol || id).toUpperCase()}
                  </span>
                  <span className="text-gray-500">{meta.name}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {latest ? formatCurrency(latest.close) : "—"}
                </div>
                <div className="text-xs text-gray-400">
                  Vol {latest ? formatCurrencyCompact(latest.volume, 2) : "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
