package promote_task

import (
	"errors"
	"net/http"

	domain_errors "github.com/GodwinJacobR/go-task-manager/internal/domain/errors"
	"github.com/gorilla/mux"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		taskID := mux.Vars(r)["task_id"]
		err := h.PromoteTask(r.Context(), taskID)
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
