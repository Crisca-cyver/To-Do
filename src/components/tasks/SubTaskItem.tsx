import React from 'react';
import { SubTask } from '../../types';

interface SubTaskItemProps {
    subTask: SubTask;
    onToggle: () => void;
    onDelete: () => void;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask, onToggle, onDelete }) => {
    return (
        <div className="flex items-center gap-3 py-2 px-3 bg-slate-800/50 rounded-lg group">
            <input
                type="checkbox"
                checked={subTask.completed}
                onChange={onToggle}
                className="h-4 w-4 rounded border-slate-600 border-2 bg-transparent text-primary 
                   checked:bg-primary checked:border-primary 
                   focus:ring-0 focus:ring-offset-0 focus:border-primary focus:outline-none 
                   transition-all cursor-pointer"
            />
            <p className={`flex-1 text-sm ${subTask.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                }`}>
                {subTask.text}
            </p>
            <button
                onClick={onDelete}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                aria-label="Delete subtask"
            >
                <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
        </div>
    );
};

export default SubTaskItem;
