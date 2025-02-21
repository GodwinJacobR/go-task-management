package get_tasks

import "database/sql"

type handler struct {
	db *sql.DB
}

func NewHandler(db *sql.DB) *handler {
	return &handler{db: db}
}
