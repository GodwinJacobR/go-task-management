package convert_to_subtask

import (
	"encoding/json"
	"errors"
	"net/http"

	domain_errors "github.com/GodwinJacobR/go-todo-app/backend/internal/domain/errors"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {

		req := ConvertToSubTaskRequest{}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		err := h.convertToSubTask(r.Context(), req.TaskID, req.NewParentTaskID)
		if err != nil {
			if errors.Is(err, domain_errors.ErrConcurrentModification) {
				http.Error(w, "Task was modified by another user", http.StatusConflict)
				return
			}
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
