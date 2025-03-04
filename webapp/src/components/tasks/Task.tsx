import React from 'react';
import { Task as TaskType } from '../../types';
import '../../styles/tasks/Task.css';

interface TaskProps {
  task: TaskType;
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  onToggleTask,
  onToggleExpand,
}) => {
  return (
    <div className="task-tile">
      <div className="task-tile-header">
        <div 
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleTask(task.id)}
        >
          {task.completed ? '✓' : ''}
        </div>
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.text}
        </h3>
      </div>
      
      <div className="task-tile-content">
        <div className="task-status-badge">
          {task.completed ? 'Completed' : 'In Progress'}
        </div>
      </div>
    </div>
  );
};

export default Task; 