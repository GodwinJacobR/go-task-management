import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Task, TaskList, ActiveTasks, CompletedTasks, TaskDetail } from './components/tasks';
import { Task as TaskType } from './types';
import Navigation from './components/Navigation';
import { Home } from './components/Home';
import { fetchTasks } from './services/api';
import './App.css';
import './styles/tasks/Task.css';
import './styles/tasks/TaskList.css';
import './styles/tasks/TaskDetail.css';

function App() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return (
    <div className="App">
      <Navigation />
      <div className="app-container">
        {isLoading ? (
          <div className="loading-indicator">Loading tasks...</div>
        ) : (
          <Routes>
            <Route 
              path="/" 
              element={<Home tasks={tasks} refreshTasks={loadTasks} />} 
            />
            <Route 
              path="/active" 
              element={<ActiveTasks tasks={tasks} />} 
            />
            <Route 
              path="/completed" 
              element={<CompletedTasks tasks={tasks} />} 
            />
            <Route 
              path="/task/:id" 
              element={<TaskDetail tasks={tasks} />} 
            />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default App;