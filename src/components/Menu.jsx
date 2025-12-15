import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen } from 'lucide-react';
import { useStore } from '../store';
import { triggerHaptic } from '../utils/helpers';

const Menu = () => {
    const { startQuiz, startFlashcards, vocab } = useStore();
    const [quizCount, setQuizCount] = useState(10);

    return (
        <div className="flex-grow flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-4 md:p-6 relative z-10 min-h-[500px]">
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-5xl md:text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 text-center"
            >
                PrepDeck
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-12 font-medium tracking-wide text-sm md:text-base">Master HSK Vocabs </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full max-w-md md:max-w-4xl">
                {/* Quiz Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-white dark:border-gray-700 transition-all hover:shadow-blue-500/20 group">
                    <div className="mb-4 md:mb-6 inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Play size={24} className="md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">Speed Quiz</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-6 md:mb-8">Test your memory against the clock.</p>

                    <div className="mb-6 md:mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs md:text-sm font-bold text-gray-600 dark:text-gray-300">Words:</span>
                            <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400">{quizCount}</span>
                        </div>
                        <input
                            type="range" min="5" max={Math.min(50, vocab.length)} step="5" value={quizCount}
                            onChange={(e) => setQuizCount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <motion.button
                        onClick={() => { triggerHaptic('medium'); startQuiz(quizCount); }}
                        aria-label={`Start quiz with ${quizCount} words`}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all"
                    >
                        Start Quiz
                    </motion.button>
                </div>

                {/* Flashcard Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-white dark:border-gray-700 transition-all hover:shadow-emerald-500/20 group flex flex-col">
                    <div className="mb-4 md:mb-6 inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit">
                        <BookOpen size={24} className="md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">Flashcards</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-6 md:mb-8">Relaxed study mode. Randomized order.</p>
                    <div className="mt-auto">
                        <motion.button
                            onClick={() => { triggerHaptic('medium'); startFlashcards(); }}
                            aria-label="Open flashcard deck"
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all"
                        >
                            Open Deck
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;
