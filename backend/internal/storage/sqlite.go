package storage

import (
    "database/sql"
    _ "modernc.org/sqlite"
)

type DB struct { *sql.DB }

func Open(path string) (*DB,error) {
    db,_ := sql.Open("sqlite", path)
    db.Exec("CREATE TABLE IF NOT EXISTS watchlist (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL, asset TEXT NOT NULL);")
    return &DB{db},nil
}

type WatchItem struct {
    ID int `json:"id"`
    Symbol string `json:"symbol"`
    Asset string `json:"asset"`
}

func (db *DB) GetAll() []WatchItem {
    rows,_ := db.Query("SELECT id,symbol,asset FROM watchlist")
    defer rows.Close()
    var items []WatchItem
    for rows.Next() {
        var w WatchItem
        rows.Scan(&w.ID,&w.Symbol,&w.Asset)
        items = append(items,w)
    }
    return items
}
