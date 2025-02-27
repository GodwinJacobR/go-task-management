package add_task

import (
	"encoding/json"
	"net/http"

	"github.com/GodwinJacobR/go-todo-app/internal/domain/task"
	"github.com/gorilla/mux"
)

func httpHandler(h *handler) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		taskID := mux.Vars(r)["task_id"]

		newTask := task.Task{
			TaskID: taskID,
		}
		if err := json.NewDecoder(r.Body).Decode(&newTask); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := h.AddTask(r.Context(), newTask); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
	}
}
