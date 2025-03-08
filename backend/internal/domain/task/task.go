package task

import "time"

type Task struct {
	TaskID       string
	UserID       string
	ParentTaskID *string
	Title        string
	Description  string
	DueDate      time.Time
	Completed    bool
	Attributes   map[string]interface{}
	CreatedAt    time.Time
	UpdatedAt    time.Time
	SubTasks     []Task
}

// TODO use postgres recursive query to get tasks with subtasks instead of doing it in memory
func BuildTaskHierarchy(tasks []Task) []TaskResponse {
	childrenMap := make(map[string][]Task)
	for _, task := range tasks {
		if task.ParentTaskID != nil {
			childrenMap[*task.ParentTaskID] = append(childrenMap[*task.ParentTaskID], task)
		}
	}

	var rootTasks []Task
	for _, task := range tasks {
		if task.ParentTaskID == nil {
			rootTasks = append(rootTasks, task)
		}
	}

	return buildSubTasks(rootTasks, childrenMap)
}

func buildSubTasks(tasks []Task, childrenMap map[string][]Task) []TaskResponse {
	result := make([]TaskResponse, len(tasks))

	for i, task := range tasks {
		response := TaskResponse{
			TaskID:       task.TaskID,
			UserID:       task.UserID,
			ParentTaskID: task.ParentTaskID,
			Title:        task.Title,
			Description:  task.Description,
			CreatedAt:    task.CreatedAt,
			DueDate:      task.DueDate,
			Completed:    task.Completed,
			Attributes:   task.Attributes,
			UpdatedAt:    task.UpdatedAt,
		}

		if children, exists := childrenMap[task.TaskID]; exists {
			response.SubTasks = buildSubTasks(children, childrenMap)
		}

		result[i] = response
	}

	return result
}

type TaskResponse struct {
	TaskID       string                 `json:"taskID"`
	UserID       string                 `json:"userID"`
	ParentTaskID *string                `json:"parentTaskID"`
	Title        string                 `json:"title"`
	Description  string                 `json:"description"`
	DueDate      time.Time              `json:"dueDate"`
	Completed    bool                   `json:"completed"`
	Attributes   map[string]interface{} `json:"attributes"`
	CreatedAt    time.Time              `json:"createdAt"`
	UpdatedAt    time.Time              `json:"updatedAt"`
	SubTasks     []TaskResponse         `json:"subTasks"`
}
