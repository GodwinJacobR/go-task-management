// components/Home.tsx
import React, { useState, FormEvent } from 'react';
import { TaskList } from '../../components/tasks';
import { Task as TaskType } from '../../types';

interface HomeProps {
  tasks: TaskType[];
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
  onAddTask: (text: string) => void;
}

const Home: React.FC<HomeProps> = ({ 
  tasks, 
  onToggleTask, 
  onToggleExpand,
  onAddTask 
}) => {
  const [newTask, setNewTask] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTask.trim() !== '') {
      onAddTask(newTask);
      setNewTask('');
    }
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>My Task List</h1>
        <form onSubmit={handleSubmit} className="add-task-form">
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

      <TaskList 
        tasks={tasks} 
        onToggleTask={onToggleTask} 
        onToggleExpand={onToggleExpand} 
      />
    </div>
  );
};

export default Home;