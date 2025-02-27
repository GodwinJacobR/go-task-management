package convert_to_subtask

import (
	"context"
	"database/sql"

	"github.com/GodwinJacobR/go-task-manager/internal/domain/errors"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) ConvertToSubTask(ctx context.Context, taskID, newParentTaskID string) error {
	query := `UPDATE tasks
		SET parent_task_id = $1,
			updated_at = NOW()
		WHERE task_id = $2
		AND updated_at = (SELECT updated_at FROM tasks WHERE task_id = $2)`

	result, err := r.db.ExecContext(ctx, query, newParentTaskID, taskID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.ErrConcurrentModification
	}

	return nil
}

// ... existing code ...
