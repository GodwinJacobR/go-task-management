package promote_task

import (
	"context"
	"database/sql"

	"github.com/GodwinJacobR/go-todo-app/internal/domain/errors"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) PromoteTask(ctx context.Context, taskID string) error {
	query := `UPDATE tasks
		SET parent_task_id = NULL,
			updated_at = NOW()
		WHERE task_id = $1
		AND updated_at = (SELECT updated_at FROM tasks WHERE task_id = $1)`

	result, err := r.db.ExecContext(ctx, query, taskID)
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
