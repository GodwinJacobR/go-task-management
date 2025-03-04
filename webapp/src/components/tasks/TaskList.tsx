import React, { FormEvent } from 'react';
import { Task } from './';
import { Task as TaskType } from '../../types';
import '../../styles/tasks/TaskList.css';

interface TaskListProps {
  tasks: TaskType[];
  newTask: string;
  onNewTaskChange: (value: string) => void;
  onAddTask: (e: FormEvent<HTMLFormElement>) => void;
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  newTask,
  onNewTaskChange,
  onAddTask,
  onToggleTask,
  onToggleExpand
}) => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>My Task List</h1>
        
        <form onSubmit={onAddTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => onNewTaskChange(e.target.value)}
            placeholder="Add a new task"
            className="add-task-input"
          />
          <button 
            type="submit" 
            className="add-task-button"
            disabled={newTask.trim() === ''}
          >
            Add Task
          </button>
        </form>
      </header>

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
    </div>
  );
};

export default TaskList; 