import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(`/task/${task.id}`);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking the checkbox
    onToggleTask(task.id);
  };

  return (
    <div 
      className={`task-tile ${task.completed ? 'completed' : ''}`}
      onClick={handleTaskClick}
    >
      <div className="task-tile-header">
        <div 
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleCheckboxClick}
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
        <div className="view-details-link">
          View Details
        </div>
      </div>
    </div>
  );
};

export default Task; 