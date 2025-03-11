package get_task

import (
	"context"
	"database/sql"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
)

type handler struct {
	repo *repo
}

func NewHandler(db *sql.DB) *handler {
	return &handler{
		repo: NewRepo(db),
	}
}

func (h *handler) getTask(ctx context.Context, taskID string) (task.TaskResponse, error) {
	taskFromDB, err := h.repo.getTask(ctx, taskID)
	if err != nil {
		return task.TaskResponse{}, err
	}

	taskResponse := task.TaskResponse{
		TaskID:      taskFromDB.TaskID,
		Title:       taskFromDB.Title,
		Completed:   taskFromDB.Completed,
		Description: taskFromDB.Description,
		CreatedAt:   taskFromDB.CreatedAt,
		UpdatedAt:   taskFromDB.UpdatedAt,
	}

	return taskResponse, nil
}
