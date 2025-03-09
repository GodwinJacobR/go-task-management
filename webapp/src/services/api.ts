import { Task, CreateTaskRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';


const API_BASE_URL = 'http://localhost:3001';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    
    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as Task[];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const addTask = async (task: CreateTaskRequest): Promise<void> => {
  try {
    const taskID = uuidv4();
    const response = await fetch(`${API_BASE_URL}/tasks/${taskID}`, {
      method: 'POST',      
      body: JSON.stringify(task),
    });
    
    if (!response.ok) {
      throw new Error(`Error adding task: ${response.statusText}`);
    }
    
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};
