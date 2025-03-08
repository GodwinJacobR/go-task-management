import { Task } from '../types';

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

export const addTask = async (text: string): Promise<Task> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error(`Error adding task: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};
