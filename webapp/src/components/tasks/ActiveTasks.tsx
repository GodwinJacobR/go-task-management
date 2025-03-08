import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';

interface ActiveTasksProps {
  tasks: TaskType[];
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({ tasks }) => {
  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <div className="active-tasks-container">
      <header className="app-header">
        <h1>Active Tasks</h1>
      </header>

      <div className="tasks-grid">
        {activeTasks.length === 0 ? (
          <p className="no-tasks-message">No active tasks. All tasks are completed!</p>
        ) : (
          activeTasks.map(task => (
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

export default ActiveTasks; 