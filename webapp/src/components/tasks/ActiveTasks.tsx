import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';

interface ActiveTasksProps {
  tasks: TaskType[];
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

const ActiveTasks: React.FC<ActiveTasksProps> = ({
  tasks,
  onToggleTask,
  onToggleExpand,
}) => {
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
              key={task.id}
              task={task}
              onToggleTask={onToggleTask}
              onToggleExpand={onToggleExpand}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveTasks; 