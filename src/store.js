import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fisherYatesShuffle } from './utils/shuffle';

// Spaced Repetition Logic (0=Wrong, 1=Right)
const calculateNextReview = (rating, previousInterval) => {
    if (rating === 0) return 1; 
    if (rating === 1) return Math.round(previousInterval * 1.5);
    return Math.round(previousInterval * 2.5); 
};


export const useStore = create(
    persist(
        (set, get) => ({
            vocab: [],
            userProgress: {}, 
            currentDeck: [],
            quizLog: [],
            gameMode: 'menu', 
            score: 0,
            streak: 0,
            darkMode: true,
            audioEnabled: true,

            setVocab: (data) => {
                if (!Array.isArray(data)) {
                    console.error('Invalid vocab data: expected array');
                    return;
                }
                const dataWithIds = data.map((item, index) => ({
                    ...item,
                    id: item.id ?? index 
                }));
                set({ vocab: dataWithIds });
            },
            
            toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),
            toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),

            startFlashcards: () => {
                const { vocab } = get();
                if (!vocab || vocab.length === 0) {
                    console.warn('No vocabulary available for flashcards');
                    return;
                }
                const shuffled = fisherYatesShuffle(vocab);
                set({ currentDeck: shuffled, gameMode: 'flashcards' });
            },

            startQuiz: (count) => {
                const { vocab } = get();
                if (!vocab || vocab.length === 0) {
                    console.warn('No vocabulary available for quiz');
                    return;
                }
                
                const safeCount = Math.max(1, Math.min(count, vocab.length));
                const shuffled = fisherYatesShuffle(vocab);
                
                set({ 
                    currentDeck: shuffled.slice(0, safeCount), 
                    gameMode: 'quiz', 
                    score: 0, 
                    streak: 0,
                    quizLog: [] 
                });
            },

            // --- NEW: WEAKNESS REVIEW ACTION ---
            startWeaknessReview: () => {
                const { quizLog } = get();
                // 1. Filter only the words the user got WRONG
                const wrongAnswers = quizLog.filter(item => !item.isCorrect);
                
                if (wrongAnswers.length === 0) {
                    console.warn('No wrong answers to review');
                    return;
                }

                // 2. Shuffle them for the new round
                const shuffled = fisherYatesShuffle(wrongAnswers);

                // 3. Start a new Quiz session with ONLY these words
                set({
                    currentDeck: shuffled,
                    gameMode: 'quiz', // Re-enter quiz mode
                    score: 0,
                    streak: 0,
                    quizLog: [] // Reset log for this new session
                });
            },

            submitAnswer: (wordId, isCorrect) => {
                const { vocab, quizLog } = get();
                const word = vocab.find(w => w.id === wordId);
                
                if (!word) {
                    console.error(`Word with id ${wordId} not found`);
                    return;
                }

                set((state) => {
                    const progress = state.userProgress[wordId] || { interval: 1, reviews: 0 };
                    const newInterval = calculateNextReview(isCorrect ? 1 : 0, progress.interval);
                    const newLogEntry = { ...word, isCorrect };

                    return {
                        score: isCorrect ? state.score + 100 : state.score,
                        streak: isCorrect ? state.streak + 1 : 0,
                        quizLog: [...state.quizLog, newLogEntry],
                        userProgress: {
                            ...state.userProgress,
                            [wordId]: { interval: newInterval, reviews: progress.reviews + 1 }
                        }
                    };
                });
            },

            setMode: (mode) => set({ gameMode: mode }),
        }),
        {
            name: 'hsk-storage',
            partialize: (state) => ({ 
                score: state.score, 
                streak: state.streak, 
                userProgress: state.userProgress,
                darkMode: state.darkMode,
                audioEnabled: state.audioEnabled
            }),
        }
    )
);