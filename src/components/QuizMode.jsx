import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useStore } from '../store';
import { triggerHaptic, speak } from '../utils/helpers';
import ExitButton from './ExitButton';

const QuizMode = () => {
    const { currentDeck, submitAnswer, setMode, score, streak, quizLog } = useStore();
    const [index, setIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [showResult, setShowResult] = useState(null);

    const currentCard = currentDeck[index];

    const getFontSize = useCallback((text) => {
        if (!text) return "text-6xl md:text-8xl";
        if (text.length > 3) return "text-4xl md:text-6xl";
        if (text.length === 3) return "text-5xl md:text-7xl";
        return "text-7xl md:text-9xl";
    }, []);

    useEffect(() => {
        if (!currentCard) return;
        const { vocab } = useStore.getState();
        const distractors = vocab
            .filter(w => w.id !== currentCard.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        const allOptions = [...distractors, currentCard].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
    }, [index, currentCard]);

    const handleAnswer = useCallback((selectedCard) => {
        if (showResult) return;
        triggerHaptic('medium');
        const isCorrect = selectedCard.id === currentCard.id;
        if (isCorrect) {
            speak(currentCard.front);
            triggerHaptic('success');
        } else {
            triggerHaptic('error');
        }
        setShowResult(isCorrect ? 'correct' : 'wrong');
        submitAnswer(currentCard.id, isCorrect);
        if (isCorrect) confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        setTimeout(() => {
            if (index < currentDeck.length - 1) { setIndex(index + 1); setShowResult(null); }
            else { setMode('summary'); }
        }, 1500);
    }, [showResult, currentCard, index, currentDeck.length, submitAnswer, setMode]);

    if (!currentCard) return <div className="text-center mt-20 text-gray-500">Loading...</div>;
    const progress = (quizLog.length / currentDeck.length) * 100;

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 relative w-full max-w-4xl mx-auto">
            <ExitButton onClick={() => setMode('menu')} />

            <div className="absolute top-0 left-0 w-full h-1 md:h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div className="h-full bg-blue-500 dark:bg-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
            </div>

            <div className="w-full flex justify-between items-center mb-8 md:mb-12 mt-16 md:mt-20 font-mono text-gray-800 dark:text-white font-bold text-sm md:text-base px-2">
                <div>SCORE: {score} <span className="mx-2 text-gray-300">|</span> STREAK: {streak}x</div>
                <div>{index + 1} / {currentDeck.length}</div>
            </div>

            <motion.div key={currentCard.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 md:mb-12 text-center w-full px-2">
                <div className={`${getFontSize(currentCard.front)} font-bold mb-4 md:mb-6 font-sans text-gray-900 dark:text-white drop-shadow-xl transition-all duration-300 break-words`}>
                    {currentCard.front}
                </div>
                <div className="text-lg md:text-xl font-mono tracking-[0.2em] uppercase text-blue-500 dark:text-cyan-400 font-bold">Select Meaning</div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
                {options.map((opt) => {
                    const meaning = opt.back.meaning.split(';')[0];
                    const displayText = meaning.length > 60 ? meaning.substring(0, 60) + '...' : meaning;

                    return (
                        <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            onClick={() => handleAnswer(opt)}
                            className={`
                                p-4 md:p-6 rounded-2xl border-2 text-base md:text-lg font-medium transition-all shadow-md text-center relative overflow-hidden
                                ${showResult && opt.id === currentCard.id ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/50 dark:border-green-400 dark:text-green-100' : ''}
                                ${showResult === 'wrong' && opt.id !== currentCard.id ? 'opacity-50' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:border-cyan-500'}
                            `}
                        >
                            {displayText}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuizMode;
