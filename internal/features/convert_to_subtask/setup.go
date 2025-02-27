package convert_to_subtask

import (
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

func Setup(r *mux.Router, db *sql.DB) error {
	h := NewHandler(db)

	r.HandleFunc("/convert-to-subtask", httpHandler(h)).Methods(http.MethodPut)
	return nil
}
