export interface Task {
    taskID: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    subTasks: Task[];
  } 