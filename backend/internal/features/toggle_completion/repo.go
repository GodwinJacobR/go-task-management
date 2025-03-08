package toggle_completion

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

func (r *repo) markAsCompleted(ctx context.Context, taskID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	parentQuery := `
		UPDATE tasks
		SET completed = true, updated_at = NOW()
		WHERE task_id = $1
	`
	_, err = tx.ExecContext(ctx, parentQuery, taskID)
	if err != nil {
		return err
	}

	subtasksQuery := `
		WITH RECURSIVE task_tree AS (
			-- Base case: the direct children of the specified task
			SELECT task_id, parent_task_id
			FROM tasks
			WHERE parent_task_id = $1
			UNION ALL
			-- Recursive case: children of children
			SELECT t.task_id, t.parent_task_id
			FROM tasks t
			JOIN task_tree tt ON t.parent_task_id = tt.task_id
		)
		UPDATE tasks
		SET completed = true, updated_at = NOW()
		WHERE task_id IN (SELECT task_id FROM task_tree)
	`
	_, err = tx.ExecContext(ctx, subtasksQuery, taskID)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func (r *repo) markAsIncomplete(ctx context.Context, taskID string) error {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	defer tx.Rollback()

	parentQuery := `
		UPDATE tasks
		SET completed = false, updated_at = NOW()
		WHERE task_id = $1
	`
	_, err = tx.ExecContext(ctx, parentQuery, taskID)
	if err != nil {
		return err
	}

	subtasksQuery := `
		WITH RECURSIVE task_tree AS (
			-- Base case: the direct children of the specified task
			SELECT task_id, parent_task_id
			FROM tasks
			WHERE parent_task_id = $1
			
			UNION ALL
			
			-- Recursive case: children of children
			SELECT t.task_id, t.parent_task_id
			FROM tasks t
			JOIN task_tree tt ON t.parent_task_id = tt.task_id
		)
		UPDATE tasks
		SET completed = false, updated_at = NOW()
		WHERE task_id IN (SELECT task_id FROM task_tree)
	`
	_, err = tx.ExecContext(ctx, subtasksQuery, taskID)
	if err != nil {
		return err
	}

	return tx.Commit()
}
