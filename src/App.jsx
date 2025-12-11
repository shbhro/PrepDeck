import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, BookOpen, RotateCcw, Check, X, Trophy, Moon, Sun, Volume2 } from 'lucide-react';
import { useStore } from './store';

// --- SMART AUDIO ENGINE ---
let voiceCache = null;

const getBestVoice = () => {
    if (voiceCache) return voiceCache; 

    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const priorityList = [
        "Xiaoxiao",        // Edge (Natural - Best)
        "Yunxi",           // Edge (Natural)
        "Google 普通话",    // Chrome (Google Neural)
        "Google Chinese",  // Chrome Fallback
        "Lili",            // macOS (Natural)
        "Ting-Ting",       // macOS
        "zh-CN"            // Generic System Fallback
    ];

    for (const name of priorityList) {
        const found = voices.find(v => v.name.includes(name) || v.lang === name);
        if (found) {
            console.log(`🎤 Voice Locked: ${found.name}`);
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

// --- THEME TOGGLE ---
const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useStore();
    return (
        <button 
            onClick={toggleTheme} 
            className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 transition-all z-50 shadow-md hover:scale-110 border border-gray-200 dark:border-gray-700"
        >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    );
};

// --- FOOTER COMPONENT ---
// Fixed: Added padding and proper spacing
const Footer = () => (
    <footer className="w-full text-center py-8 mt-auto z-10">
        <p className="text-xs font-mono text-gray-400 dark:text-gray-600 flex items-center justify-center gap-1 opacity-60">
            Powered by <span className="font-bold text-blue-500 dark:text-blue-400">Laddu</span>
        </p>
    </footer>
);

// --- MENU SCREEN ---
const Menu = () => {
    const { startQuiz, startFlashcards, vocab } = useStore();
    const [quizCount, setQuizCount] = useState(10);
    
    return (
        <div className="flex-grow flex flex-col items-center justify-center w-full max-w-5xl mx-auto p-6 relative z-10">
            <motion.h1 
                initial={{ y: -50, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                className="text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 text-center"
            >
                PrepDeck
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mb-12 font-medium tracking-wide">Master HSK Vocab</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white dark:border-gray-700 transition-all hover:shadow-blue-500/20 hover:border-blue-500/30 group">
                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        <Play size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Speed Quiz</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Test your memory against the clock.</p>
                    
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Words:</span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{quizCount}</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max={Math.min(50, vocab.length)} 
                            step="5"
                            value={quizCount}
                            onChange={(e) => setQuizCount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>

                    <button 
                        onClick={() => startQuiz(quizCount)}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-600/30 transition-all transform hover:-translate-y-1"
                    >
                        Start Quiz
                    </button>
                </div>

                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white dark:border-gray-700 transition-all hover:shadow-emerald-500/20 hover:border-emerald-500/30 group flex flex-col">
                    <div className="mb-6 inline-flex p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-fit">
                        <BookOpen size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Flashcards</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Relaxed study mode. Randomized order.</p>
                    
                    <div className="mt-auto">
                        <button 
                            onClick={() => startFlashcards()}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-1"
                        >
                            Open Deck
                        </button>
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

    // Dynamic Sizing for Quiz Question
    const getFontSize = (text) => {
        if (!text) return "text-8xl";
        if (text.length > 3) return "text-6xl";
        if (text.length === 3) return "text-7xl";
        return "text-9xl";
    };

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

    const handleAnswer = (selectedCard) => {
        if (showResult) return;

        const isCorrect = selectedCard.id === currentCard.id;
        if (isCorrect) speak(currentCard.front); 

        setShowResult(isCorrect ? 'correct' : 'wrong');
        submitAnswer(currentCard.id, isCorrect);

        if (isCorrect) confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

        setTimeout(() => {
            if (index < currentDeck.length - 1) {
                setIndex(index + 1);
                setShowResult(null);
            } else {
                setMode('summary');
            }
        }, 1500);
    };

    if (!currentCard) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

    const progress = (quizLog.length / currentDeck.length) * 100;

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 relative w-full max-w-4xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-blue-500 dark:bg-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="w-full flex justify-between items-center mb-12 mt-8 font-mono text-gray-800 dark:text-white font-bold">
                <div>SCORE: {score} <span className="mx-2 text-gray-300">|</span> STREAK: {streak}x</div>
                <div>{index + 1} / {currentDeck.length}</div>
            </div>

            <motion.div 
                key={currentCard.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-12 text-center w-full"
            >
                <div className={`${getFontSize(currentCard.front)} font-bold mb-6 font-sans text-gray-900 dark:text-white drop-shadow-xl transition-all duration-300`}>
                    {currentCard.front}
                </div>
                <div className="text-xl font-mono tracking-[0.2em] uppercase text-blue-500 dark:text-cyan-400 font-bold">Select Meaning</div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {options.map((opt) => (
                    <motion.button
                        key={opt.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(opt)}
                        className={`
                            p-6 rounded-2xl border-2 text-lg font-medium transition-all shadow-md text-left relative overflow-hidden
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

// --- FLASHCARD MODE (FIXED 3D) ---
const FlashcardMode = () => {
    const { currentDeck, setMode } = useStore();
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const current = currentDeck[index];

    const parseExample = (exStr) => {
        if (!exStr) return { hanzi: "", pinyin: "" };
        const parts = exStr.split('\n');
        return { hanzi: parts[0] || "", pinyin: parts[1] || "" };
    };

    const highlightWord = (text) => {
        if (!text) return null;
        return text.split('～').map((part, i, arr) => (
            <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && (
                    <span className="text-blue-600 dark:text-cyan-300 font-bold border-b-2 border-blue-400 dark:border-cyan-500 mx-1 px-1">
                        {current.front}
                    </span>
                )}
            </React.Fragment>
        ));
    };

    const getPosColor = (pos) => {
        const p = pos?.toLowerCase() || "";
        if (p.includes('verb')) return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-800";
        if (p.includes('noun')) return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-800";
        if (p.includes('adj')) return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 border-amber-200 dark:border-amber-800";
        if (p.includes('adv')) return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-800";
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600";
    };

    // FIXED: Dynamic Font Sizing for Flashcard
    const getFontSize = (text) => {
        if (!text) return "text-8xl";
        if (text.length > 3) return "text-6xl"; 
        if (text.length === 3) return "text-7xl";
        return "text-9xl"; 
    };

    if (!current) return <div className="text-center mt-20 text-gray-500 dark:text-white">Loading Deck...</div>;

    const exampleObj = parseExample(current.back.example);

    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 cursor-pointer w-full relative z-10" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="absolute top-6 left-6 z-20">
                <button onClick={(e) => { e.stopPropagation(); setMode('menu'); }} className="flex items-center gap-2 hover:text-cyan-600 text-gray-600 dark:text-white dark:hover:text-cyan-400 font-bold bg-white/50 dark:bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                    <RotateCcw size={20} /> Exit
                </button>
            </div>

            {/* CARD CONTAINER - Height increased to 600px */}
            <div className="relative w-full max-w-sm h-[600px] group" style={{ perspective: "1000px" }}>
                <motion.div
                    initial={false}
                    animate={{ rotateX: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    className="w-full h-full relative" // 'relative' here is for the flipper wrapper itself
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT - FIXED: Removed 'relative', now 'absolute' to prevent collision */}
                    <div className="absolute top-0 left-0 w-full h-full bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center shadow-2xl overflow-hidden" 
                         style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                speak(current.front);
                            }}
                            className="absolute top-6 right-6 p-3 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 dark:bg-gray-700 dark:hover:bg-cyan-900/50 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors z-20 shadow-sm"
                        >
                            <Volume2 size={28} />
                        </button>

                        <h2 className={`${getFontSize(current.front)} font-bold text-gray-800 dark:text-white mb-2 drop-shadow-sm text-center px-4 transition-all duration-300`}>
                            {current.front}
                        </h2>
                        
                        <p className="text-gray-400 text-sm mt-8 uppercase tracking-[0.3em] font-bold">Tap to flip</p>
                    </div>

                    {/* BACK - FIXED: Strictly 'absolute' */}
                    <div 
                        className="absolute top-0 left-0 w-full h-full bg-blue-50 dark:bg-gradient-to-br dark:from-cyan-950 dark:to-slate-900 border border-blue-100 dark:border-cyan-800 rounded-3xl flex flex-col p-6 shadow-2xl overflow-y-auto"
                        style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                        <div className="text-center border-b border-blue-200 dark:border-cyan-800 pb-4 mb-4 relative">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    speak(current.front);
                                }}
                                className="absolute top-0 right-0 p-2 text-blue-400 hover:text-blue-600 dark:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
                            >
                                <Volume2 size={24} />
                            </button>

                            <h3 className="text-4xl text-blue-600 dark:text-cyan-400 font-medium font-sans mb-2">{current.back.hanzi_pinyin}</h3>
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider border ${getPosColor(current.back.part_of_speech)}`}>
                                {current.back.part_of_speech || "WORD"}
                            </span>
                        </div>

                        <div className="mb-6 text-center flex-grow flex items-center justify-center">
                            <p className="text-gray-700 dark:text-gray-100 text-xl leading-relaxed font-medium">
                                {current.back.meaning}
                            </p>
                        </div>

                        {current.back.measure_word && (
                            <div className="bg-white/60 dark:bg-black/20 rounded-xl p-3 mb-4 flex justify-between items-center border border-white/50 dark:border-white/5">
                                <span className="text-xs text-gray-500 dark:text-cyan-500/80 uppercase font-bold tracking-wide">Measure Word</span>
                                <div className="text-right">
                                    <span className="text-gray-800 dark:text-white font-bold text-md">{current.back.measure_word}</span>
                                </div>
                            </div>
                        )}

                        {current.back.example && (
                            <div 
                                className="mt-auto bg-blue-100/50 dark:bg-black/30 rounded-xl p-4 text-left border border-blue-200/50 dark:border-white/5 relative overflow-hidden group/ex cursor-pointer hover:bg-blue-100/70 dark:hover:bg-black/40 transition-colors" 
                                onClick={(e) => { e.stopPropagation(); speak(exampleObj.hanzi.replace('~', current.front)); }}
                            >
                                <div className="absolute top-1 right-2 text-6xl text-blue-200/50 dark:text-white/5 font-serif select-none pointer-events-none">”</div>
                                <div className="flex justify-between items-center mb-1">
                                    <p className="text-xs text-blue-500 dark:text-cyan-500/80 uppercase font-bold tracking-wider">Context</p>
                                    <Volume2 size={14} className="text-blue-400 dark:text-cyan-600 opacity-0 group-hover/ex:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-snug mb-2 z-10 relative">
                                    {highlightWord(exampleObj.hanzi)}
                                </p>
                                <p className="text-blue-600/70 dark:text-cyan-200/50 text-sm font-mono leading-tight">
                                    {exampleObj.pinyin}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
            
            <div className="mt-8 flex gap-4 w-full max-w-sm">
                <button onClick={(e) => { e.stopPropagation(); setIndex((prev) => Math.max(0, prev - 1)); setIsFlipped(false); }} className="flex-1 py-3 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-transparent rounded-xl shadow-sm font-bold">Prev</button>
                <button onClick={(e) => { e.stopPropagation(); setIndex((prev) => (prev + 1) % currentDeck.length); setIsFlipped(false); }} className="flex-1 py-3 bg-blue-600 text-white hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 rounded-xl shadow-lg font-bold">Next</button>
            </div>
        </div>
    );
};

// --- SUMMARY SCREEN ---
const Summary = () => {
    const { score, setMode, quizLog } = useStore();
    
    return (
        <div className="flex-grow flex flex-col items-center justify-center p-6 relative w-full max-w-4xl mx-auto overflow-hidden">
            <div className="text-center mb-8">
                <Trophy size={60} className="text-yellow-500 dark:text-yellow-400 mb-4 mx-auto drop-shadow-lg" />
                <h1 className="text-5xl font-bold mb-2 tracking-tight">Quiz Complete!</h1>
                <p className="text-2xl text-gray-600 dark:text-gray-400 font-medium">Final Score: <span className="text-blue-600 dark:text-cyan-400">{score}</span></p>
            </div>

            <div className="w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex-1 mb-8 flex flex-col border border-gray-200 dark:border-gray-700 max-h-[50vh]">
                <div className="p-5 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600 font-bold text-gray-500 dark:text-gray-300 flex justify-between uppercase tracking-wider text-sm">
                    <span>Review Sheet</span>
                    <span>{quizLog.filter(x => x.isCorrect).length} / {quizLog.length} Correct</span>
                </div>
                
                <div className="overflow-y-auto p-4 space-y-3 bg-gray-50/50 dark:bg-gray-900/50 flex-1">
                    {quizLog.map((log, i) => (
                        <div key={i} className={`flex items-center p-4 rounded-xl border-l-4 shadow-sm bg-white dark:bg-gray-800 ${log.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                            <div className="mr-5 p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                                {log.isCorrect ? <Check className="text-green-600 dark:text-green-400" size={20} /> : <X className="text-red-600 dark:text-red-400" size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-baseline gap-3 mb-1">
                                    <span className="text-2xl font-bold text-gray-800 dark:text-white">{log.front}</span>
                                    <span className="text-base text-gray-500 dark:text-gray-400 font-medium">{log.back.hanzi_pinyin}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">{log.back.meaning}</p>
                            </div>
                            <button onClick={() => speak(log.front)} className="p-2 text-gray-400 hover:text-blue-500 dark:hover:text-cyan-400 transition-colors">
                                <Volume2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={() => setMode('menu')} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 transition-all transform hover:-translate-y-1">
                Return to Menu
            </button>
        </div>
    );
};

// --- MAIN APP ---
export default function App() {
    const { gameMode, setVocab, darkMode } = useStore();

    useEffect(() => {
        fetch('/hsk3_master.json')
            .then(res => res.json())
            .then(data => setVocab(data))
            .catch(err => console.error("Failed to load vocab", err));

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) getBestVoice(); 
        };

        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
        
    }, []);

    // FIX: Main container is now Flex Column with min-h-screen
    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans selection:bg-blue-200 dark:selection:bg-cyan-900 flex flex-col relative overflow-hidden">
                
                {/* Background Glows (Fixed Position) */}
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

                <ThemeToggle />
                
                {/* Content Area (Grows to push footer down) */}
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