// components/Home.tsx
import React from 'react';
import { TaskList } from '../../components/tasks';
import { Task as TaskType } from '../../types';

interface HomeProps {
  tasks: TaskType[];
}

const Home: React.FC<HomeProps> = ({ tasks }) => {
  return (
    <div className="home-container">
      <header className="app-header">
        <h1>My Task List</h1>
      </header>

      <TaskList tasks={tasks} />
    </div>
  );
};

export default Home;