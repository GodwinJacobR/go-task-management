package db

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Db struct {
	inner *sql.DB
}

func New() (*Db, error) {
	db, err := sql.Open("postgres", "")
	if err != nil {
		return nil, err
	}

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
