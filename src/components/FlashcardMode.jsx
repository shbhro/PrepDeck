import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useStore } from '../store';
import { triggerHaptic, speak } from '../utils/helpers';
import ExitButton from './ExitButton';

const FlashcardMode = () => {
    const { currentDeck, setMode } = useStore();
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const current = currentDeck[index];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                setIsFlipped(prev => !prev);
            }
            if (e.code === 'ArrowRight') {
                triggerHaptic('light');
                setIndex((prev) => (prev + 1) % currentDeck.length);
                setIsFlipped(false);
            }
            if (e.code === 'ArrowLeft') {
                triggerHaptic('light');
                setIndex((prev) => Math.max(0, prev - 1));
                setIsFlipped(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentDeck.length]);

    const parseExample = (exStr) => {
        if (!exStr) return { hanzi: "", pinyin: "" };
        const parts = exStr.split('\n');
        return { hanzi: parts[0] || "", pinyin: parts[1] || "" };
    };

    const highlightWord = (text) => {
        if (!text) return null;
        return text.split('～').map((part, i, arr) => (
            <span key={i}>
                {part}
                {i < arr.length - 1 && (
                    <span className="text-blue-600 dark:text-cyan-300 font-bold border-b-2 border-blue-400 dark:border-cyan-500 mx-1 px-1">
                        {current.front}
                    </span>
                )}
            </span>
        ));
    };

    const getPosColor = useCallback((pos) => {
        const p = pos?.toLowerCase() || "";
        if (p.includes('verb')) return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-800";
        if (p.includes('noun')) return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-800";
        if (p.includes('adj')) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-800";
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600";
    }, []);

    const getFontSize = useCallback((text) => {
        if (!text) return "text-7xl md:text-8xl";
        if (text.length > 3) return "text-5xl md:text-6xl";
        if (text.length === 3) return "text-6xl md:text-7xl";
        return "text-7xl md:text-9xl";
    }, []);

    if (!current) return <div className="text-center mt-20 text-gray-500 dark:text-white">Loading Deck...</div>;
    const exampleObj = parseExample(current.back.example);

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 cursor-grab active:cursor-grabbing w-full relative z-10" onClick={() => { triggerHaptic('light'); setIsFlipped(!isFlipped); }}>
            <ExitButton onClick={() => setMode('menu')} />

            <div className="relative w-full max-w-[20rem] md:max-w-sm h-[450px] md:h-[600px] group" style={{ perspective: "2000px" }}>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, rotateY: -90 }}
                    animate={{ opacity: 1, rotateY: 0, rotateX: isFlipped ? 180 : 0 }}
                    exit={{ opacity: 0, rotateY: 90 }}
                    transition={{
                        default: { duration: 0.6, type: "spring", stiffness: 260, damping: 20 },
                        rotateX: { duration: 0.6, type: "spring", stiffness: 260, damping: 20 }
                    }}
                    drag="x"
                    dragElastic={0.3}
                    dragConstraints={{ left: -100, right: 100 }}
                    whileDrag={{
                        scale: 0.95,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                    }}
                    onDragEnd={(e, info) => {
                        if (info.offset.x > 50) {
                            triggerHaptic('light');
                            setIndex((prev) => Math.max(0, prev - 1));
                            setIsFlipped(false);
                        } else if (info.offset.x < -50) {
                            triggerHaptic('light');
                            setIndex((prev) => (prev + 1) % currentDeck.length);
                            setIsFlipped(false);
                        }
                    }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center shadow-2xl overflow-hidden px-2"
                         style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>

                        <button onClick={(e) => { e.stopPropagation(); speak(current.front); }} aria-label="Play pronunciation" className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-cyan-900/50 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors z-20 shadow-sm">
                            <Volume2 size={24} />
                        </button>

                        <h2 className={`${getFontSize(current.front)} font-bold text-gray-800 dark:text-white mb-2 drop-shadow-sm text-center px-2 break-words leading-tight transition-all duration-300`}>
                            {current.front}
                        </h2>

                        <p className="text-gray-400 text-xs md:text-sm mt-8 uppercase tracking-[0.3em] font-bold">Tap to flip</p>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-full bg-blue-50 dark:bg-gradient-to-br dark:from-cyan-950 dark:to-slate-900 border border-blue-100 dark:border-cyan-800 rounded-3xl flex flex-col p-4 md:p-6 shadow-2xl overflow-y-auto"
                        style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                        <div className="text-center border-b border-blue-200 dark:border-cyan-800 pb-4 mb-4 relative">
                            <button onClick={(e) => { e.stopPropagation(); speak(current.front); }} aria-label="Play pronunciation" className="absolute top-0 right-0 p-2 text-blue-400 hover:text-blue-600 dark:text-cyan-600 dark:hover:text-cyan-300 transition-colors">
                                <Volume2 size={20} />
                            </button>
                            <h3 className="text-3xl md:text-4xl text-blue-600 dark:text-cyan-400 font-medium font-sans mb-2">{current.back.hanzi_pinyin}</h3>
                            <span className={`px-2 py-1 md:px-3 text-[10px] md:text-xs font-bold rounded-full uppercase tracking-wider border ${getPosColor(current.back.part_of_speech)}`}>{current.back.part_of_speech || "WORD"}</span>
                        </div>

                        <div className="mb-6 text-center flex-grow flex items-center justify-center">
                            <p className="text-gray-700 dark:text-gray-100 text-lg md:text-xl leading-relaxed font-medium">{current.back.meaning}</p>
                        </div>

                        {current.back.measure_word && (
                            <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3 mb-4 flex justify-between items-center border border-white/50 dark:border-white/5">
                                <span className="text-[10px] md:text-xs text-gray-500 dark:text-cyan-500/80 uppercase font-bold tracking-wide">Measure Word</span>
                                <div className="text-right">
                                    <span className="text-gray-800 dark:text-white font-bold text-sm md:text-md">{current.back.measure_word}</span>
                                </div>
                            </div>
                        )}

                        {current.back.example && (
                            <div className="mt-auto bg-blue-100/50 dark:bg-black/30 rounded-xl p-3 md:p-4 text-left border border-blue-200/50 dark:border-white/5 relative overflow-hidden group/ex cursor-pointer hover:bg-blue-100/70 dark:hover:bg-black/40 transition-colors"
                                onClick={(e) => { e.stopPropagation(); speak(exampleObj.hanzi.replace('～', current.front)); }}
                            >
                                <div className="absolute top-1 right-2 text-6xl text-blue-200/50 dark:text-white/5 font-serif select-none pointer-events-none">”</div>
                                <p className="text-[10px] md:text-xs text-blue-500 dark:text-cyan-500/80 uppercase font-bold mb-1 tracking-wider">Context</p>
                                <p className="text-gray-800 dark:text-gray-200 text-base md:text-lg font-medium leading-snug mb-2 z-10 relative">{highlightWord(exampleObj.hanzi)}</p>
                                <p className="text-blue-600/70 dark:text-cyan-200/50 text-xs md:text-sm font-mono leading-tight">{exampleObj.pinyin}</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="mt-6 md:mt-8 flex gap-4 w-full max-w-[20rem] md:max-w-sm">
                <motion.button
                    onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); setIndex((prev) => Math.max(0, prev - 1)); setIsFlipped(false); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-transparent rounded-xl shadow-sm font-bold text-sm md:text-base"
                >
                    Prev
                </motion.button>
                <motion.button
                    onClick={(e) => { e.stopPropagation(); triggerHaptic('light'); setIndex((prev) => (prev + 1) % currentDeck.length); setIsFlipped(false); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-xl shadow-lg font-bold text-sm md:text-base"
                >
                    Next
                </motion.button>
            </div>
        </div>
    );
};

export default FlashcardMode;
