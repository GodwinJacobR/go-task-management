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

func TestToggleTaskCompletion(t *testing.T) {
	t.Run("successful task completion toggle", func(t *testing.T) {
		taskID := uuid.New().String()
		taskData := task.Task{
			TaskID:      taskID,
			UserID:      uuid.New().String(),
			Title:       "Task to Toggle",
			Description: "This task's completion will be toggled",
		}

		createResp := createTask(t, taskID, taskData)
		if createResp.StatusCode != http.StatusCreated {
			t.Fatalf("Failed to create task for toggle completion test: %d", createResp.StatusCode)
		}

		toggleResp := toggleTaskCompletion(t, taskID, "completed")

		if toggleResp.StatusCode != http.StatusOK {
			t.Errorf("Expected status %d for toggle completion, got %d", http.StatusOK, toggleResp.StatusCode)
		}

		verifyTaskCompletionToggled(t, taskID, true)

		toggleResp = toggleTaskCompletion(t, taskID, "open")

		if toggleResp.StatusCode != http.StatusOK {
			t.Errorf("Expected status %d for second toggle completion, got %d", http.StatusOK, toggleResp.StatusCode)
		}

		verifyTaskCompletionToggled(t, taskID, false)
	})

}

func toggleTaskCompletion(t *testing.T, taskID string, new_state string) *http.Response {
	url := fmt.Sprintf("%s/tasks/%s/toggle-completion?new_state=%s", serverURL, taskID, new_state)
	req, err := http.NewRequestWithContext(context.Background(), http.MethodPut, url, nil)
	if err != nil {
		t.Fatalf("Failed to create toggle completion request: %v", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send toggle completion request: %v", err)
	}

	return resp
}

func verifyTaskCompletionToggled(t *testing.T, taskID string, expectedCompletionStatus bool) {
	time.Sleep(100 * time.Millisecond)

	getResp, err := http.Get(fmt.Sprintf("%s/tasks/%s", serverURL, taskID))
	if err != nil {
		t.Fatalf("Failed to get task after toggle: %v", err)
	}
	defer getResp.Body.Close()

	if getResp.StatusCode != http.StatusOK {
		t.Errorf("Failed to retrieve task after toggle, status: %d", getResp.StatusCode)
	}

	var toggledTask task.Task
	if err := json.NewDecoder(getResp.Body).Decode(&toggledTask); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if toggledTask.Completed != expectedCompletionStatus {
		t.Errorf("Task completion status not toggled correctly. Expected: %v, got: %v",
			expectedCompletionStatus, toggledTask.Completed)
	}
}
