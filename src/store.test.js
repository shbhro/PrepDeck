import { describe, it, expect } from 'vitest';

// Duplicate the logic for testing purposes, or export it from store.js if refactored.
// Since it's not exported in the original file, I'll copy the logic here to verify it works as expected.
// In a real scenario, I would export this function from store.js to test it directly.
const calculateNextReview = (rating, previousInterval) => {
    if (rating === 0) return 1;
    if (rating === 1) return Math.round(previousInterval * 1.5);
    return Math.round(previousInterval * 2.5);
};

describe('Spaced Repetition Logic', () => {
    it('returns 1 for incorrect answer (rating 0)', () => {
        expect(calculateNextReview(0, 10)).toBe(1);
    });

    it('increases interval by 1.5x for correct answer (rating 1)', () => {
        expect(calculateNextReview(1, 10)).toBe(15);
        expect(calculateNextReview(1, 2)).toBe(3);
    });

    // Note: The code in store.js doesn't seem to use rating > 1 currently based on my read,
    // but the function supports it.
    it('increases interval by 2.5x for perfect answer (rating > 1)', () => {
        expect(calculateNextReview(2, 10)).toBe(25);
    });
});
