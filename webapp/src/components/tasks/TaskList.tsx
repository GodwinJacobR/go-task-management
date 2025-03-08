import React from 'react';
import { Task as TaskType } from '../../types';
import { Task } from './';
import '../../styles/tasks/TaskList.css';

interface TaskListProps {
  tasks: TaskType[];
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleTask,
  onToggleExpand,
}) => {
  return (
    <div className="tasks-grid">
      {tasks.length === 0 ? (
        <p className="no-tasks-message">No tasks yet. Add a task to get started!</p>
      ) : (
        tasks.map(task => (
          <Task
            key={task.id}
            task={task}
            onToggleTask={onToggleTask}
            onToggleExpand={onToggleExpand}
          />
        ))
      )}
    </div>
  );
};

export default TaskList; 