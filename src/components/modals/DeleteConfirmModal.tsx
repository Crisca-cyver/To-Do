import React, { useState } from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    taskText: string;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    taskText,
    onClose,
    onConfirm,
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-slate-900 dark:bg-slate-900 light:bg-white rounded-xl border border-slate-700 dark:border-slate-700 light:border-slate-200 shadow-2xl w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 dark:border-slate-800 light:border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-10 rounded-full bg-red-500/20">
                            <span className="material-symbols-outlined text-red-400">warning</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900">Confirmar Eliminación</h3>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 mb-4">
                        ¿Estás seguro de que deseas eliminar esta tarea?
                    </p>
                    <div className="bg-slate-800 dark:bg-slate-800 light:bg-slate-100 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg p-3">
                        <p className="text-sm text-slate-400 dark:text-slate-400 light:text-slate-600 italic">
                            "{taskText}"
                        </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-4">
                        Esta acción no se puede deshacer.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 dark:border-slate-800 light:border-slate-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
