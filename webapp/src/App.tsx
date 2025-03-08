// App.tsx
import React, { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

  useEffect(() => {
    const getTasks = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    getTasks();
  }, []);

  return (
    <div className="App">
      <Navigation />
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={<Home tasks={tasks} />} 
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
      </div>
    </div>
  );
}

export default App;