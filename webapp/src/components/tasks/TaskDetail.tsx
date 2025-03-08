import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import { formatTimestamp, getRelativeTime } from '../../utils/dateUtils';
import '../../styles/tasks/TaskDetail.css';

interface TaskDetailProps {
  tasks: TaskType[];
}

const TaskDetail: React.FC<TaskDetailProps> = ({ tasks }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const taskId = id || '0';
  const task = tasks.find(t => t.taskID === taskId);

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
            <div className={`task-checkbox large ${task.completed ? 'checked' : ''}`}>
              {task.completed ? '✓' : ''}
            </div>
            <span className="task-status-label">
              {task.completed ? 'Completed' : 'In Progress'}
            </span>
          </div>
          
          <h2 className={`task-detail-title ${task.completed ? 'completed' : ''}`}>
            {task.title}
          </h2>
          
          <div className="task-detail-meta">
            <p>Task ID: {task.taskID}</p>
            <p>Created: <span title={formatTimestamp(task.createdAt)}>{getRelativeTime(task.createdAt)}</span></p>
            <p>Last Updated: <span title={formatTimestamp(task.updatedAt)}>{getRelativeTime(task.updatedAt)}</span></p>
          </div>

          {task.subTasks && task.subTasks.length > 0 && (
            <div className="task-detail-subtasks">
              <h3>Subtasks</h3>
              <ul className="subtasks-list">
                {task.subTasks.map(subtask => (
                  <li key={subtask.taskID} className={subtask.completed ? 'completed' : ''}>
                    <div className={`task-checkbox small ${subtask.completed ? 'checked' : ''}`}>
                      {subtask.completed ? '✓' : ''}
                    </div>
                    <span>{subtask.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 