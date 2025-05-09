package add_task

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
)

type repo struct {
	db *sql.DB
}

func NewRepo(db *sql.DB) *repo {
	return &repo{db: db}
}

func (r *repo) addTask(ctx context.Context, task task.Task) error {
	query := `
		INSERT INTO tasks (
			task_id,
			user_id,
			title,
			description,
			due_date,
			completed,
			attributes,
			created_at,
			updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9
		)
		ON CONFLICT (task_id) DO NOTHING 
	`

	attributesJSON, err := json.Marshal(task.Attributes)
	if err != nil {
		return err
	}

	now := time.Now()

	_, err = r.db.ExecContext(ctx,
		query,
		task.TaskID,
		task.UserID,
		task.Title,
		task.Description,
		task.DueDate,
		task.Completed,
		attributesJSON,
		now,
		now,
	)

	return err
}
