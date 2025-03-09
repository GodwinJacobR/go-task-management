// components/Home.tsx
import React, { useState, useEffect } from 'react';
import { TaskList } from '../../components/tasks';
import { Task as TaskType } from '../../types';
import { getMouseTrackingService, UserPosition, ConnectionStatus } from '../../services/websocket';
import { addTask } from '../../services/api';
import './Home.css';

interface HomeProps {
  tasks: TaskType[];
  refreshTasks: () => Promise<void>;
}

interface MousePosition {
  x: number;
  y: number;
}

const Home: React.FC<HomeProps> = ({ tasks, refreshTasks }) => {
  const mouseTrackingService = React.useMemo(() => getMouseTrackingService(), []);
  
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [otherUsers, setOtherUsers] = useState<UserPosition[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const currentUserId = mouseTrackingService.getUserId();
  
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mouseTrackingService.connect();

    const handlePositionsUpdate = (positions: UserPosition[]) => {
      const others = positions.filter(pos => pos.userId !== currentUserId);
      console.log('Other users:', others.length, others);
      setOtherUsers(others);
    };

    const handleStatusUpdate = (status: ConnectionStatus) => {
      setConnectionStatus(status);
    };

    mouseTrackingService.addPositionListener(handlePositionsUpdate);
    mouseTrackingService.addStatusListener(handleStatusUpdate);

    return () => {
      mouseTrackingService.removePositionListener(handlePositionsUpdate);
      mouseTrackingService.removeStatusListener(handleStatusUpdate);
      mouseTrackingService.disconnect();
    };
  }, [mouseTrackingService, currentUserId]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const newPosition = {
        x: event.clientX,
        y: event.clientY
      };
      
      setMousePosition(newPosition);
      
      mouseTrackingService.sendMousePosition(newPosition.x, newPosition.y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseTrackingService]);

  const formatUserId = (userId: string) => {
    return userId.substring(0, 8);
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTING:
        return 'Connecting...';
      case ConnectionStatus.CONNECTED:
        return 'Connected';
      case ConnectionStatus.DISCONNECTED:
        return 'Disconnected';
      case ConnectionStatus.ERROR:
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await addTask(newTaskTitle);
      setNewTaskTitle('');
      
      // Refresh the task list
      await refreshTasks();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <h1>My Task List</h1>
        <div className="mouse-tracker-controls">
          <div className={`connection-status status-${connectionStatus}`}>
            Status: {getConnectionStatusText()}
          </div>
          <div className="users-count">
            Other Users: {otherUsers.length}
          </div>
          <div className="current-user-id">
            Your ID: {formatUserId(currentUserId)}
          </div>
        </div>
      </header>

      <div className="task-creation-container">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmitTask} className="task-form">
          <div className="form-group">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title..."
              className="task-input"
              disabled={isSubmitting}
            />
            <button 
              type="submit" 
              className="task-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Add Task'}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>

      <TaskList tasks={tasks} />

      <div 
        className="mouse-indicator current-user"
        style={{
          position: 'fixed',
          left: mousePosition.x,
          top: mousePosition.y,
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 0, 0, 0.7)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998
        }}
      >
        <div className="user-tooltip always-visible">
          You
        </div>
      </div>

      {otherUsers.map((user) => (
        <div 
          key={user.userId}
          className="mouse-indicator other-user user-id-display"
          style={{
            position: 'fixed',
            left: user.longitude,
            top: user.latitude,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9997
          }}
        >
          {formatUserId(user.userId)}
        </div>
      ))}
    </div>
  );
};

export default Home;