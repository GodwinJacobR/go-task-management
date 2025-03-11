package accept_test

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
	"github.com/google/uuid"
)

func TestPromoteTask(t *testing.T) {
	t.Run("successful task promotion", func(t *testing.T) {
		taskID := uuid.New().String()
		taskData := task.Task{
			TaskID:      taskID,
			UserID:      uuid.New().String(),
			Title:       "Task to Promote",
			Description: "This task will be promoted",
		}

		createResp := createTask(t, taskID, taskData)
		if createResp.StatusCode != http.StatusCreated {
			t.Fatalf("Failed to create task for promotion test: %d", createResp.StatusCode)
		}

		promoteResp := promoteTask(t, taskID)

		if promoteResp.StatusCode != http.StatusCreated {
			t.Errorf("Expected status %d for promotion, got %d", http.StatusCreated, promoteResp.StatusCode)
		}

		verifyTaskPromoted(t, taskID)
	})

}

func promoteTask(t *testing.T, taskID string) *http.Response {
	url := fmt.Sprintf("%s/promote-task/%s", serverURL, taskID)
	req, err := http.NewRequestWithContext(context.Background(), http.MethodPut, url, nil)
	if err != nil {
		t.Fatalf("Failed to create promote request: %v", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send promote request: %v", err)
	}

	return resp
}

func verifyTaskPromoted(t *testing.T, taskID string) {
	time.Sleep(100 * time.Millisecond)

	getResp, err := http.Get(fmt.Sprintf("%s/tasks/%s", serverURL, taskID))
	if err != nil {
		t.Fatalf("Failed to get promoted task: %v", err)
	}
	defer getResp.Body.Close()

	if getResp.StatusCode != http.StatusOK {
		t.Errorf("Failed to retrieve promoted task, status: %d", getResp.StatusCode)
	}

	var promotedTask task.Task
	if err := json.NewDecoder(getResp.Body).Decode(&promotedTask); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
}
