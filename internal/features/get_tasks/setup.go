package get_tasks

import "github.com/gorilla/mux"

func Setup(r *mux.Router) error {
	h := NewHandler(nil)

	r.HandleFunc("/tasks", httpHandler(h)).Methods("GET")
	return nil
}
