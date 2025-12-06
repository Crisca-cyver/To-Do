import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Task, CATEGORY_STYLES, PRIORITY_STYLES } from '../../types';
import { getDueDateStatus, formatDueDate } from '../../utils/dateHelpers';
import { calculateSubTaskProgress } from '../../utils/taskHelpers';
import { TAG_COLORS } from '../../constants';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
    task: Task;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }) => {
    const style = CATEGORY_STYLES[task.category];
    const priorityStyle = task.priority ? PRIORITY_STYLES[task.priority] : null;
    const dueDateStatus = getDueDateStatus(task.dueDate);
    const subTaskProgress = calculateSubTaskProgress(task.subTasks);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const dragStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleToggle = () => {
        if (!task.completed) {
            // Fire confetti when completing a task
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#3b82f6', '#8b5cf6', '#10b981'],
            });
        }
        onToggle(task.id);
    };

    const getDueDateColor = () => {
        if (!dueDateStatus) return '';
        switch (dueDateStatus) {
            case 'overdue': return 'text-red-400 bg-red-500/10 border-red-500/50';
            case 'today': return 'text-orange-400 bg-orange-500/10 border-orange-500/50';
            case 'soon': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50';
            default: return 'text-slate-400 bg-slate-800 border-slate-700';
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={dragStyle}
            className="flex items-start gap-4 bg-transparent px-4 py-3 min-h-14 justify-between group animate-slide-up"
        >
            <div className="flex items-center gap-4 flex-1 min-w-0 pt-0.5">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <span className="material-symbols-outlined text-slate-500 text-[20px]">drag_indicator</span>
                </div>

                {/* Checkbox */}
                <div className="flex size-7 items-center justify-center shrink-0">
                    <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={handleToggle}
                        className="h-5 w-5 rounded border-slate-600 border-2 bg-transparent text-primary 
                       checked:bg-primary checked:border-primary checked:bg-checkbox-tick 
                       focus:ring-0 focus:ring-offset-0 focus:border-primary focus:outline-none 
                       transition-all cursor-pointer"
                    />
                </div>

                {/* Task Content */}
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p className={`text-base font-normal leading-normal transition-colors duration-300 ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300 dark:text-slate-300 light:text-slate-900'
                        }`}>
                        {task.text}
                    </p>

                    {/* Metadata Row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Badge */}
                        <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${style.border} ${style.bg} ${style.text}`}>
                            <span className={`size-1.5 rounded-full ${style.dot}`}></span>
                            <span>{style.label}</span>
                        </div>

                        {/* Priority Badge */}
                        {priorityStyle && (
                            <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${priorityStyle.border} ${priorityStyle.bg} ${priorityStyle.text}`}>
                                <span className="material-symbols-outlined text-[14px]">{priorityStyle.icon}</span>
                                <span>{priorityStyle.label}</span>
                            </div>
                        )}

                        {/* Due Date */}
                        {task.dueDate && (
                            <div className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${getDueDateColor()}`}>
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                <span>{formatDueDate(task.dueDate)}</span>
                            </div>
                        )}

                        {/* SubTasks Progress */}
                        {subTaskProgress.total > 0 && (
                            <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-400">
                                <span className="material-symbols-outlined text-[14px]">checklist</span>
                                <span>{subTaskProgress.completed}/{subTaskProgress.total}</span>
                            </div>
                        )}

                        {/* Tags */}
                        {task.tags && task.tags.map((tag, index) => (
                            <div
                                key={tag}
                                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${TAG_COLORS[index % TAG_COLORS.length]}`}
                            >
                                <span>#</span>
                                <span>{tag}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
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
