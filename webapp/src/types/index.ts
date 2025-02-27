export interface Task {
  id: number;
  text: string;
  completed: boolean;
  isExpanded: boolean;
  subtasks: Task[]; // Now subtasks are of type Task instead of SubTask
}