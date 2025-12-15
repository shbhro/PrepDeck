import { motion } from 'framer-motion';
import { Trophy, Check, X, Volume2, RefreshCw } from 'lucide-react';
import { useStore } from '../store';
import { triggerHaptic, speak } from '../utils/helpers';

const Summary = () => {
    const { score, setMode, quizLog, startWeaknessReview } = useStore();
    const wrongCount = quizLog.filter(x => !x.isCorrect).length;

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative w-full max-w-4xl mx-auto overflow-hidden">
            <div className="text-center mb-6 md:mb-8">
                <Trophy size={50} className="text-yellow-500 dark:text-yellow-400 mb-4 mx-auto drop-shadow-lg md:w-16 md:h-16" />
                <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">Quiz Complete!</h1>
                <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 font-medium">Final Score: <span className="text-blue-600 dark:text-cyan-400">{score}</span></p>
            </div>

            <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex-1 mb-6 md:mb-8 flex flex-col border border-gray-200 dark:border-gray-700 max-h-[50vh]">
                <div className="p-4 md:p-5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 font-bold text-gray-500 dark:text-gray-300 flex justify-between uppercase tracking-wider text-xs md:text-sm">
                    <span>Review Sheet</span>
                    <span>{quizLog.filter(x => x.isCorrect).length} / {quizLog.length} Correct</span>
                </div>

                <div className="overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50 flex-1">
                    {quizLog.map((log, i) => (
                        <div key={i} className={`flex items-center p-3 md:p-4 rounded-xl border-l-4 shadow-sm bg-white dark:bg-gray-800 ${log.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="mr-4 md:mr-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0">
                                {log.isCorrect ? <Check className="text-green-600 dark:text-green-400 w-4 h-4 md:w-5 md:h-5" /> : <X className="text-red-600 dark:text-red-400 w-4 h-4 md:w-5 md:h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3 mb-1">
                                    <span className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white truncate">{log.front}</span>
                                    <span className="text-xs md:text-base text-gray-500 dark:text-gray-400 font-medium truncate">{log.back.hanzi_pinyin}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm truncate">{log.back.meaning}</p>
                            </div>
                            <button onClick={() => speak(log.front)} aria-label={`Play pronunciation for ${log.front}`} className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors shrink-0">
                                <Volume2 size={20} className="md:w-6 md:h-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <motion.button
                    onClick={() => { triggerHaptic('light'); setMode('menu'); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-transparent px-8 py-3 rounded-2xl font-bold shadow-md transition-all"
                >
                    Menu
                </motion.button>

                {wrongCount > 0 && (
                    <motion.button
                        onClick={() => { triggerHaptic('medium'); startWeaknessReview(); }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-amber-600 transition-all"
                    >
                        <RefreshCw size={20} />
                        Retry Mistakes ({wrongCount})
                    </motion.button>
                )}
            </div>
        </div>
    );
};

export default Summary;
