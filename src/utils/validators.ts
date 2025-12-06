import { Task } from '../types';
import { MAX_TASK_LENGTH, MAX_TAG_LENGTH, MAX_TAGS_PER_TASK } from '../constants';

export function validateTaskText(text: string): { valid: boolean; error?: string } {
    if (!text.trim()) {
        return { valid: false, error: 'El texto de la tarea no puede estar vacío' };
    }

    if (text.length > MAX_TASK_LENGTH) {
        return { valid: false, error: `El texto no puede exceder ${MAX_TASK_LENGTH} caracteres` };
    }

    return { valid: true };
}

export function validateTag(tag: string): { valid: boolean; error?: string } {
    if (!tag.trim()) {
        return { valid: false, error: 'La etiqueta no puede estar vacía' };
    }

    if (tag.length > MAX_TAG_LENGTH) {
        return { valid: false, error: `La etiqueta no puede exceder ${MAX_TAG_LENGTH} caracteres` };
    }

    if (!/^[a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s-]+$/.test(tag)) {
        return { valid: false, error: 'La etiqueta contiene caracteres no válidos' };
    }

    return { valid: true };
}

export function isDuplicateTask(tasks: Task[], text: string, excludeId?: number): boolean {
    return tasks.some(task =>
        task.id !== excludeId &&
        task.text.toLowerCase().trim() === text.toLowerCase().trim()
    );
}

export function validateTags(tags: string[]): { valid: boolean; error?: string } {
    if (tags.length > MAX_TAGS_PER_TASK) {
        return { valid: false, error: `No puedes agregar más de ${MAX_TAGS_PER_TASK} etiquetas` };
    }

    for (const tag of tags) {
        const result = validateTag(tag);
        if (!result.valid) {
            return result;
        }
    }

    return { valid: true };
}

export function sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ');
}
