import { RotateCcw } from 'lucide-react';

const ExitButton = ({ onClick }) => (
    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            aria-label="Exit to menu"
            className="flex items-center gap-2 hover:text-cyan-600 text-gray-600 dark:text-white dark:hover:text-cyan-400 font-bold bg-white/50 dark:bg-black/20 p-2 rounded-lg backdrop-blur-sm text-xs md:text-sm shadow-sm transition-all"
        >
            <RotateCcw size={16} /> <span className="hidden md:inline">Exit</span>
        </button>
    </div>
);

export default ExitButton;
