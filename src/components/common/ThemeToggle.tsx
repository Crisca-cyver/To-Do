import React from 'react';

interface ThemeToggleProps {
    theme: 'light' | 'dark';
    onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            className="flex items-center justify-center size-10 rounded-lg bg-slate-800 dark:bg-slate-800 light:bg-slate-200 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-slate-300 border border-slate-700 dark:border-slate-700 light:border-slate-300 transition-colors"
            aria-label="Toggle theme"
        >
            <span className="material-symbols-outlined text-slate-300 dark:text-slate-300 light:text-slate-700">
                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
