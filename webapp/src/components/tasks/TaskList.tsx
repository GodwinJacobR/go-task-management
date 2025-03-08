import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';
import '../../styles/tasks/TaskList.css';

interface TaskListProps {
  tasks: TaskType[];
}

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="tasks-grid">
      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks yet.</p>
      ) : (
        tasks.map(task => (
          <Task
            key={task.taskID}
            task={task}
          />
        ))
      )}
    </div>
  );
};

export default TaskList; 