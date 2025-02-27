package convert_to_subtask

type ConvertToSubTaskRequest struct {
	TaskID          string `json:"task_id"`
	NewParentTaskID string `json:"new_parent_task_id"`
}
