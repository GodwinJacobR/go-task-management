package promote_task

type ConvertToSubTaskRequest struct {
	TaskID          string `json:"task_id"`
	NewParentTaskID string `json:"new_parent_task_id"`
}
