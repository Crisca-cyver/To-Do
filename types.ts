export type Category = 'Design' | 'Development' | 'Review' | 'General';

export type FilterStatus = 'Todas' | 'Activas' | 'Completadas';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: Category;
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