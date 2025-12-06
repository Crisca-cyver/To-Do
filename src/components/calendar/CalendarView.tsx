import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../../contexts/TaskContext';
import { Task } from '../../types';

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CalendarView: React.FC = () => {
    const { tasks } = useTasks();

    // Convert tasks to calendar events
    const events = useMemo(() => {
        return tasks
            .filter(task => task.dueDate)
            .map(task => ({
                id: task.id,
                title: task.text,
                start: typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate,
                end: typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate,
                resource: task,
            }));
    }, [tasks]);

    const eventStyleGetter = (event: any) => {
        const task: Task = event.resource;
        let backgroundColor = '#3b82f6';

        if (task.completed) {
            backgroundColor = '#10b981';
        } else if (task.priority === 'Alta') {
            backgroundColor = '#ef4444';
        } else if (task.priority === 'Media') {
            backgroundColor = '#f59e0b';
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: task.completed ? 0.6 : 1,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <div className="p-4 h-[calc(100vh-200px)]">
            <div className="bg-slate-900 dark:bg-slate-900 light:bg-white border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-lg p-6 h-full">
                <h2 className="text-2xl font-bold text-white dark:text-white light:text-slate-900 mb-4">
                    📅 Vista de Calendario
                </h2>
                <div className="calendar-container h-[calc(100%-60px)]">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        eventPropGetter={eventStyleGetter}
                        culture="es"
                        messages={{
                            next: 'Siguiente',
                            previous: 'Anterior',
                            today: 'Hoy',
                            month: 'Mes',
                            week: 'Semana',
                            day: 'Día',
                            agenda: 'Agenda',
                            date: 'Fecha',
                            time: 'Hora',
                            event: 'Evento',
                            noEventsInRange: 'No hay tareas en este rango',
                            showMore: (total) => `+ Ver más (${total})`,
                        }}
                    />
                </div>
            </div>

            <style>{`
        .calendar-container .rbc-calendar {
          color: #e2e8f0;
        }
        .calendar-container .rbc-header {
          background-color: #1e293b;
          color: #e2e8f0;
          border-color: #334155;
          padding: 10px;
        }
        .calendar-container .rbc-today {
          background-color: #1e40af20;
        }
        .calendar-container .rbc-off-range-bg {
          background-color: #0f172a;
        }
        .calendar-container .rbc-month-view {
          background-color: #0f172a;
          border-color: #334155;
        }
        .calendar-container .rbc-day-bg {
          border-color: #334155;
        }
        .calendar-container .rbc-date-cell {
          color: #94a3b8;
        }
        .calendar-container .rbc-button-link {
          color: #e2e8f0;
        }
        .calendar-container .rbc-toolbar button {
          color: #e2e8f0;
          border-color: #334155;
          background-color: #1e293b;
        }
        .calendar-container .rbc-toolbar button:hover {
          background-color: #334155;
        }
        .calendar-container .rbc-toolbar button.rbc-active {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        .calendar-container .rbc-event {
          padding: 2px 5px;
          font-size: 12px;
        }
        .calendar-container .rbc-event-label {
          font-size: 11px;
        }
      `}</style>
        </div>
    );
};

export default CalendarView;
