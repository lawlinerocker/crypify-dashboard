"use client";
import React from "react";
import Header from "@/components/header/Header";
import PriceChart from "@/components/charts/PriceChart";
import CompareChart from "@/components/charts/CompareCharts";
import { CoinsDto } from "@/lib/types/coin.types";
import CoinsTable from "@/components/coin-dashboard/CoinsTable";
import CoinDetails from "@/components/coin-dashboard/CoinDetails";
import CoinsUsdConverter from "@/components/coin-dashboard/CoinsUsdConverter";

export const metadata = {
  title: "Markets | Crypify",
  description: "Live market data and interactive crypto charts.",
};

export default function Page() {
  const [selected, setSelected] = React.useState<CoinsDto | null>(null);

  return (
    <main className="min-h-screen w-full px-6 bg-white text-black dark:bg-[#0b0c0e] dark:text-white transition-colors duration-300">
      <Header />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <CoinsTable onSelect={(c) => setSelected(c)} />
        </div>

        <div>
          {selected ? (
            <>
              <PriceChart
                symbol={selected.id || selected.symbol}
                coin={{
                  name: selected.name,
                  symbol: selected.symbol,
                  image: selected.image,
                }}
              />
              <CompareChart
                baseSymbol={selected.id || selected.symbol}
                baseCoin={{
                  name: selected.name,
                  symbol: selected.symbol,
                  image: selected.image,
                }}
                initialPeers={["ethereum", "solana"]}
              />
              <CoinDetails coin={selected} />
              <div className="mt-6">
                <CoinsUsdConverter coin={selected} />
              </div>
            </>
          ) : (
            <div className="bg-card-light dark:bg-card rounded-2xl p-8 border border-line dark:border-line-dark text-gray-400 transition-colors">
              Select a coin to view its chart
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
