"use client";
import React from "react";
import useSWR from "swr";
import MiniSparkline from "./MiniSparkline";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { fetcher } from "@/lib/charts/fetcher";
import { CoinsDto, SortKey } from "@/lib/types/coin.types";
import AnimatedNumber from "./AnimatedNumber";
import { ChangeCell } from "./ChangeCell";

export default function CoinsTable({
  onSelect,
}: {
  onSelect: (coin: CoinsDto) => void;
}) {
  const { data, error } = useSWR("/api/coins", fetcher, {
    refreshInterval: 30000,
  });
  const [showAll, setShowAll] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortKey>("market_cap_rank");
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");

  const handleRowClick = React.useCallback(
    (c: CoinsDto) => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      onSelect(c);
    },
    [onSelect]
  );

  if (error) return <div className="text-red-400">Failed to load coins</div>;
  if (!data) return <div className="text-gray-400">Loading coins…</div>;

  const coins = Array.isArray(data) ? data : [];

  const sorted = [...coins].sort((a, b) => {
    const get = (c: CoinsDto) => {
      switch (sortBy) {
        case "current_price":
          return c.current_price ?? 0;
        case "market_cap":
          return c.market_cap ?? 0;
        case "total_volume":
          return c.total_volume ?? 0;
        case "price_change_1h":
          return c.price_change_percentage_1h_in_currency ?? 0;
        case "price_change_24h":
          return c.price_change_percentage_24h_in_currency ?? 0;
        case "price_change_7d":
          return c.price_change_percentage_7d_in_currency ?? 0;
        default:
          return c.market_cap_rank ?? Number.MAX_SAFE_INTEGER;
      }
    };
    const A = get(a),
      B = get(b);
    return sortDir === "asc" ? A - B : B - A;
  });

  const list = showAll ? sorted : sorted.slice(0, 10);

  const toggleSort = (key: SortKey) => {
    if (key === sortBy) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortBy === col ? (
      sortDir === "asc" ? (
        <ChevronUp className="inline w-3 h-3 ml-1" />
      ) : (
        <ChevronDown className="inline w-3 h-3 ml-1" />
      )
    ) : null;

  return (
    <div className="bg-card-light dark:bg-card rounded-2xl p-4 border border-line dark:border-line-dark">
      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed text-sm text-gray-900 dark:text-white">
          <thead>
            <tr className="text-gray-400 border-b border-line dark:border-line-dark">
              <th
                className="text-left px-3 py-2 cursor-pointer stick-col"
                onClick={() => toggleSort("market_cap_rank")}
              >
                # <SortIcon col="market_cap_rank" />
              </th>
              <th className="text-left px-3 py-2 stick-col bg-inherit z-10">
                Coin
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("current_price")}
              >
                Price <SortIcon col="current_price" />
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("price_change_1h")}
              >
                1h <SortIcon col="price_change_1h" />
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("price_change_24h")}
              >
                24h <SortIcon col="price_change_24h" />
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("price_change_7d")}
              >
                7d <SortIcon col="price_change_7d" />
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("market_cap")}
              >
                Market Cap <SortIcon col="market_cap" />
              </th>
              <th
                className="text-right px-3 py-2 cursor-pointer"
                onClick={() => toggleSort("total_volume")}
              >
                24h Volume <SortIcon col="total_volume" />
              </th>
              <th className="text-right px-3 py-2">Sparkline</th>
            </tr>
          </thead>

          <motion.tbody
            layout
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="divide-y divide-line dark:divide-line-dark"
          >
            <AnimatePresence initial={false}>
              {list.map((c: CoinsDto) => (
                <motion.tr
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => handleRowClick(c)}
                  className="hover:bg-gray-100 dark:hover:bg-[#222326] cursor-pointer transition-colors"
                >
                  <td className="px-3 py-3 stick-col">{c.market_cap_rank}</td>
                  <td className="px-3 py-3 flex items-center gap-3 stick-col sticky left-0 bg-inherit z-[1] backdrop-blur-lg">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div>
                      <div className="font-medium">
                        {(c.symbol || "").toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {c.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-bold">
                    <AnimatedNumber value={c.current_price} digits={2} />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <ChangeCell
                      value={c.price_change_percentage_1h_in_currency ?? 0}
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <ChangeCell
                      value={c.price_change_percentage_24h_in_currency ?? 0}
                    />
                  </td>
                  <td className="px-3 py-3 text-right">
                    <ChangeCell
                      value={c.price_change_percentage_7d_in_currency ?? 0}
                    />
                  </td>
                  <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">
                    <AnimatedNumber value={c.market_cap ?? 0} digits={0} />
                  </td>
                  <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">
                    <AnimatedNumber value={c.total_volume ?? 0} digits={0} />
                  </td>
                  <td className="px-3 py-3 text-right min-w-[120px]">
                    <MiniSparkline
                      values={c.sparkline_in_7d?.price || []}
                      change={c.price_change_percentage_7d_in_currency ?? 0}
                    />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>
      </div>

      {coins.length > 10 && (
        <div className="pt-4 text-center">
          <button
            onClick={() => setShowAll((s) => !s)}
            className="px-4 py-2 rounded-lg border border-line dark:border-line-dark hover:border-gray-500 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300"
          >
            {showAll ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
}
