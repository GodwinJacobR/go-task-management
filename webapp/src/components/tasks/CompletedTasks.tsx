import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';

interface CompletedTasksProps {
  tasks: TaskType[];
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({ tasks }) => {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="completed-tasks-container">
      <header className="app-header">
        <h1>Completed Tasks</h1>
      </header>

      <div className="tasks-grid">
        {completedTasks.length === 0 ? (
          <p className="no-tasks-message">No completed tasks yet.</p>
        ) : (
          completedTasks.map(task => (
            <Task
              key={task.taskID}
              task={task}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedTasks; 