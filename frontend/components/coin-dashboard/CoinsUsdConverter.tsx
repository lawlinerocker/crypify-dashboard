"use client";
import React from "react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format";
import { CoinsDto } from "@/lib/types/coin.types";

export default function CoinsUsdConverter({ coin }: { coin: CoinsDto }) {
  const [coinInput, setCoinInput] = React.useState<string>("1");
  const [usdInput, setUsdInput] = React.useState<string>("");
  const [lastEdited, setLastEdited] = React.useState<"coin" | "usd">("coin");

  const priceUsd = Number(coin?.current_price) || 0;

  React.useEffect(() => {
    const n = Number(lastEdited === "coin" ? coinInput : usdInput);
    if (!Number.isFinite(n)) return;

    if (lastEdited === "coin") {
      const usd = n * priceUsd;
      setUsdInput(usd ? String(usd) : "");
    } else {
      const amt = priceUsd ? n / priceUsd : 0;
      setCoinInput(amt ? String(amt) : "");
    }
  }, [priceUsd]);

  const onChangeCoin = (v: string) => {
    setLastEdited("coin");
    setCoinInput(v);
    const n = Number(v);
    const usd = Number.isFinite(n) ? n * priceUsd : 0;
    setUsdInput(usd ? String(usd) : "");
  };

  const onChangeUsd = (v: string) => {
    setLastEdited("usd");
    setUsdInput(v);
    const n = Number(v);
    const amt = Number.isFinite(n) && priceUsd ? n / priceUsd : 0;
    setCoinInput(amt ? String(amt) : "");
  };

  const coinAmtNum = Number(coinInput) || 0;
  const usdAmtNum = Number(usdInput) || 0;

  return (
    <div className="dark:bg-card bg-card-light rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {coin.image && (
            <img
              src={coin.image}
              alt={coin.name}
              className="w-7 h-7 rounded-full"
            />
          )}
          <div className="text-xl font-semibold dark:text-white text-gray-900">
            {(coin.symbol || "").toUpperCase()} {coin.name}
            <span className="ml-2 text-sm font-normal dark:text-gray-400 text-gray-500">
              ⇄ USD Converter
            </span>
          </div>
        </div>

        <div className="text-xs dark:text-gray-400 text-gray-500 whitespace-nowrap">
          1 {(coin.symbol || "").toUpperCase()} = ${formatCurrency(priceUsd)}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {/* FROM (COIN) */}
        <div className="rounded-xl border border-line p-3 dark:bg-card bg-card-light">
          <div className="text-xs uppercase tracking-wide dark:text-gray-400 text-gray-500 mb-2">
            From ({(coin.symbol || "").toUpperCase()})
          </div>

          <input
            inputMode="decimal"
            type="number"
            min="0"
            step="any"
            value={coinInput}
            onChange={(e) => onChangeCoin(e.target.value)}
            className="w-full bg-transparent border border-line rounded-lg px-3 py-2 dark:text-white text-gray-900 focus:outline-none focus:border-gray-500"
            placeholder={`Amount in ${(coin.symbol || "").toUpperCase()}`}
          />

          <div className="mt-1 text-xs dark:text-gray-400 text-gray-500">
            ≈ {formatCurrency(coinAmtNum * priceUsd)}
          </div>
        </div>

        {/* TO (USD) */}
        <div className="rounded-xl border border-line p-3 dark:bg-card bg-card-light">
          <div className="text-xs uppercase tracking-wide dark:text-gray-400 text-gray-500 mb-2">
            To (USD)
          </div>

          <div className="w-full bg-transparent border border-line rounded-lg px-3 py-2 dark:text-white text-gray-900">
            <input
              inputMode="decimal"
              type="number"
              min="0"
              step="any"
              value={usdInput}
              onChange={(e) => onChangeUsd(e.target.value)}
              className="bg-transparent w-full focus:outline-none"
              placeholder="Amount in USD"
            />
          </div>

          <div className="mt-1 text-xs dark:text-gray-400 text-gray-500">
            ≈ {formatCurrency(usdAmtNum / (priceUsd || Infinity), 8)}{" "}
            {(coin.symbol || "").toUpperCase()}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs flex items-center justify-between dark:text-gray-400 text-gray-500">
        <div className="flex items-center gap-2">
          {coin.image && (
            <img
              src={coin.image}
              alt={coin.symbol}
              className="w-4 h-4 rounded-full"
            />
          )}
          <span className="dark:text-gray-300 text-gray-600">
            {(coin.symbol || "").toUpperCase()} • {coin.name}
          </span>
        </div>
        <div>
          Price ≈ {formatCurrencyCompact(priceUsd, 2)} /{" "}
          {(coin.symbol || "").toUpperCase()}
        </div>
      </div>
    </div>
  );
}
