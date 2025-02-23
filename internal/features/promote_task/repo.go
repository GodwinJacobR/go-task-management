package promote_task

import (
	"context"
	"database/sql"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) PromoteTask(ctx context.Context, taskID string) error {
	query := `UPDATE tasks SET parent_task_id = NULL WHERE task_id = $1`
	_, err := r.db.ExecContext(ctx, query, taskID)
	return err
}
