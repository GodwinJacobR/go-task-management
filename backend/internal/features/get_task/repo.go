package get_task

import (
	"context"
	"database/sql"
	"encoding/json"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) getTask(ctx context.Context, taskID string) (task.Task, error) {

	query := `
		SELECT task_id, user_id, parent_task_id, title, description, due_date, completed, attributes, created_at, updated_at
		FROM tasks WHERE task_id = $1
		ORDER BY created_at DESC
	`

	row := r.db.QueryRowContext(ctx, query, taskID)

	var task task.Task
	var rawAttributes json.RawMessage
	err := row.Scan(
		&task.TaskID,
		&task.UserID,
		&task.ParentTaskID,
		&task.Title,
		&task.Description,
		&task.DueDate,
		&task.Completed,
		&rawAttributes,
		&task.CreatedAt,
		&task.UpdatedAt,
	)
	if err != nil {
		return task, err
	}
	if err := json.Unmarshal(rawAttributes, &task.Attributes); err != nil {
		return task, err
	}

	return task, nil
}
