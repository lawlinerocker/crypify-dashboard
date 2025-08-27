import { CoinMeta, RangeKey } from "@/lib/types/coin.types";

export type CompareChartsDto = {
  baseSymbol: string;
  baseCoin?: Partial<{
    id: string;
    symbol: string;
    name: string;
    image: string;
  }>;
  initialPeers?: string[];
  initialRange?: RangeKey;
  maxPeers?: number;
};

export type ToolTipsProps = {
  active?: boolean;
  label?: number | string;
  symbols: string[];
  getRowAt: (
    t: number,
    sym: string
  ) => { close: number; volume: number } | undefined;
  colorFor: (sym: string) => string;
  labelFor: (id: string) => { symbol?: string; name?: string };
};

export type GradientDefsProps = {
  ids: string[];
  colors: string[];
};

export type PriceChartProps = {
  symbol: string;
  coin?: CoinMeta;
};

export type AnimatedNumberProps = {
  value: number;
  digits?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};
