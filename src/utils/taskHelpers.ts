import { Task, Category, Priority, SubTask } from '../types';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

export function assignCategoryByKeywords(text: string): Category {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('design') || lowerText.includes('diseñ') ||
        lowerText.includes('figma') || lowerText.includes('ui') || lowerText.includes('ux')) {
        return 'Design';
    } else if (lowerText.includes('dev') || lowerText.includes('cod') ||
        lowerText.includes('react') || lowerText.includes('api') || lowerText.includes('bug')) {
        return 'Development';
    } else if (lowerText.includes('revis') || lowerText.includes('check') || lowerText.includes('test')) {
        return 'Review';
    }

    return 'General';
}

export function calculateSubTaskProgress(subTasks?: SubTask[]): { completed: number; total: number; percentage: number } {
    if (!subTasks || subTasks.length === 0) {
        return { completed: 0, total: 0, percentage: 0 };
    }

    const completed = subTasks.filter(st => st.completed).length;
    const total = subTasks.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
}

export function sortTasksByPriority(tasks: Task[]): Task[] {
    const priorityOrder: Record<Priority, number> = {
        'Alta': 1,
        'Media': 2,
        'Baja': 3,
    };

    return [...tasks].sort((a, b) => {
        const aPriority = a.priority ? priorityOrder[a.priority] : 4;
        const bPriority = b.priority ? priorityOrder[b.priority] : 4;
        return aPriority - bPriority;
    });
}

export function sortTasksByDueDate(tasks: Task[], ascending = true): Task[] {
    return [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;

        const dateA = typeof a.dueDate === 'string' ? parseISO(a.dueDate) : a.dueDate;
        const dateB = typeof b.dueDate === 'string' ? parseISO(b.dueDate) : b.dueDate;

        return ascending ? compareAsc(dateA, dateB) : compareDesc(dateA, dateB);
    });
}

export function sortTasksByCreatedDate(tasks: Task[], ascending = false): Task[] {
    return [...tasks].sort((a, b) => {
        const dateA = typeof a.createdAt === 'string' ? parseISO(a.createdAt) : a.createdAt;
        const dateB = typeof b.createdAt === 'string' ? parseISO(b.createdAt) : b.createdAt;

        return ascending ? compareAsc(dateA, dateB) : compareDesc(dateA, dateB);
    });
}

export function getTagColor(index: number, colors: string[]): string {
    return colors[index % colors.length];
}

export function extractHashtags(text: string): string[] {
    const hashtagRegex = /#([a-zA-Z0-9áéíóúñÁÉÍÓÚÑ]+)/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
}

export function getAllTags(tasks: Task[]): string[] {
    const tagSet = new Set<string>();
    tasks.forEach(task => {
        task.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
}
