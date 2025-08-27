package providers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

type CoingeckoProvider struct {
	apiBase    string
	apiKey     string
	vsCurrency string
}

func NewCoingeckoProvider() (*CoingeckoProvider, error) {
	apiBase := os.Getenv("COINGECKO_API_BASE")
	if apiBase == "" {
		return nil, fmt.Errorf("COINGECKO_API_BASE is required")
	}

	apiKey := os.Getenv("COINGECKO_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("COINGECKO_API_KEY is required")
	}

	vsCurrency := os.Getenv("COINGECKO_VS_CURRENCY")
	if vsCurrency == "" {
		vsCurrency = "usd"
	}

	return &CoingeckoProvider{
		apiBase:    apiBase,
		apiKey:     apiKey,
		vsCurrency: vsCurrency,
	}, nil
}

func (c *CoingeckoProvider) Price(symbol string) float64 {
	url := fmt.Sprintf("%s/simple/price?ids=%s&vs_currencies=%s",
		c.apiBase, symbol, c.vsCurrency)

	resp, err := http.Get(url)
	if err != nil {
		return 0
	}
	defer resp.Body.Close()

	var data map[string]map[string]float64
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return 0
	}

	if price, ok := data[symbol][c.vsCurrency]; ok {
		return price
	}
	return 0
}

func (c *CoingeckoProvider) History(symbol, asset, rangeQ string) []Candle {
	days := "7"
	if rangeQ != "" {
		days = rangeQ[:len(rangeQ)-1]
	}

	url := fmt.Sprintf("%s/coins/%s/market_chart?vs_currency=%s&days=%s",
		c.apiBase, symbol, c.vsCurrency, days)

	resp, err := http.Get(url)
	if err != nil {
		return []Candle{}
	}
	defer resp.Body.Close()

	var result struct {
		Prices       [][]float64 `json:"prices"`
		TotalVolumes [][]float64 `json:"total_volumes"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return []Candle{}
	}

	candles := []Candle{}
	for i := range result.Prices {
		t := int64(result.Prices[i][0]) / 1000
		close := result.Prices[i][1]
		open := close
		high := close
		low := close
		volume := 0.0
		if i < len(result.TotalVolumes) {
			volume = result.TotalVolumes[i][1]
		}
		candles = append(candles, Candle{
			Time:   t,
			Open:   open,
			High:   high,
			Low:    low,
			Close:  close,
			Volume: volume,
		})
	}

	return candles
}

func (c *CoingeckoProvider) HistoryRange(symbol string, from, to int64) ([]Candle, error) {
	url := fmt.Sprintf(
		"%s/coins/%s/market_chart/range?vs_currency=%s&from=%d&to=%d",
		c.apiBase, symbol, c.vsCurrency, from, to,
	)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	if c.apiKey != "" {
		req.Header.Set("x-cg-demo-api-key", c.apiKey)
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("coingecko range: status=%d body=%s", resp.StatusCode, string(body))
	}

	var result struct {
		Prices       [][]float64 `json:"prices"`
		TotalVolumes [][]float64 `json:"total_volumes"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	candles := make([]Candle, 0, len(result.Prices))
	for i := range result.Prices {
		tms := int64(result.Prices[i][0])
		close := result.Prices[i][1]

		open, high, low := close, close, close

		vol := 0.0
		if i < len(result.TotalVolumes) && len(result.TotalVolumes[i]) >= 2 {
			vol = result.TotalVolumes[i][1]
		}

		candles = append(candles, Candle{
			Time:   tms / 1000,
			Open:   open,
			High:   high,
			Low:    low,
			Close:  close,
			Volume: vol,
		})
	}

	return candles, nil
}

func (c *CoingeckoProvider) AllHistory(rangeQ string) map[string][]Candle {
	url := fmt.Sprintf("%s/coins/list", c.apiBase)

	resp, err := http.Get(url)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	var coins []struct {
		ID string `json:"id"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&coins); err != nil {
		return nil
	}

	result := make(map[string][]Candle)
	for _, coin := range coins {
		result[coin.ID] = c.History(coin.ID, "crypto", rangeQ)
	}

	return result
}

func (c *CoingeckoProvider) AllCoins() ([]byte, error) {

	url := fmt.Sprintf("%s/coins/markets?vs_currency=%s&sparkline=true&price_change_percentage=1h,24h,7d",
		c.apiBase, c.vsCurrency)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("accept", "application/json")
	if c.apiKey != "" {
		req.Header.Set("x-cg-demo-api-key", c.apiKey)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
