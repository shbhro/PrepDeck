import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store';

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useStore();
    return (
        <button
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 transition-all z-50 shadow-md hover:scale-110 border border-gray-200 dark:border-gray-700"
        >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default ThemeToggle;
