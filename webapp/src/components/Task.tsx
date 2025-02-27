import React from 'react';
import { Task as TaskType } from '../types';
import { FaChevronRight, FaChevronDown, FaPlus } from 'react-icons/fa';

interface TaskProps {
  task: TaskType;
  level?: number;
  onToggleTask: (id: number) => void;
  onToggleExpand: (id: number) => void;
  onAddSubtask: (parentId: number, text: string) => void;
}

const Task: React.FC<TaskProps> = ({
  task,
  level = 0,
  onToggleTask,
  onToggleExpand,
  onAddSubtask,
}) => {
  const [newSubtask, setNewSubtask] = React.useState<string>('');
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtask.trim()) {
      onAddSubtask(task.id, newSubtask);
      setNewSubtask('');
      setIsAdding(false);
    }
  };

  return (
    <>
      <div 
        className="task-row"
        style={{ 
          paddingLeft: `${level * 24}px`,
        }}
      >
        <div className="task-content">
          <div className="task-controls">
            {task.subtasks.length > 0 ? (
              <button 
                className="expand-button"
                onClick={() => onToggleExpand(task.id)}
              >
                {task.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            ) : (
              <span className="expand-placeholder" />
            )}
            
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task.id)}
            />
            <span className={task.completed ? 'completed' : ''}>
              {task.text}
            </span>
          </div>

          <button 
            className="add-button"
            onClick={() => setIsAdding(!isAdding)}
          >
            <FaPlus />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddSubtask} className="add-subtask-form">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask"
              autoFocus
            />
            <button type="submit">Add</button>
            <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
          </form>
        )}
      </div>

      {task.isExpanded && task.subtasks.map(subtask => (
        <Task
          key={subtask.id}
          task={subtask}
          level={level + 1}
          onToggleTask={onToggleTask}
          onToggleExpand={onToggleExpand}
          onAddSubtask={onAddSubtask}
        />
      ))}
    </>
  );
};

export default Task;