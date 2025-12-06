import { Task } from '../types';
import { format } from 'date-fns';

export function exportToJSON(tasks: Task[]): string {
    return JSON.stringify(tasks, null, 2);
}

export function exportToCSV(tasks: Task[]): string {
    const headers = ['ID', 'Texto', 'Completada', 'Categoría', 'Prioridad', 'Fecha Vencimiento', 'Etiquetas', 'Creada', 'Actualizada'];

    const rows = tasks.map(task => [
        task.id,
        `"${task.text.replace(/"/g, '""')}"`,
        task.completed ? 'Sí' : 'No',
        task.category,
        task.priority || '',
        task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        task.tags?.join('; ') || '',
        format(new Date(task.createdAt), 'yyyy-MM-dd HH:mm'),
        format(new Date(task.updatedAt), 'yyyy-MM-dd HH:mm'),
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

export function exportToMarkdown(tasks: Task[]): string {
    let markdown = '# Mi Lista de Tareas\n\n';

    const categories = [...new Set(tasks.map(t => t.category))];

    categories.forEach(category => {
        const categoryTasks = tasks.filter(t => t.category === category);
        if (categoryTasks.length === 0) return;

        markdown += `## ${category}\n\n`;

        categoryTasks.forEach(task => {
            const checkbox = task.completed ? '[x]' : '[ ]';
            markdown += `- ${checkbox} ${task.text}`;

            if (task.priority) {
                markdown += ` **[${task.priority}]**`;
            }

            if (task.dueDate) {
                markdown += ` 📅 ${format(new Date(task.dueDate), 'yyyy-MM-dd')}`;
            }

            if (task.tags && task.tags.length > 0) {
                markdown += ` ${task.tags.map(t => `#${t}`).join(' ')}`;
            }

            markdown += '\n';

            if (task.subTasks && task.subTasks.length > 0) {
                task.subTasks.forEach(subTask => {
                    const subCheckbox = subTask.completed ? '[x]' : '[ ]';
                    markdown += `  - ${subCheckbox} ${subTask.text}\n`;
                });
            }
        });

        markdown += '\n';
    });

    return markdown;
}

export function importFromJSON(jsonString: string): Task[] {
    try {
        const data = JSON.parse(jsonString);

        if (!Array.isArray(data)) {
            throw new Error('El archivo JSON debe contener un array de tareas');
        }

        // Validate and sanitize imported tasks
        return data.map((task: any) => ({
            id: task.id || Date.now() + Math.random(),
            text: task.text || 'Tarea sin título',
            completed: Boolean(task.completed),
            category: task.category || 'General',
            priority: task.priority,
            dueDate: task.dueDate,
            tags: Array.isArray(task.tags) ? task.tags : [],
            subTasks: Array.isArray(task.subTasks) ? task.subTasks : [],
            createdAt: task.createdAt || new Date().toISOString(),
            updatedAt: task.updatedAt || new Date().toISOString(),
        }));
    } catch (error) {
        throw new Error('Error al importar: formato JSON inválido');
    }
}

export function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
