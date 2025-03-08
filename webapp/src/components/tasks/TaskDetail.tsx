import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import '../../styles/tasks/TaskDetail.css';

interface TaskDetailProps {
  tasks: TaskType[];
  onToggleTask: (id: number) => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ tasks, onToggleTask }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const taskId = parseInt(id || '0', 10);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <div className="task-detail-container">
        <div className="task-detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            &larr; Back
          </button>
          <h1>Task Not Found</h1>
        </div>
        <div className="task-detail-content">
          <p>The task you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-detail-container">
      <div className="task-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
        <h1>Task Details</h1>
      </div>
      
      <div className="task-detail-content">
        <div className="task-detail-card">
          <div className="task-detail-status">
            <div 
              className={`task-checkbox large ${task.completed ? 'checked' : ''}`}
              onClick={() => onToggleTask(task.id)}
            >
              {task.completed ? '✓' : ''}
            </div>
            <span className="task-status-label">
              {task.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <h2 className={`task-detail-title ${task.completed ? 'completed' : ''}`}>
            {task.text}
          </h2>
          
          <div className="task-detail-meta">
            <p>Task ID: {task.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 