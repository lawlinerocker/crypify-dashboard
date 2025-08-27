package server

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lawlinerocker/crypify/backend/internal/providers"
	"github.com/lawlinerocker/crypify/backend/internal/storage"
)

func RegisterRoutes(
	r *gin.Engine,
	db *storage.DB,
	providerCrypto providers.CryptoProvider,
) {
	r.GET("/api/price", func(c *gin.Context) {
		symbol := c.Query("symbol")
		asset := c.Query("asset")
		if symbol == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "symbol is required"})
			return
		}

		var price float64
		if asset == "crypto" {
			price = providerCrypto.Price(symbol)
		}

		c.JSON(http.StatusOK, gin.H{"symbol": symbol, "asset": asset, "price": price})
	})

	r.GET("/api/history", func(c *gin.Context) {
		symbol := c.Query("symbol")
		asset := c.Query("asset")
		rangeQ := c.Query("range")
		if symbol == "" || rangeQ == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "symbol and range are required"})
			return
		}

		var candles []providers.Candle
		if asset == "crypto" {
			candles = providerCrypto.History(symbol, asset, rangeQ)
		}

		c.JSON(http.StatusOK, gin.H{"symbol": symbol, "asset": asset, "history": candles})
	})

	r.GET("/api/history/all", func(c *gin.Context) {
		rangeQ := c.Query("range")
		if rangeQ == "" {
			rangeQ = "7d"
		}

		allCandles := providerCrypto.AllHistory(rangeQ)
		if allCandles == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch data"})
			return
		}

		c.JSON(http.StatusOK, allCandles)
	})

	r.GET("/api/history/range", func(c *gin.Context) {
		symbol := c.Query("symbol")
		asset := c.Query("asset")
		fromStr := c.Query("from")
		toStr := c.Query("to")

		if symbol == "" || fromStr == "" || toStr == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "symbol, from, and to are required"})
			return
		}

		from, err1 := strconv.ParseInt(fromStr, 10, 64)
		to, err2 := strconv.ParseInt(toStr, 10, 64)
		if err1 != nil || err2 != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid from/to timestamps"})
			return
		}

		var candles []providers.Candle
		if asset == "crypto" {
			candles, _ = providerCrypto.HistoryRange(symbol, from, to)
		}

		c.JSON(http.StatusOK, gin.H{
			"symbol":  symbol,
			"asset":   asset,
			"from":    from,
			"to":      to,
			"history": candles,
		})
	})

	r.GET("/api/coins", func(c *gin.Context) {
		body, err := providerCrypto.AllCoins()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch coins"})
			return
		}
		c.Data(http.StatusOK, "application/json", body)
	})

	r.GET("/api/watchlist", func(c *gin.Context) {
		items := db.GetAll()
		c.JSON(http.StatusOK, items)
	})
}
