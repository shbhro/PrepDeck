import { Volume2, X } from 'lucide-react';
import { useStore } from '../store';

const AudioToggle = () => {
    const { audioEnabled, toggleAudio } = useStore();
    return (
        <button
            onClick={toggleAudio}
            aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
            title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
            className="absolute top-4 right-16 md:top-6 md:right-20 p-2 md:p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 transition-all z-50 shadow-md hover:scale-110 border border-gray-200 dark:border-gray-700"
        >
            {audioEnabled ? <Volume2 size={20} /> : <X size={20} className="text-red-500" />}
        </button>
    );
};

export default AudioToggle;
