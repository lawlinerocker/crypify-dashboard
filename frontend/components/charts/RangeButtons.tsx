"use client";
import React from "react";
import type { RangeKey } from "@/lib/types/coin.types";

export function RangeButtons({
  range,
  onChange,
  disabled = false,
}: {
  range: RangeKey;
  onChange: (rk: RangeKey) => void;
  disabled?: boolean;
}) {
  const list: RangeKey[] = ["24h", "7d", "1m", "3m", "1y"];
  return (
    <div className="flex gap-2">
      {list.map((rk) => (
        <button
          key={rk}
          onClick={() => onChange(rk)}
          className={`px-3 py-1 rounded-lg border text-sm transition-colors
            ${
              range === rk
                ? "border-up text-up"
                : "border-line-light dark:border-line text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
            }
            ${disabled ? "opacity-70 cursor-not-allowed" : ""}
          `}
          disabled={disabled && rk !== range}
          title={`Last ${rk}`}
        >
          {rk}
        </button>
      ))}
    </div>
  );
}
