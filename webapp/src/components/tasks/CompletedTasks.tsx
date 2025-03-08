import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';

interface CompletedTasksProps {
  tasks: TaskType[];
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

const CompletedTasks: React.FC<CompletedTasksProps> = ({
  tasks,
  onToggleTask,
  onToggleExpand,
}) => {
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

export default CompletedTasks; 