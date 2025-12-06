export type Category = 'Design' | 'Development' | 'Review' | 'General';

export type FilterStatus = 'Todas' | 'Activas' | 'Completadas';

export type Priority = 'Alta' | 'Media' | 'Baja';

export interface SubTask {
    id: number;
    text: string;
    completed: boolean;
}

export interface Task {
    id: number;
    text: string;
    completed: boolean;
    category: Category;
    priority?: Priority;
    dueDate?: Date | string;
    tags?: string[];
    subTasks?: SubTask[];
    createdAt: Date | string;
    updatedAt: Date | string;
}

export const CATEGORY_STYLES: Record<Category, { bg: string; border: string; text: string; dot: string; label: string }> = {
    Design: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        dot: 'bg-blue-400',
        label: 'Diseño'
    },
    Development: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        dot: 'bg-purple-400',
        label: 'Desarrollo'
    },
    Review: {
        bg: 'bg-slate-800',
        border: 'border-slate-700',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
        label: 'Revisión'
    },
    General: {
        bg: 'bg-slate-800',
        border: 'border-slate-700',
        text: 'text-slate-400',
        dot: 'bg-slate-400',
        label: 'General'
    }
};

export const PRIORITY_STYLES: Record<Priority, { bg: string; border: string; text: string; label: string; icon: string }> = {
    Alta: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/50',
        text: 'text-red-400',
        label: 'Alta',
        icon: 'priority_high'
    },
    Media: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        label: 'Media',
        icon: 'drag_handle'
    },
    Baja: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/50',
        text: 'text-green-400',
        label: 'Baja',
        icon: 'arrow_downward'
    }
};
