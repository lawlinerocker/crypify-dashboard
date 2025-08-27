package main

import (
	"log"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"github.com/lawlinerocker/crypify/backend/internal/providers"
	"github.com/lawlinerocker/crypify/backend/internal/server"
	"github.com/lawlinerocker/crypify/backend/internal/storage"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on system environment")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	db, err := storage.Open("watchlist.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := gin.New()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "DELETE"},
		AllowHeaders: []string{"Origin", "Content-Type"},
	}))

	// Middleware
	r.Use(server.APIKeyMiddleware())
	r.Use(server.LoggingMiddleware())

	// Providers
	providerCrypto, crypToerr := providers.NewCoingeckoProvider()
	if err != nil {
		log.Fatalf("Failed to initialize Coingecko provider: %v", crypToerr)
	}

	// Routes
	server.RegisterRoutes(r, db, providerCrypto)

	log.Printf("Server running on port %s...", port)
	log.Fatal(r.Run(":" + port))
}
