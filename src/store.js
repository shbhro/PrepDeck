import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Spaced Repetition Logic (0=Wrong, 1=Right)
const calculateNextReview = (rating, previousInterval) => {
    if (rating === 0) return 1; 
    if (rating === 1) return previousInterval * 1.5;
    return previousInterval * 2.5; 
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

            setVocab: (data) => {
                const dataWithIds = data.map((item, index) => ({
                    ...item,
                    id: index 
                }));
                set({ vocab: dataWithIds });
            },
            
            toggleTheme: () => set((state) => ({ darkMode: !state.darkMode })),

            startFlashcards: () => {
                const { vocab } = get();
                if (!vocab || vocab.length === 0) return;
                const shuffled = [...vocab].sort(() => 0.5 - Math.random());
                set({ currentDeck: shuffled, gameMode: 'flashcards' });
            },

            startQuiz: (count) => {
                const { vocab } = get();
                if (!vocab || vocab.length === 0) return;
                
                const safeCount = Math.max(1, Math.min(count, vocab.length));
                const shuffled = [...vocab].sort(() => 0.5 - Math.random());
                
                set({ 
                    currentDeck: shuffled.slice(0, safeCount), 
                    gameMode: 'quiz', 
                    score: 0, 
                    streak: 0,
                    quizLog: [] 
                });
            },

            submitAnswer: (wordId, isCorrect) => {
                const { vocab, quizLog } = get();
                const word = vocab.find(w => w.id === wordId);

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
            name: 'hsk-storage', // Key for localStorage
            partialize: (state) => ({ 
                // We only want to save these fields
                score: state.score, 
                streak: state.streak, 
                userProgress: state.userProgress,
                darkMode: state.darkMode
            }),
        }
    )
);