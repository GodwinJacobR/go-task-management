package toggle_completion

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

func (h *handler) markAsCompleted(ctx context.Context, taskID string) error {
	return h.repo.markAsCompleted(ctx, taskID)
}

func (h *handler) markAsIncomplete(ctx context.Context, taskID string) error {
	return h.repo.markAsIncomplete(ctx, taskID)
}
