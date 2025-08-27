"use client";
import { GradientDefsProps } from "@/lib/types/chart.types";
import React from "react";

export function GradientDefs({ ids, colors }: GradientDefsProps) {
  return (
    <defs>
      {ids.map((id, i) => {
        const color = colors[i % colors.length];
        const gId = `grad-${id}`;
        return (
          <linearGradient key={gId} id={gId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        );
      })}
    </defs>
  );
}
