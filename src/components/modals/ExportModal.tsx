import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { exportToJSON, exportToCSV, exportToMarkdown, downloadFile, importFromJSON } from '../../utils/exportHelpers';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
    const { tasks, importTasks } = useTasks();
    const [importError, setImportError] = useState<string>('');

    if (!isOpen) return null;

    const handleExportJSON = () => {
        const content = exportToJSON(tasks);
        const filename = `tareas-${new Date().toISOString().split('T')[0]}.json`;
        downloadFile(content, filename, 'application/json');
    };

    const handleExportCSV = () => {
        const content = exportToCSV(tasks);
        const filename = `tareas-${new Date().toISOString().split('T')[0]}.csv`;
        downloadFile(content, filename, 'text/csv');
    };

    const handleExportMarkdown = () => {
        const content = exportToMarkdown(tasks);
        const filename = `tareas-${new Date().toISOString().split('T')[0]}.md`;
        downloadFile(content, filename, 'text/markdown');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const importedTasks = importFromJSON(content);
                importTasks(importedTasks);
                setImportError('');
                onClose();
            } catch (error) {
                setImportError(error instanceof Error ? error.message : 'Error al importar archivo');
            }
        };
        reader.readAsText(file);
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
                    <h3 className="text-xl font-semibold text-white dark:text-white light:text-slate-900">Exportar / Importar</h3>
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
                    {/* Export Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-3">
                            Exportar Tareas
                        </h4>
                        <div className="space-y-2">
                            <button
                                onClick={handleExportJSON}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-blue-400">code</span>
                                    <div>
                                        <p className="text-sm font-medium text-white dark:text-white light:text-slate-900">JSON</p>
                                        <p className="text-xs text-slate-400">Formato completo con todos los datos</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">download</span>
                            </button>

                            <button
                                onClick={handleExportCSV}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-green-400">table_chart</span>
                                    <div>
                                        <p className="text-sm font-medium text-white dark:text-white light:text-slate-900">CSV</p>
                                        <p className="text-xs text-slate-400">Para Excel y hojas de cálculo</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">download</span>
                            </button>

                            <button
                                onClick={handleExportMarkdown}
                                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-purple-400">description</span>
                                    <div>
                                        <p className="text-sm font-medium text-white dark:text-white light:text-slate-900">Markdown</p>
                                        <p className="text-xs text-slate-400">Para documentación y notas</p>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-400">download</span>
                            </button>
                        </div>
                    </div>

                    {/* Import Section */}
                    <div>
                        <h4 className="text-sm font-semibold text-slate-300 dark:text-slate-300 light:text-slate-700 mb-3">
                            Importar Tareas
                        </h4>
                        <label className="w-full flex items-center justify-center px-4 py-6 bg-slate-800 dark:bg-slate-800 light:bg-slate-100 hover:bg-slate-700 border-2 border-dashed border-slate-600 dark:border-slate-600 light:border-slate-400 rounded-lg transition-colors cursor-pointer">
                            <div className="flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-3xl text-slate-400">upload_file</span>
                                <p className="text-sm font-medium text-white dark:text-white light:text-slate-900">Seleccionar archivo JSON</p>
                                <p className="text-xs text-slate-500">Haz clic para seleccionar</p>
                            </div>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="hidden"
                            />
                        </label>
                        {importError && (
                            <div className="mt-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                <p className="text-sm text-red-400">{importError}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
                        <p className="text-xs text-yellow-400">
                            <strong>Advertencia:</strong> Importar reemplazará todas tus tareas actuales.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
