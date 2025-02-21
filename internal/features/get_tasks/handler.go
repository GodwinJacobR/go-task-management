package get_tasks

import (
	"database/sql"
	"net/http"

	"github.com/GodwinJacobR/go-todo-app/internal/domain/task"
)

type handler struct {
	repo *repo
}

func NewHandler(db *sql.DB) *handler {
	return &handler{
		repo: NewRepo(db),
	}
}

func (h *handler) GetTasks(w http.ResponseWriter, r *http.Request) ([]task.TaskResponse, error) {
	tasks, err := h.repo.GetTasks(r.Context())
	if err != nil {
		return []task.TaskResponse{}, err
	}

	return task.BuildTaskHierarchy(tasks), nil
}
