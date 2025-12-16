/**
 * Fisher-Yates Shuffle Algorithm
 * Provides uniform random distribution for shuffling arrays
 * @param {Array} array - The array to shuffle
 * @returns {Array} A new shuffled copy of the array
 */
export const fisherYatesShuffle = (array) => {
    const arr = [...array]; // Don't mutate the original array
    
    for (let i = arr.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i (inclusive)
        const j = Math.floor(Math.random() * (i + 1));
        
        // Swap elements at i and j
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    
    return arr;
};
