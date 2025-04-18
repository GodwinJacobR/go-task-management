package convert_to_subtask

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

func (h *handler) convertToSubTask(ctx context.Context, taskID, newParentTaskID string) error {
	return h.repo.convertToSubTask(ctx, taskID, newParentTaskID)
}
