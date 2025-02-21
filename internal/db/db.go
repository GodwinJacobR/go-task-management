package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type Db struct {
	inner *sql.DB
}

func New() (*Db, error) {
	// TODO get from config
	db, err := sql.Open("postgres", "postgres://postgres:postgres@localhost:8888/app_db?sslmode=disable")
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("could not ping database: %w", err)
	}

	// Run migrations

	// Configure connection pool

	return &Db{inner: db}, nil
}

func (d *Db) Close() error {
	return d.inner.Close()
}

func (d *Db) GetDB() *sql.DB {
	if d.inner == nil {
		db, _ := New()
		d.inner = db.inner
	}
	return d.inner
}
