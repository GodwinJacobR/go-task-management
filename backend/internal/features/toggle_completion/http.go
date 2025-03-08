package toggle_completion

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		taskID := mux.Vars(r)["task_id"]
		new_state := r.URL.Query().Get("new_state")

		var err error
		if strings.EqualFold(new_state, "completed") {
			err = h.markAsCompleted(r.Context(), taskID)
		} else {
			err = h.markAsIncomplete(r.Context(), taskID)
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]bool{"success": true})
	}
}
