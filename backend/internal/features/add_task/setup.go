package add_task

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Setup(r *mux.Router, db *sql.DB) error {
	h := NewHandler(db)

	r.HandleFunc("/tasks/{task_id}", httpHandler(h)).Methods(http.MethodPost)
	return nil
}
