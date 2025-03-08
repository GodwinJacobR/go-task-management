// App.tsx
import React, { useState, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Task, TaskList, ActiveTasks, CompletedTasks, TaskDetail } from './components/tasks';
import { Task as TaskType } from './types';
import Navigation from './components/Navigation';
import { Home } from './components/Home';
import './styles/tasks/Task.css';
import './styles/tasks/TaskList.css';
import './styles/tasks/TaskDetail.css';

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

  const [nextId, setNextId] = useState<number>(4);
  const navigate = useNavigate();

  // Add new top-level task
  const addTask = useCallback((text: string) => {
    const currentId = nextId;
    setTasks(prevTasks => [
      ...prevTasks,
      { 
        id: currentId, 
        text: text, 
        completed: false,
        isExpanded: false 
      }
    ]);
    setNextId(currentId + 1);
  }, [nextId]);

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
      <Navigation />
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                tasks={tasks} 
                onToggleTask={toggleTask} 
                onToggleExpand={toggleExpand}
                onAddTask={addTask}
              />
            } 
          />
          <Route 
            path="/active" 
            element={
              <ActiveTasks 
                tasks={tasks} 
                onToggleTask={toggleTask} 
                onToggleExpand={toggleExpand} 
              />
            } 
          />
          <Route 
            path="/completed" 
            element={
              <CompletedTasks 
                tasks={tasks} 
                onToggleTask={toggleTask} 
                onToggleExpand={toggleExpand} 
              />
            } 
          />
          <Route 
            path="/task/:id" 
            element={
              <TaskDetail 
                tasks={tasks} 
                onToggleTask={toggleTask} 
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;