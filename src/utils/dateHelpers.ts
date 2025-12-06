import { isToday, isPast, isThisWeek, parseISO, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function isOverdue(date: Date | string | undefined): boolean {
    if (!date) return false;
    const dueDate = typeof date === 'string' ? parseISO(date) : date;
    return isPast(dueDate) && !isToday(dueDate);
}

export function isDueSoon(date: Date | string | undefined): boolean {
    if (!date) return false;
    const dueDate = typeof date === 'string' ? parseISO(date) : date;
    return isThisWeek(dueDate) && !isPast(dueDate);
}

export function isDueToday(date: Date | string | undefined): boolean {
    if (!date) return false;
    const dueDate = typeof date === 'string' ? parseISO(date) : date;
    return isToday(dueDate);
}

export function formatDueDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dueDate = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dueDate)) {
        return 'Hoy';
    }

    return formatDistanceToNow(dueDate, { addSuffix: true, locale: es });
}

export function getDueDateStatus(date: Date | string | undefined): 'overdue' | 'today' | 'soon' | 'normal' | null {
    if (!date) return null;

    if (isOverdue(date)) return 'overdue';
    if (isDueToday(date)) return 'today';
    if (isDueSoon(date)) return 'soon';
    return 'normal';
}
