import React, { useState } from 'react';

interface EditModalProps {
    isOpen: boolean;
    taskText: string;
    onClose: () => void;
    onSave: (newText: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, taskText, onClose, onSave }) => {
    const [editedText, setEditedText] = useState(taskText);

    React.useEffect(() => {
        setEditedText(taskText);
    }, [taskText]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (editedText.trim()) {
            onSave(editedText);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h3 className="text-xl font-semibold text-white">Editar Tarea</h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
                        aria-label="Cerrar modal"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <label className="block mb-2 text-sm font-medium text-slate-300">
                        Descripción de la tarea
                    </label>
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        rows={3}
                        placeholder="Escribe la tarea..."
                        autoFocus
                    />
                    <p className="mt-2 text-xs text-slate-500">
                        Presiona Enter para guardar o Esc para cancelar
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
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
