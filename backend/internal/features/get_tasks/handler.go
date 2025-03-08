package get_tasks

import (
	"context"
	"database/sql"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
)

type handler struct {
	repo *repo
}

func NewHandler(db *sql.DB) *handler {
	return &handler{
		repo: NewRepo(db),
	}
}

func (h *handler) getTasks(ctx context.Context, state string) ([]task.TaskResponse, error) {
	tasks, err := h.repo.getTasks(ctx, state)
	if err != nil {
		return []task.TaskResponse{}, err
	}

	return task.BuildTaskHierarchy(tasks), nil
}
