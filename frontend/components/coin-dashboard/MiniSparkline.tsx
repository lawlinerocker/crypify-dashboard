"use client";
import React from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis } from "recharts";

export default function MiniSparkline({
  values,
  change,
}: {
  values: number[];
  change: number;
}) {
  if (!values || values.length === 0) return null;

  const data = values.map((v, i) => ({ value: v }));

  const color = change >= 0 ? "#16c784" : "#ea3943";

  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <YAxis hide domain={["dataMin", "dataMax"]} />

        <Tooltip contentStyle={{ display: "none" }} />

        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill="url(#sparkline-gradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
