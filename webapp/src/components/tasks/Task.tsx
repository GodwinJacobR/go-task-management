import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import '../../styles/tasks/Task.css';

interface TaskProps {
  task: TaskType;
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleTaskClick = () => {
    navigate(`/task/${task.taskID}`);
  };

  return (
    <div 
      className={`task-tile ${task.completed ? 'completed' : ''}`}
      onClick={handleTaskClick}
    >
      <div className="task-tile-header">
        <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
          {task.completed ? '✓' : ''}
        </div>
        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title} 
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