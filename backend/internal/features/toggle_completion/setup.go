package toggle_completion

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Setup(r *mux.Router, db *sql.DB) error {
	h := NewHandler(db)

	r.HandleFunc("/tasks/{task_id}/toggle-completion", httpHandler(h)).Methods(http.MethodPut)
	return nil
}
