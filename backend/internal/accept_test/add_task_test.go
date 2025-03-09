package accept_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"testing"
	"time"

	"github.com/GodwinJacobR/go-todo-app/backend/internal/domain/task"
	"github.com/google/uuid"
)

func TestAddTask(t *testing.T) {
	t.Run("successful task creation", func(t *testing.T) {
		taskID := uuid.New().String()
		taskData := task.Task{
			TaskID:      taskID,
			UserID:      uuid.New().String(),
			Title:       "Test Task",
			Description: "This is a new task",
		}
		expectedStatus := http.StatusCreated

		// Create the task
		resp := createTask(t, taskID, taskData)

		// Check status code
		if resp.StatusCode != expectedStatus {
			t.Errorf("Expected status %d, got %d", expectedStatus, resp.StatusCode)
		}

		// Verify the task was created correctly
		verifyTaskExists(t, taskID, taskData)
	})

}

// TestAddTaskInvalidBody tests adding a task with invalid request body
func TestAddTaskInvalidBody(t *testing.T) {
	invalidJSON := []byte(`{"title": "Invalid JSON`)

	url := fmt.Sprintf("%s/tasks/invalid-json-task", serverURL)
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(invalidJSON))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}

func createTask(t *testing.T, taskID string, taskData task.Task) *http.Response {
	reqBody, err := json.Marshal(taskData)
	if err != nil {
		t.Fatalf("Failed to marshal request body: %v", err)
	}

	url := fmt.Sprintf("%s/tasks/%s", serverURL, taskID)
	req, err := http.NewRequestWithContext(context.Background(), http.MethodPost, url, bytes.NewBuffer(reqBody))
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to send request: %v", err)
	}

	return resp
}

func verifyTaskExists(t *testing.T, taskID string, expectedTask task.Task) {
	time.Sleep(100 * time.Millisecond)

	getResp, err := http.Get(fmt.Sprintf("%s/tasks/%s", serverURL, taskID))
	if err != nil {
		t.Fatalf("Failed to get created task: %v", err)
	}
	defer getResp.Body.Close()

	if getResp.StatusCode != http.StatusOK {
		t.Errorf("Failed to retrieve created task, status: %d", getResp.StatusCode)
	}

	var createdTask task.Task
	if err := json.NewDecoder(getResp.Body).Decode(&createdTask); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if createdTask.TaskID != expectedTask.TaskID {
		t.Errorf("Expected TaskID %s, got %s", expectedTask.TaskID, createdTask.TaskID)
	}
	if createdTask.Title != expectedTask.Title {
		t.Errorf("Expected Title %s, got %s", expectedTask.Title, createdTask.Title)
	}
	if createdTask.Description != expectedTask.Description {
		t.Errorf("Expected Description %s, got %s", expectedTask.Description, createdTask.Description)
	}
}
