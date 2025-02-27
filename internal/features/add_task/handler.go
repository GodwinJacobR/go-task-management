package add_task

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

func (h *handler) AddTask(ctx context.Context, task task.Task) error {
	return h.repo.AddTask(ctx, task)
}
