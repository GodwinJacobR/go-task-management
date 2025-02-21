package get_tasks

import (
	"database/sql"

	"github.com/gorilla/mux"
)

func Setup(r *mux.Router, db *sql.DB) error {
	h := NewHandler(db)

	r.HandleFunc("/tasks", httpHandler(h)).Methods("GET")
	return nil
}
