import { useEffect, useState } from 'react';
import { useStore } from './store';
import { getBestVoice } from './utils/helpers';

import ThemeToggle from './components/ThemeToggle';
import AudioToggle from './components/AudioToggle';
import Footer from './components/Footer';
import Menu from './components/Menu';
import QuizMode from './components/QuizMode';
import FlashcardMode from './components/FlashcardMode';
import Summary from './components/Summary';

// --- MAIN APP ---
export default function App() {
    const { gameMode, setVocab, darkMode } = useStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/hsk3_master.json');
                if (!response.ok) {
                    throw new Error(`Failed to load vocabulary: ${response.status}`);
                }
                const data = await response.json();
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid vocabulary data format');
                }
                setVocab(data);
                setError(null);
            } catch (err) {
                console.error('Error loading vocabulary:', err);
                setError(err.message || 'Failed to load vocabulary data');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
        
        const loadVoices = () => { 
            if (window.speechSynthesis.getVoices().length > 0) getBestVoice(); 
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, [setVocab]);

    if (isLoading) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-cyan-400 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading vocabulary...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={darkMode ? 'dark' : ''}>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md shadow-xl border border-gray-200 dark:border-gray-700">
                        <div className="text-red-500 text-5xl mb-4 text-center">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">Error Loading App</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans selection:bg-blue-200 dark:selection:bg-cyan-900 flex flex-col relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
                <ThemeToggle />
                <AudioToggle />
                <main className="flex-grow flex flex-col items-center justify-center w-full z-10">
                    {gameMode === 'menu' && <Menu />}
                    {gameMode === 'quiz' && <QuizMode />}
                    {gameMode === 'flashcards' && <FlashcardMode />}
                    {gameMode === 'summary' && <Summary />}
                </main>
                <Footer />
            </div>
        </div>
    );
}
