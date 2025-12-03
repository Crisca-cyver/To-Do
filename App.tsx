import React, { useState, useMemo, useEffect } from 'react';
import { Task, Category, FilterStatus, CATEGORY_STYLES } from './types';
import StatsCard from './components/StatsCard';
import TaskItem from './components/TaskItem';

const INITIAL_TASKS: Task[] = [
  { id: 1, text: "Diseñar la interfaz de usuario en Figma", completed: false, category: 'Design' },
  { id: 2, text: "Desarrollar componentes de React", completed: false, category: 'Development' },
  { id: 3, text: "Implementar la lógica de estado", completed: false, category: 'Development' },
  { id: 4, text: "Revisar el feedback del equipo", completed: true, category: 'Review' },
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Activas');

  // Logic to calculate stats
  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  const handleAddTask = () => {
    if (!inputValue.trim()) return;

    // For demo purposes, we'll assign a category based on keywords or random
    // since the UI doesn't explicitly have a category picker in the add row.
    let assignedCategory: Category = 'General';
    const lowerText = inputValue.toLowerCase();
    
    if (lowerText.includes('design') || lowerText.includes('diseñ') || lowerText.includes('figma') || lowerText.includes('ui') || lowerText.includes('ux')) {
      assignedCategory = 'Design';
    } else if (lowerText.includes('dev') || lowerText.includes('cod') || lowerText.includes('react') || lowerText.includes('api') || lowerText.includes('bug')) {
      assignedCategory = 'Development';
    } else if (lowerText.includes('revis') || lowerText.includes('check') || lowerText.includes('test')) {
      assignedCategory = 'Review';
    }

    const newTask: Task = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      category: assignedCategory
    };

    setTasks(prev => [newTask, ...prev]);
    setInputValue("");
  };

  const handleToggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const newText = prompt("Editar tarea:", task.text);
      if (newText !== null && newText.trim() !== "") {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, text: newText } : t));
      }
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. Filter by Status
      if (filterStatus === 'Activas' && task.completed) return false;
      if (filterStatus === 'Completadas' && !task.completed) return false;

      // 2. Filter by Category
      if (filterCategory !== 'All' && task.category !== filterCategory) return false;

      // 3. Filter by Search
      if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      return true;
    });
  }, [tasks, filterStatus, filterCategory, searchQuery]);

  // Handle Enter key in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddTask();
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-background-dark text-slate-300">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-10 md:py-20">
          <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
            
            {/* Header */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Mi Lista de Tareas</p>
              </div>
            </div>

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
                  <p className="text-slate-300 text-base font-medium leading-normal pb-2">Nueva tarea</p>
                  <div className="flex w-full flex-1 items-stretch rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 focus-within:ring-offset-transparent transition-shadow">
                    <input 
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-l-lg text-white focus:outline-0 border border-slate-700 bg-slate-900 border-r-0 placeholder:text-slate-500 p-[15px] text-base font-normal leading-normal"
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
                </label>
              </div>
            </div>

            {/* Search Bar */}
            <div className="px-4 pt-3 pb-2">
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input 
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none h-12 pl-10 pr-4 text-base transition-all"
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
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                    filterCategory === 'All' 
                      ? 'border-slate-500 bg-slate-700 text-white' 
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span>Todas</span>
                </button>
                
                {(['Design', 'Development', 'Review'] as Category[]).map((cat) => {
                   const style = CATEGORY_STYLES[cat];
                   const isSelected = filterCategory === cat;
                   return (
                     <button 
                       key={cat}
                       onClick={() => setFilterCategory(cat)}
                       className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
                         isSelected ? `bg-opacity-20 ${style.bg} border-${style.text.split('-')[1]}-400 ring-1 ring-${style.text.split('-')[1]}-400` : `${style.border} ${style.bg} ${style.text} hover:bg-opacity-30`
                       }`}
                     >
                        <span className={`size-2 rounded-full ${style.dot}`}></span>
                        <span>{style.label}</span>
                     </button>
                   );
                })}
              </div>
            </div>

            {/* Status Tab Switcher */}
            <div className="flex px-4 py-3">
              <div className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-900 p-1 border border-slate-800">
                {(['Todas', 'Activas', 'Completadas'] as FilterStatus[]).map((status) => (
                  <label key={status} className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-[7px] px-2 text-sm font-medium leading-normal transition-all duration-200 ${
                    filterStatus === status 
                      ? 'bg-slate-700 shadow-sm text-white' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}>
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

            {/* Task List */}
            <div className="flex flex-col divide-y divide-slate-800 px-4 min-h-[300px]">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={handleToggleTask} 
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inbox</span>
                  <p>No se encontraron tareas</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}