import React, { useState, useEffect } from 'react';
import { Category, Priority } from '../../types';
import { CATEGORY_STYLES, PRIORITY_STYLES } from '../../types';

interface EditModalProps {
    isOpen: boolean;
    taskText: string;
    category?: Category;
    priority?: Priority;
    dueDate?: Date | string;
    tags?: string[];
    onClose: () => void;
    onSave: (data: {
        text: string;
        category: Category;
        priority?: Priority;
        dueDate?: Date;
        tags: string[];
    }) => void;
}

const EditModal: React.FC<EditModalProps> = ({
    isOpen,
    taskText,
    category = 'General',
    priority,
    dueDate,
    tags = [],
    onClose,
    onSave
}) => {
    const [editedText, setEditedText] = useState(taskText);
    const [selectedCategory, setSelectedCategory] = useState<Category>(category);
    const [selectedPriority, setSelectedPriority] = useState<Priority | undefined>(priority);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [taskTags, setTaskTags] = useState<string[]>(tags);
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        setEditedText(taskText);
        setSelectedCategory(category);
        setSelectedPriority(priority);
        setTaskTags(tags);

        if (dueDate) {
            const date = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
            setSelectedDate(date.toISOString().split('T')[0]);
        } else {
            setSelectedDate('');
        }
    }, [taskText, category, priority, dueDate, tags]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (editedText.trim()) {
            onSave({
                text: editedText,
                category: selectedCategory,
                priority: selectedPriority,
                dueDate: selectedDate ? new Date(selectedDate) : undefined,
                tags: taskTags,
            });
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !taskTags.includes(trimmedTag)) {
            setTaskTags([...taskTags, trimmedTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTaskTags(taskTags.filter(tag => tag !== tagToRemove));
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 dark:bg-slate-900 light:bg-white rounded-xl border border-slate-700 dark:border-slate-700 light:border-slate-200 shadow-2xl w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200 sticky top-0 bg-slate-900 dark:bg-slate-900 light:bg-white z-10">
                    <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900">Editar Tarea</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                        aria-label="Cerrar modal"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Task Text */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                            Descripción de la tarea
                        </label>
                        <textarea
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full px-4 py-3 bg-slate-800 dark:bg-slate-800 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Escribe la tarea..."
                            autoFocus
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                            Categoría
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {(['Design', 'Development', 'Review', 'General'] as Category[]).map((cat) => {
                                const catStyle = CATEGORY_STYLES[cat];
                                const isSelected = selectedCategory === cat;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${isSelected
                                                ? `${catStyle.border} ${catStyle.bg} ${catStyle.text} ring-2 ring-offset-2 ring-offset-slate-900 ${catStyle.text.replace('text-', 'ring-')}`
                                                : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className={`size-2 rounded-full ${catStyle.dot}`}></span>
                                        <span>{catStyle.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Priority */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                            Prioridad
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedPriority(undefined)}
                                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${!selectedPriority
                                        ? 'border-slate-500 bg-slate-700 text-white ring-2 ring-slate-500'
                                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Sin prioridad
                            </button>
                            {(['Alta', 'Media', 'Baja'] as Priority[]).map((pri) => {
                                const priStyle = PRIORITY_STYLES[pri];
                                const isSelected = selectedPriority === pri;
                                return (
                                    <button
                                        key={pri}
                                        onClick={() => setSelectedPriority(pri)}
                                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${isSelected
                                                ? `${priStyle.border} ${priStyle.bg} ${priStyle.text} ring-2 ring-offset-2 ring-offset-slate-900 ${priStyle.text.replace('text-', 'ring-')}`
                                                : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-[18px]">{priStyle.icon}</span>
                                        <span>{priStyle.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                            Fecha de vencimiento
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 dark:bg-slate-800 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg text-white dark:text-white light:text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-slate-300 dark:text-slate-300 light:text-slate-700">
                            Etiquetas
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagInputKeyDown}
                                placeholder="Agregar etiqueta..."
                                className="flex-1 px-4 py-2 bg-slate-800 dark:bg-slate-800 light:bg-slate-50 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <button
                                onClick={handleAddTag}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {taskTags.map((tag, index) => (
                                <div
                                    key={tag}
                                    className="flex items-center gap-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-sm text-slate-300"
                                >
                                    <span>#{tag}</span>
                                    <button
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-slate-400 hover:text-red-400 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-500">
                        Presiona Enter para guardar o Esc para cancelar
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 dark:border-slate-800 light:border-slate-200 sticky bottom-0 bg-slate-900 dark:bg-slate-900 light:bg-white">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">check</span>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditModal;
