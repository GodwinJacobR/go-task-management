export interface Task {
    taskID: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
    subTasks: Task[];
  } 


  export interface CreateTaskRequest {
    userid: string;
    title: string;
    description: string;
  } 