export type RangeKey = "24h" | "7d" | "1m" | "3m" | "1y";

export type Candle = {
  time: number;
  open?: number;
  high?: number;
  low?: number;
  close: number;
  volume: number;
};

export type CoinMeta = {
  id?: string;
  symbol?: string;
  name?: string;
  image?: string;
};

export type CoinsDto = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price: number;
  market_cap?: number;
  price_change_percentage_24h?: number;
  sparkline_in_7d?: {
    price: number[];
  };
  total_volume?: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_rank?: number;
  fully_diluted_valuation?: number;
  circulating_supply?: number;
  total_supply?: number;
  max_supply?: number;
  high_24h?: number;
  low_24h?: number;
  ath?: number;
  ath_date?: string;
  atl?: number;
  atl_date?: string;
  ath_change_percentage?: number;
  atl_change_percentage?: number;
};

export type SplashProps = {
  title?: string;
  subtitle?: string;
  barMs?: number;
};

export type SortKey =
  | "market_cap_rank"
  | "current_price"
  | "price_change_1h"
  | "price_change_24h"
  | "price_change_7d"
  | "market_cap"
  | "total_volume";
