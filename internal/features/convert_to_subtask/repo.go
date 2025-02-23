package convert_to_subtask

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

func (r *repo) ConvertToSubTask(ctx context.Context, taskID, newParentTaskID string) error {
	query := `UPDATE tasks SET parent_task_id = $1 WHERE task_id = $2`
	_, err := r.db.ExecContext(ctx, query, newParentTaskID, taskID)
	return err
}
