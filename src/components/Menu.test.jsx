import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Menu from './Menu';

// Mock dependencies
vi.mock('../store', () => ({
  useStore: vi.fn(() => ({
    startQuiz: vi.fn(),
    startFlashcards: vi.fn(),
    vocab: Array(20).fill({}), // Mock vocab with 20 items
  })),
}));

vi.mock('../utils/helpers', () => ({
  triggerHaptic: vi.fn(),
}));

describe('Menu Component', () => {
  it('renders the title correctly', () => {
    render(<Menu />);
    expect(screen.getByText('PrepDeck')).toBeInTheDocument();
  });

  it('renders Start Quiz button', () => {
    render(<Menu />);
    expect(screen.getByText('Start Quiz')).toBeInTheDocument();
  });

  it('renders Flashcards button', () => {
    render(<Menu />);
    expect(screen.getByText('Open Deck')).toBeInTheDocument();
  });
});
