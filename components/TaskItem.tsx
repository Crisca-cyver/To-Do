import React from 'react';
import { Task, CATEGORY_STYLES } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
  const style = CATEGORY_STYLES[task.category];

  return (
    <div className="flex items-start gap-4 bg-transparent px-4 py-3 min-h-14 justify-between group animate-slide-up">
      <div className="flex items-center gap-4 flex-1 min-w-0 pt-0.5">
        <div className="flex size-7 items-center justify-center shrink-0">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="h-5 w-5 rounded border-slate-600 border-2 bg-transparent text-primary 
                       checked:bg-primary checked:border-primary checked:bg-checkbox-tick 
                       focus:ring-0 focus:ring-offset-0 focus:border-primary focus:outline-none 
                       transition-all cursor-pointer"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <p className={`text-base font-normal leading-normal truncate transition-colors duration-300 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
            {task.text}
          </p>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${style.border} ${style.bg} ${style.text}`}>
              <span className={`size-1.5 rounded-full ${style.dot}`}></span>
              <span>{style.label}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity pt-1">
        <button
          onClick={() => onEdit(task.id)}
          className="text-slate-400 hover:text-primary flex size-7 items-center justify-center transition-colors rounded hover:bg-slate-800"
          aria-label="Edit task"
        >
          <span className="material-symbols-outlined text-[20px]">edit</span>
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-slate-400 hover:text-red-500 flex size-7 items-center justify-center transition-colors rounded hover:bg-slate-800"
          aria-label="Delete task"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default TaskItem;