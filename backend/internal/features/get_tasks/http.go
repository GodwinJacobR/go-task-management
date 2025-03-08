package get_tasks

import (
	"encoding/json"
	"net/http"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		state := r.URL.Query().Get("state")

		tasks, err := h.getTasks(r.Context(), state)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tasks)
	}
}
