package promote_task

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Setup(r *mux.Router, db *sql.DB) error {
	h := NewHandler(db)

	r.HandleFunc("/promote-task/{task_id}", httpHandler(h)).Methods(http.MethodPut)
	return nil
}
