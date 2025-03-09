package get_task

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		taskID := mux.Vars(r)["task_id"]

		tasks, err := h.getTask(r.Context(), taskID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(tasks)
	}
}
