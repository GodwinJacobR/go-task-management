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
      setNewSubtask(''); // Clear the input but don't hide the form
      
      // Ensure the parent task is expanded
      if (!task.isExpanded) {
        onToggleExpand(task.id);
      }

      // Focus back on the input field for the next subtask
      const inputElement = document.getElementById(`subtask-input-${task.id}`);
      if (inputElement) {
        (inputElement as HTMLInputElement).focus();
      }
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
            <button 
              className="expand-button"
              onClick={() => onToggleExpand(task.id)}
            >
              {task.subtasks.length > 0 ? (
                task.isExpanded ? <FaChevronDown /> : <FaChevronRight />
              ) : (
                <span className="expand-placeholder" />
              )}
            </button>
            
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
            onClick={() => {
              setIsAdding(!isAdding);
              if (!task.isExpanded) {
                onToggleExpand(task.id);
              }
            }}
          >
            {isAdding ? 'Done' : <FaPlus />}
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddSubtask} className="add-subtask-form">
            <input
              id={`subtask-input-${task.id}`}
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a subtask (Press Enter to add)"
              autoFocus
            />
          </form>
        )}
      </div>

      {(task.isExpanded || task.subtasks.length > 0) && (
        <div className="subtasks-list">
          {task.subtasks.map(subtask => (
            <Task
              key={subtask.id}
              task={subtask}
              level={level + 1}
              onToggleTask={onToggleTask}
              onToggleExpand={onToggleExpand}
              onAddSubtask={onAddSubtask}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Task;