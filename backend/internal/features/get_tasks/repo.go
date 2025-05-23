package get_tasks

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) getTasks(ctx context.Context, state string) ([]task.Task, error) {

	query := `
		SELECT  task_id, user_id, parent_task_id, title, description, due_date, completed, attributes, created_at, updated_at
		FROM tasks
		ORDER BY created_at DESC
	`

	// TODO maybe split this into different funcs ?
	if strings.EqualFold(state, "completed") {
		query = `
		SELECT  task_id, user_id, parent_task_id, title, description, due_date, completed, attributes, created_at, updated_at
		FROM tasks
		WHERE completed = true
		ORDER BY created_at DESC
	`
	}

	if strings.EqualFold(state, "active") {
		query = `
		SELECT  task_id, user_id, parent_task_id, title, description, due_date, completed, attributes, created_at, updated_at
		FROM tasks
		WHERE completed = false
		ORDER BY created_at DESC
	`
	}

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []task.Task
	var rawAttributes json.RawMessage
	for rows.Next() {

		var task task.Task
		err := rows.Scan(
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
			return nil, err
		}
		if err := json.Unmarshal(rawAttributes, &task.Attributes); err != nil {
			return nil, err
		}

		tasks = append(tasks, task)
	}
	return tasks, nil
}
