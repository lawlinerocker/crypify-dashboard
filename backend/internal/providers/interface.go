package providers

type Candle struct {
	Time   int64   `json:"time"`
	Open   float64 `json:"open"`
	High   float64 `json:"high"`
	Low    float64 `json:"low"`
	Close  float64 `json:"close"`
	Volume float64 `json:"volume"`
}

type StockProvider interface {
	Price(symbol string) float64
	History(symbol, asset, rangeQ string) []Candle
}

type CryptoProvider interface {
	Price(symbol string) float64
	History(symbol, asset, rangeQ string) []Candle
	HistoryRange(symbol string, from, to int64) ([]Candle, error)
	AllHistory(rangeQ string) map[string][]Candle
	AllCoins() ([]byte, error)
}
