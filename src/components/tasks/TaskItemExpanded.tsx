import React, { useState } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TaskContext';
import SubTaskItem from './SubTaskItem';

interface TaskItemExpandedProps {
    task: Task;
}

const TaskItemExpanded: React.FC<TaskItemExpandedProps> = ({ task }) => {
    const { addSubTask, toggleSubTask, deleteSubTask } = useTasks();
    const [subTaskInput, setSubTaskInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    if (!task.subTasks || task.subTasks.length === 0) {
        return null;
    }

    const handleAddSubTask = () => {
        if (subTaskInput.trim()) {
            addSubTask(task.id, subTaskInput);
            setSubTaskInput('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleAddSubTask();
        }
    };

    return (
        <div className="ml-12 mt-2 space-y-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
                <span className="material-symbols-outlined text-[16px]">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                </span>
                <span>
                    {isExpanded ? 'Ocultar' : 'Mostrar'} subtareas ({task.subTasks.length})
                </span>
            </button>

            {isExpanded && (
                <div className="space-y-2">
                    {task.subTasks.map((subTask) => (
                        <SubTaskItem
                            key={subTask.id}
                            subTask={subTask}
                            onToggle={() => toggleSubTask(task.id, subTask.id)}
                            onDelete={() => deleteSubTask(task.id, subTask.id)}
                        />
                    ))}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={subTaskInput}
                            onChange={(e) => setSubTaskInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Agregar subtarea..."
                            className="flex-1 px-3 py-2 text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                            onClick={handleAddSubTask}
                            className="px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItemExpanded;
