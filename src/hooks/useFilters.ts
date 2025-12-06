import { useMemo } from 'react';
import { Task, Category, FilterStatus } from '../types';

export function useFilters(
    tasks: Task[],
    searchQuery: string,
    filterCategory: Category | 'All',
    filterStatus: FilterStatus,
    selectedTags: string[] = []
) {
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Filter by Status
            if (filterStatus === 'Activas' && task.completed) return false;
            if (filterStatus === 'Completadas' && !task.completed) return false;

            // Filter by Category
            if (filterCategory !== 'All' && task.category !== filterCategory) return false;

            // Filter by Tags
            if (selectedTags.length > 0) {
                const hasSelectedTag = selectedTags.some(tag => task.tags?.includes(tag));
                if (!hasSelectedTag) return false;
            }

            // Filter by Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesText = task.text.toLowerCase().includes(query);
                const matchesTags = task.tags?.some(tag => tag.toLowerCase().includes(query));
                const matchesCategory = task.category.toLowerCase().includes(query);

                if (!matchesText && !matchesTags && !matchesCategory) return false;
            }

            return true;
        });
    }, [tasks, filterStatus, filterCategory, searchQuery, selectedTags]);

    return filteredTasks;
}
