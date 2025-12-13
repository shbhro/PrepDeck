import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, BookOpen, RotateCcw, Check, X, Trophy, Moon, Sun, Volume2, RefreshCw } from 'lucide-react';
import { useStore } from './store';

// --- SMART AUDIO ENGINE ---
let voiceCache = null;

const getBestVoice = () => {
    if (voiceCache) return voiceCache; 

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const priorityList = [
        "Xiaoxiao", "Yunxi", "Google 普通话", "Google Chinese", "Lili", "Ting-Ting", "zh-CN"
    ];

    for (const name of priorityList) {
        const found = voices.find(v => v.name.includes(name) || v.lang === name);
        if (found) {
            voiceCache = found;
            return found;
        }
    }
    return null;
};

const speak = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const bestVoice = getBestVoice();

    if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang;
    } else {
        utterance.lang = 'zh-CN';
    }

    utterance.rate = 0.8; 
    synth.speak(utterance);
};

// --- REUSABLE COMPONENTS ---

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

const Footer = () => (
    <footer className="w-full text-center py-6 mt-auto z-10">
        <p className="text-[10px] md:text-xs font-mono text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1 opacity-60">
            Powered by <span className="font-bold text-blue-500 dark:text-blue-400">Laddu</span>
        </p>
    </footer>
);

// --- MENU SCREEN ---
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
            <p className="text-gray-600 dark:text-gray-400 mb-8 md:mb-12 font-medium tracking-wide text-sm md:text-base">Master HSK Vocab • {vocab.length} Words Loaded</p>

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

                    <button onClick={() => startQuiz(quizCount)} aria-label={`Start quiz with ${quizCount} words`} className="w-full py-3 md:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all transform hover:-translate-y-1">Start Quiz</button>
                </div>

                {/* Flashcard Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-xl border border-white dark:border-gray-700 transition-all hover:shadow-emerald-500/20 group flex flex-col">
                    <div className="mb-4 md:mb-6 inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit">
                        <BookOpen size={24} className="md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800 dark:text-white">Flashcards</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm mb-6 md:mb-8">Relaxed study mode. Randomized order.</p>
                    <div className="mt-auto">
                        <button onClick={() => startFlashcards()} aria-label="Open flashcard deck" className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base md:text-lg shadow-lg transition-all transform hover:-translate-y-1">Open Deck</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- QUIZ MODE ---
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
        const isCorrect = selectedCard.id === currentCard.id;
        if (isCorrect) speak(currentCard.front); 
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
                {options.map((opt) => (
                    <motion.button
                        key={opt.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(opt)}
                        className={`
                            p-4 md:p-6 rounded-2xl border-2 text-base md:text-lg font-medium transition-all shadow-md text-left relative overflow-hidden
                            ${showResult && opt.id === currentCard.id ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-900/50 dark:border-green-400 dark:text-green-100' : ''}
                            ${showResult === 'wrong' && opt.id !== currentCard.id ? 'opacity-50' : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:border-cyan-500'}
                        `}
                    >
                        {opt.back.meaning.split(';')[0].substring(0, 60)}...
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

// --- FLASHCARD MODE ---
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
                setIndex((prev) => (prev + 1) % currentDeck.length);
                setIsFlipped(false);
            }
            if (e.code === 'ArrowLeft') {
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
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 cursor-pointer w-full relative z-10" onClick={() => setIsFlipped(!isFlipped)}>
            <ExitButton onClick={() => setMode('menu')} />

            <div className="relative w-full max-w-[20rem] md:max-w-sm h-[450px] md:h-[600px] group" style={{ perspective: "1000px" }}>
                <motion.div
                    initial={false}
                    animate={{ rotateX: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
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
                <button onClick={(e) => { e.stopPropagation(); setIndex((prev) => Math.max(0, prev - 1)); setIsFlipped(false); }} className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-transparent rounded-xl shadow-sm font-bold text-sm md:text-base">Prev</button>
                <button onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % currentDeck.length); setIsFlipped(false); }} className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-xl shadow-lg font-bold text-sm md:text-base">Next</button>
            </div>
        </div>
    );
};

// --- SUMMARY SCREEN ---
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
                <button onClick={() => setMode('menu')} className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-transparent px-8 py-3 rounded-2xl font-bold shadow-md transition-all">
                    Menu
                </button>
                
                {wrongCount > 0 && (
                    <button onClick={startWeaknessReview} className="flex items-center gap-2 bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl hover:bg-amber-600 transition-all transform hover:-translate-y-1">
                        <RefreshCw size={20} />
                        Retry Mistakes ({wrongCount})
                    </button>
                )}
            </div>
        </div>
    );
};

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