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

func (h *handler) promoteTask(ctx context.Context, taskID string) error {
	return h.repo.promoteTask(ctx, taskID)
}
