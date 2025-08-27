package server

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func APIKeyMiddleware() gin.HandlerFunc {
	expectedKey := strings.TrimSpace(os.Getenv("API_KEY"))

	return func(c *gin.Context) {
		key := strings.TrimSpace(c.GetHeader("x-api-key"))
		log.Printf("API Key: '%s', Expected: '%s'", key, expectedKey)
		if key == "" || key != expectedKey {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or missing API key"})
			c.Abort()
			return
		}
		c.Next()
	}
}

type BodyWriter struct {
	gin.ResponseWriter
	Body *bytes.Buffer
}

func (w BodyWriter) Write(b []byte) (int, error) {
	w.Body.Write(b)
	return w.ResponseWriter.Write(b)
}

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var requestBody []byte
		if c.Request.Method == http.MethodPost {
			requestBody, _ = io.ReadAll(c.Request.Body)
			c.Request.Body = io.NopCloser(bytes.NewBuffer(requestBody))
		}

		bw := &BodyWriter{Body: bytes.NewBufferString(""), ResponseWriter: c.Writer}
		c.Writer = bw

		c.Next()

		log.Printf(
			"[GIN] %s | %3d | %13v | %15s | %-7s %s | Query: %s | ReqBody: %s | Resp: %s\n",
			c.Request.Method,
			c.Writer.Status(),
			c.Writer.Size(),
			c.ClientIP(),
			c.Request.Method,
			c.Request.URL.Path,
			c.Request.URL.RawQuery,
			string(requestBody),
			bw.Body.String(),
		)
	}
}
