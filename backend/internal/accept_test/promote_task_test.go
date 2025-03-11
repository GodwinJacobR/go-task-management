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

	t.Run("parallel promotion requests don't create locks", func(t *testing.T) {
		const numTasks = 100
		taskIDs := make([]string, numTasks)

		for i := 0; i < numTasks; i++ {
			taskID := uuid.New().String()
			taskIDs[i] = taskID

			taskData := task.Task{
				TaskID:      taskID,
				UserID:      uuid.New().String(),
				Title:       fmt.Sprintf("Parallel Task %d", i),
				Description: "This task will be promoted in parallel",
			}

			createResp := createTask(t, taskID, taskData)
			if createResp.StatusCode != http.StatusCreated {
				t.Fatalf("Failed to create task %d for parallel promotion test: %d", i, createResp.StatusCode)
			}
		}

		type promotionResult struct {
			taskID int
			status int
			err    error
		}
		resultChan := make(chan promotionResult, numTasks)

		for i := 0; i < numTasks; i++ {
			go func(index int, id string) {
				resp := promoteTask(t, id)
				resultChan <- promotionResult{
					taskID: index,
					status: resp.StatusCode,
					err:    nil,
				}
			}(i, taskIDs[i])
		}

		successCount := 0
		for i := 0; i < numTasks; i++ {
			result := <-resultChan
			if result.err != nil {
				t.Errorf("Task %d promotion failed with error: %v", result.taskID, result.err)
				continue
			}

			if result.status != http.StatusCreated && result.status != http.StatusConflict {
				t.Errorf("Task %d promotion returned unexpected status: %d", result.taskID, result.status)
				continue
			}

			successCount++
		}

		if successCount != numTasks {
			t.Errorf("Expected %d successful promotions, got %d", numTasks, successCount)
		}

		for _, taskID := range taskIDs {
			verifyTaskPromoted(t, taskID)
		}
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
