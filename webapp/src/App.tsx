// App.tsx
import React, { useState, FormEvent, useCallback } from 'react';
import { Task } from './components/tasks';
import { Task as TaskType } from './types';
import './styles/tasks/Task.css';
import './styles/tasks/TaskList.css';

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([
    { 
      id: 1, 
      text: 'Complete React tutorial', 
      completed: false, 
      isExpanded: false 
    },
    { 
      id: 2, 
      text: 'Learn about React Router', 
      completed: false, 
      isExpanded: false 
    },
    { 
      id: 3, 
      text: 'Build a todo application', 
      completed: false, 
      isExpanded: false 
    }
  ]);

  const [newTask, setNewTask] = useState<string>('');
  const [nextId, setNextId] = useState<number>(4);

  // Add new top-level task
  const addTask = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      const currentId = nextId;
      setTasks(prevTasks => [
        ...prevTasks,
        { 
          id: currentId, 
          text: newTask, 
          completed: false,
          isExpanded: false 
        }
      ]);
      setNextId(currentId + 1);
      setNewTask('');
    }
  }, [newTask, nextId]);

  // Toggle task completion status
  const toggleTask = useCallback((id: number): void => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? {...task, completed: !task.completed}
          : task
      )
    );
  }, []);

  // Toggle expand/collapse of task
  const toggleExpand = useCallback((id: number): void => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? {...task, isExpanded: !task.isExpanded}
          : task
      )
    );
  }, []);

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>My Task List</h1>
          <form onSubmit={addTask} className="add-task-form">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task"
              className="add-task-input"
            />
            <button 
              type="submit" 
              className="add-task-button"
              disabled={newTask.trim() === ''}
            >
              Add Task
            </button>
          </form>
        </header>

        <div className="tasks-grid">
          {tasks.length === 0 ? (
            <p className="no-tasks-message">No tasks yet. Add a task to get started!</p>
          ) : (
            tasks.map(task => (
              <Task
                key={task.id}
                task={task}
                onToggleTask={toggleTask}
                onToggleExpand={toggleExpand}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;