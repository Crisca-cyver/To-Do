import React, { useMemo } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const StatsDashboard: React.FC = () => {
    const { tasks } = useTasks();

    // Tareas por categoría
    const tasksByCategory = useMemo(() => {
        const categories = tasks.reduce((acc, task) => {
            acc[task.category] = (acc[task.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categories).map(([name, value]) => ({
            name,
            value,
        }));
    }, [tasks]);

    // Productividad semanal (tareas completadas por día)
    const weeklyProductivity = useMemo(() => {
        const now = new Date();
        const weekStart = startOfWeek(now, { locale: es });
        const weekEnd = endOfWeek(now, { locale: es });
        const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

        return daysOfWeek.map(day => {
            const completedCount = tasks.filter(task => {
                if (!task.completed || !task.updatedAt) return false;
                const updatedDate = typeof task.updatedAt === 'string' ? parseISO(task.updatedAt) : task.updatedAt;
                return isWithinInterval(updatedDate, { start: day, end: new Date(day.getTime() + 24 * 60 * 60 * 1000) });
            }).length;

            return {
                day: format(day, 'EEE', { locale: es }),
                completadas: completedCount,
            };
        });
    }, [tasks]);

    // Racha de días completando tareas
    const streak = useMemo(() => {
        let currentStreak = 0;
        let maxStreak = 0;
        const today = new Date();

        // Simplificado: contar días únicos con tareas completadas
        const completionDates = tasks
            .filter(t => t.completed && t.updatedAt)
            .map(t => {
                const date = typeof t.updatedAt === 'string' ? parseISO(t.updatedAt) : t.updatedAt;
                return format(date, 'yyyy-MM-dd');
            });

        const uniqueDates = [...new Set(completionDates)].sort().reverse();

        for (let i = 0; i < uniqueDates.length; i++) {
            currentStreak++;
            if (currentStreak > maxStreak) maxStreak = currentStreak;
        }

        return { current: Math.min(currentStreak, 7), max: maxStreak };
    }, [tasks]);

    // Tiempo promedio de completación (en días)
    const avgCompletionTime = useMemo(() => {
        const completedTasks = tasks.filter(t => t.completed && t.createdAt && t.updatedAt);
        if (completedTasks.length === 0) return 0;

        const totalDays = completedTasks.reduce((sum, task) => {
            const created = typeof task.createdAt === 'string' ? parseISO(task.createdAt) : task.createdAt;
            const updated = typeof task.updatedAt === 'string' ? parseISO(task.updatedAt) : task.updatedAt;
            const days = Math.abs(updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
        }, 0);

        return (totalDays / completedTasks.length).toFixed(1);
    }, [tasks]);

    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">
                📊 Estadísticas Avanzadas
            </h2>

            {/* Métricas Rápidas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-12 rounded-full bg-orange-500/20">
                            <span className="material-symbols-outlined text-orange-400 text-2xl">local_fire_department</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Racha Actual</p>
                            <p className="text-white dark:text-white light:text-slate-900 text-2xl font-bold">{streak.current} días</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-12 rounded-full bg-blue-500/20">
                            <span className="material-symbols-outlined text-blue-400 text-2xl">trending_up</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Racha Máxima</p>
                            <p className="text-white dark:text-white light:text-slate-900 text-2xl font-bold">{streak.max} días</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-12 rounded-full bg-green-500/20">
                            <span className="material-symbols-outlined text-green-400 text-2xl">schedule</span>
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Tiempo Promedio</p>
                            <p className="text-white dark:text-white light:text-slate-900 text-2xl font-bold">{avgCompletionTime} días</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Productividad Semanal */}
                <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900 mb-4">
                        Productividad Semanal
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={weeklyProductivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="day" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="completadas" fill="#3b82f6" name="Tareas Completadas" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tareas por Categoría */}
                <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900 mb-4">
                        Tareas por Categoría
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={tasksByCategory}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {tasksByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1e293b',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#fff',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
