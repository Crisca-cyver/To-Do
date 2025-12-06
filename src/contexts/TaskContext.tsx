import React, { createContext, useContext, ReactNode } from 'react';
import { Task, Category, Priority, SubTask } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants';
import { validateTaskText, isDuplicateTask, sanitizeInput } from '../utils/validators';
import { assignCategoryByKeywords } from '../utils/taskHelpers';

interface TaskContextType {
    tasks: Task[];
    addTask: (text: string, category?: Category, priority?: Priority, dueDate?: Date, tags?: string[]) => { success: boolean; error?: string };
    updateTask: (id: number, updates: Partial<Task>) => void;
    deleteTask: (id: number) => void;
    toggleTask: (id: number) => void;
    addSubTask: (taskId: number, subTaskText: string) => void;
    toggleSubTask: (taskId: number, subTaskId: number) => void;
    deleteSubTask: (taskId: number, subTaskId: number) => void;
    reorderTasks: (tasks: Task[]) => void;
    importTasks: (tasks: Task[]) => void;
    clearAllTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const INITIAL_TASKS: Task[] = [
    {
        id: 1,
        text: "Diseñar la interfaz de usuario en Figma",
        completed: false,
        category: 'Design',
        priority: 'Alta',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        text: "Desarrollar componentes de React",
        completed: false,
        category: 'Development',
        priority: 'Media',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        text: "Implementar la lógica de estado",
        completed: false,
        category: 'Development',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 4,
        text: "Revisar el feedback del equipo",
        completed: true,
        category: 'Review',
        tags: ['equipo', 'feedback'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);

    const addTask = (
        text: string,
        category?: Category,
        priority?: Priority,
        dueDate?: Date,
        tags?: string[]
    ): { success: boolean; error?: string } => {
        const sanitizedText = sanitizeInput(text);

        // Validate
        const validation = validateTaskText(sanitizedText);
        if (!validation.valid) {
            return { success: false, error: validation.error };
        }

        // Check for duplicates
        if (isDuplicateTask(tasks, sanitizedText)) {
            return { success: false, error: 'Ya existe una tarea con este texto' };
        }

        const assignedCategory = category || assignCategoryByKeywords(sanitizedText);

        const newTask: Task = {
            id: Date.now(),
            text: sanitizedText,
            completed: false,
            category: assignedCategory,
            priority,
            dueDate: dueDate?.toISOString(),
            tags: tags || [],
            subTasks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setTasks(prev => [newTask, ...prev]);
        return { success: true };
    };

    const updateTask = (id: number, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === id
                ? { ...task, ...updates, updatedAt: new Date().toISOString() }
                : task
        ));
    };

    const deleteTask = (id: number) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const toggleTask = (id: number) => {
        setTasks(prev => prev.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
                : task
        ));
    };

    const addSubTask = (taskId: number, subTaskText: string) => {
        const sanitizedText = sanitizeInput(subTaskText);
        if (!sanitizedText) return;

        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const newSubTask: SubTask = {
                    id: Date.now(),
                    text: sanitizedText,
                    completed: false,
                };
                return {
                    ...task,
                    subTasks: [...(task.subTasks || []), newSubTask],
                    updatedAt: new Date().toISOString(),
                };
            }
            return task;
        }));
    };

    const toggleSubTask = (taskId: number, subTaskId: number) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId && task.subTasks) {
                return {
                    ...task,
                    subTasks: task.subTasks.map(st =>
                        st.id === subTaskId ? { ...st, completed: !st.completed } : st
                    ),
                    updatedAt: new Date().toISOString(),
                };
            }
            return task;
        }));
    };

    const deleteSubTask = (taskId: number, subTaskId: number) => {
        setTasks(prev => prev.map(task => {
            if (task.id === taskId && task.subTasks) {
                return {
                    ...task,
                    subTasks: task.subTasks.filter(st => st.id !== subTaskId),
                    updatedAt: new Date().toISOString(),
                };
            }
            return task;
        }));
    };

    const reorderTasks = (newTasks: Task[]) => {
        setTasks(newTasks);
    };

    const importTasks = (importedTasks: Task[]) => {
        setTasks(importedTasks);
    };

    const clearAllTasks = () => {
        setTasks([]);
    };

    const value: TaskContextType = {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        addSubTask,
        toggleSubTask,
        deleteSubTask,
        reorderTasks,
        importTasks,
        clearAllTasks,
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
