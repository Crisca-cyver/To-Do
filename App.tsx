import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Category, FilterStatus, Priority } from './src/types';
import { useTasks } from './src/contexts/TaskContext';
import { useTheme } from './src/contexts/ThemeContext';
import { useFilters } from './src/hooks/useFilters';
import StatsCard from './src/components/stats/StatsCard';
import StatsDashboard from './src/components/stats/StatsDashboard';
import TaskItem from './src/components/tasks/TaskItem';
import EditModal from './src/components/modals/EditModal';
import DeleteConfirmModal from './src/components/modals/DeleteConfirmModal';
import ExportModal from './src/components/modals/ExportModal';
import ThemeToggle from './src/components/common/ThemeToggle';
import CalendarView from './src/components/calendar/CalendarView';

type ViewMode = 'list' | 'stats' | 'calendar';

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask, reorderTasks } = useTasks();
  const { theme, toggleTheme } = useTheme();

  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Activas');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<any>(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  // Filter tasks
  const filteredTasks = useFilters(tasks, searchQuery, filterCategory, filterStatus, selectedTags);

  // Calculate stats
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex(t => t.id === active.id);
      const newIndex = tasks.findIndex(t => t.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const handleAddTask = () => {
    if (!inputValue.trim()) return;

    const result = addTask(inputValue);

    if (!result.success) {
      setErrorMessage(result.error || 'Error al agregar tarea');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setInputValue("");
    setErrorMessage('');
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditingTask(task);
      setIsEditModalOpen(true);
    }
  };

  const handleSaveEdit = (data: {
    text: string;
    category: Category;
    priority?: Priority;
    dueDate?: Date;
    tags: string[];
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        text: data.text,
        category: data.category,
        priority: data.priority,
        dueDate: data.dueDate?.toISOString(),
        tags: data.tags,
      });
      setEditingTask(null);
    }
  };

  const handleDeleteClick = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setDeletingTask(task);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingTask) {
      deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-dark dark:bg-background-dark light:bg-slate-50 text-slate-300 dark:text-slate-300 light:text-slate-900">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10 md:py-20">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">

            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white dark:text-white light:text-slate-900 text-4xl font-black leading-tight tracking-[-0.033em]">
                  Mi Lista de Tareas
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentView('list')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${currentView === 'list'
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                    aria-label="Vista de lista"
                  >
                    <span className="material-symbols-outlined text-[20px]">list</span>
                    <span className="text-sm font-medium hidden md:inline">Lista</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('stats')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${currentView === 'stats'
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                    aria-label="Vista de estadísticas"
                  >
                    <span className="material-symbols-outlined text-[20px]">bar_chart</span>
                    <span className="text-sm font-medium hidden md:inline">Estadísticas</span>
                  </button>
                  <button
                    onClick={() => setCurrentView('calendar')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${currentView === 'calendar'
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-slate-200'
                      }`}
                    aria-label="Vista de calendario"
                  >
                    <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                    <span className="text-sm font-medium hidden md:inline">Calendario</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-slate-800 light:bg-white hover:bg-slate-700 border border-slate-700 dark:border-slate-700 light:border-slate-300 rounded-lg transition-colors"
                  aria-label="Export/Import"
                >
                  <span className="material-symbols-outlined text-[20px]">upload_file</span>
                  <span className="text-sm font-medium hidden sm:inline">Exportar</span>
                </button>
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </div>


            {/* Conditional View Rendering */}
            {currentView === 'list' && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 pb-3">
                  <StatsCard
                    label="Tareas Pendientes"
                    count={pendingCount}
                    icon="pending_actions"
                    iconColorClass="text-slate-300"
                    iconBgClass="bg-slate-700"
                  />
                  <StatsCard
                    label="Tareas Completadas"
                    count={completedCount}
                    icon="task_alt"
                    iconColorClass="text-green-400"
                    iconBgClass="bg-green-500/20"
                  />
                </div>

                {/* New Task Input */}
                <div className="px-4 py-3">
                  <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-slate-300 dark:text-slate-300 light:text-slate-700 text-base font-medium leading-normal pb-2">
                        Nueva tarea
                      </p>
                      <div className="flex w-full flex-1 items-stretch rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 focus-within:ring-offset-transparent transition-shadow">
                        <input
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white dark:text-white light:text-slate-900 focus:outline-0 border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900 dark:bg-slate-900 light:bg-white border-r-0 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
                          placeholder="¿Qué necesitas hacer?"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          onClick={handleAddTask}
                          className="text-white flex border border-primary bg-primary items-center justify-center px-4 rounded-r-lg border-l-0 hover:bg-primary/90 transition-colors"
                          aria-label="Add task"
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                      {errorMessage && (
                        <p className="text-red-400 text-sm mt-2 animate-shake">{errorMessage}</p>
                      )}
                    </label>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="px-4 pt-3 pb-2">
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">
                        search
                      </span>
                    </div>
                    <input
                      className="w-full rounded-lg border border-slate-700 dark:border-slate-700 light:border-slate-300 bg-slate-900 dark:bg-slate-900 light:bg-white text-white dark:text-white light:text-slate-900 placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none h-12 pl-10 pr-4 text-base transition-all"
                      placeholder="Buscar tareas..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-4 px-4 pt-1 pb-5 overflow-x-auto no-scrollbar">
                  <div className="flex items-center gap-2 flex-nowrap whitespace-nowrap">
                    <p className="text-slate-400 text-sm font-medium mr-2">Filtrar por:</p>
                    <button
                      onClick={() => setFilterCategory('All')}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${filterCategory === 'All'
                          ? 'border-slate-500 bg-slate-700 text-white'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                    >
                      <span>Todas</span>
                    </button>

                    {(['Design', 'Development', 'Review', 'General'] as Category[]).map((cat) => {
                      const isSelected = filterCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setFilterCategory(cat)}
                          className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${isSelected
                              ? 'bg-slate-700 border-slate-500 text-white ring-1 ring-slate-500'
                              : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                          <span>{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Status Tab Switcher */}
                <div className="flex px-4 py-3">
                  <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-900 light:bg-slate-100 p-1 border border-slate-800 dark:border-slate-800 light:border-slate-300">
                    {(['Todas', 'Activas', 'Completadas'] as FilterStatus[]).map((status) => (
                      <label
                        key={status}
                        className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[7px] px-2 text-sm font-medium leading-normal transition-all duration-200 ${filterStatus === status
                            ? 'bg-slate-700 shadow-sm text-white'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 dark:hover:bg-slate-800 light:hover:bg-slate-200'
                          }`}
                      >
                        <span className="truncate">{status}</span>
                        <input
                          type="radio"
                          className="invisible w-0"
                          name="task-filter"
                          value={status}
                          checked={filterStatus === status}
                          onChange={() => setFilterStatus(status)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Task List with Drag & Drop */}
                <div className="flex flex-col divide-y divide-slate-800 dark:divide-slate-800 light:divide-slate-200 px-4 min-h-[300px]">
                  {filteredTasks.length > 0 ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={filteredTasks.map(t => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredTasks.map(task => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            onToggle={toggleTask}
                            onDelete={handleDeleteClick}
                            onEdit={handleEditTask}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                      <p>No se encontraron tareas</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Stats View */}
            {currentView === 'stats' && <StatsDashboard />}

            {/* Calendar View */}
            {currentView === 'calendar' && <CalendarView />}

          </div>
        </div>
      </div>

      {/* Modals */}
      <EditModal
        isOpen={isEditModalOpen}
        taskText={editingTask?.text || ""}
        category={editingTask?.category}
        priority={editingTask?.priority}
        dueDate={editingTask?.dueDate}
        tags={editingTask?.tags || []}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveEdit}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        taskText={deletingTask?.text || ""}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTask(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </div>
  );
}