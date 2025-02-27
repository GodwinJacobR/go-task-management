import React, { useState, FormEvent } from 'react';
import Task from './components/Task';
import { Task as TaskType } from './types';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([
    { 
      id: 1, 
      text: 'Complete React tutorial', 
      completed: false, 
      subtasks: [],
      isExpanded: false 
    },
  ]);

  const [newTask, setNewTask] = useState<string>('');
  const [nextId, setNextId] = useState<number>(2);

  const addTask = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      setTasks([
        ...tasks,
        { 
          id: nextId, 
          text: newTask, 
          completed: false,
          subtasks: [],
          isExpanded: false 
        }
      ]);
      setNextId(nextId + 1);
      setNewTask('');
    }
  };

  const toggleTask = (id: number): void => {
    const toggleTaskRecursive = (tasks: TaskType[]): TaskType[] => {
      return tasks.map(task => {
        if (task.id === id) {
          return {
            ...task,
            completed: !task.completed,
            subtasks: task.subtasks.map(subtask => ({
              ...subtask,
              completed: !task.completed
            }))
          };
        }
        return {
          ...task,
          subtasks: toggleTaskRecursive(task.subtasks)
        };
      });
    };

    setTasks(toggleTaskRecursive(tasks));
  };

  const toggleExpand = (id: number): void => {
    const toggleExpandRecursive = (tasks: TaskType[]): TaskType[] => {
      return tasks.map(task => {
        if (task.id === id) {
          return { ...task, isExpanded: !task.isExpanded };
        }
        return {
          ...task,
          subtasks: toggleExpandRecursive(task.subtasks)
        };
      });
    };

    setTasks(toggleExpandRecursive(tasks));
  };

  const addSubtask = (parentId: number, text: string): void => {
    const addSubtaskRecursive = (tasks: TaskType[]): TaskType[] => {
      return tasks.map(task => {
        if (task.id === parentId) {
          return {
            ...task,
            subtasks: [
              ...task.subtasks,
              {
                id: nextId,
                text,
                completed: false,
                subtasks: [],
                isExpanded: false
              }
            ]
          };
        }
        return {
          ...task,
          subtasks: addSubtaskRecursive(task.subtasks)
        };
      });
    };

    setTasks(addSubtaskRecursive(tasks));
    setNextId(nextId + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>My Task List</h1>
        
        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
          />
          <button type="submit">Add Task</button>
        </form>

        <ul className="task-list">
          {tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onToggleTask={toggleTask}
              onToggleExpand={toggleExpand}
              onAddSubtask={addSubtask}
            />
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;