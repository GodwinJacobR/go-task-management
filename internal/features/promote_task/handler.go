package promote_task

import (
	"context"
	"database/sql"
)

type handler struct {
	repo *repo
}

func NewHandler(db *sql.DB) *handler {
	return &handler{
		repo: NewRepo(db),
	}
}

func (h *handler) PromoteTask(ctx context.Context, taskID string) error {
	return h.repo.PromoteTask(ctx, taskID)
}
