package get_tasks

import (
	"context"
	"database/sql"

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

func (h *handler) GetTasks(ctx context.Context) ([]task.TaskResponse, error) {
	tasks, err := h.repo.GetTasks(ctx)
	if err != nil {
		return []task.TaskResponse{}, err
	}

	return task.BuildTaskHierarchy(tasks), nil
}
