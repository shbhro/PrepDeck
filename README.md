# PrepDeck - HSK3 Quiz & Flashcards 🇨🇳

An interactive Chinese vocabulary learning app focused on HSK Level 3, featuring quiz mode and flashcards with spaced repetition.

**🌐 [Live Demo](https://chic-truffle-27b2b7.netlify.app/)**

## Features ✨

- **600 Official HSK 3 Words** - Complete vocabulary from the official HSK Level 3 list
- **Speed Quiz Mode** - Test your vocabulary against the clock with multiple-choice questions
- **Flashcard Mode** - Study at your own pace with detailed word information
- **Progressive Web App (PWA)** - Install on any device, works offline after first load
- **Text-to-Speech** - Native Chinese pronunciation for all vocabulary
- **Haptic Feedback** - Subtle vibrations on mobile for better interaction
- **Dark Mode** - Easy on the eyes for extended study sessions
- **Progress Tracking** - Review your quiz results and retry mistakes
- **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack 🛠️

- **React 19** - Modern UI framework
- **Vite 7** - Lightning-fast build tool
- **Vite PWA Plugin** - Progressive Web App support with service workers
- **Zustand** - Lightweight state management with persistence
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Canvas Confetti** - Celebration effects for correct answers

## Getting Started 🚀

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure 📁

```
├── public/
│   ├── hsk3_master.json    # Main vocabulary database (600 words)
│   ├── hsk3_vocab.json     # Synced vocab data
│   └── icons/              # PWA icons
│       ├── pwa-192.svg
│       └── pwa-512.svg
├── src/
│   ├── App.jsx             # Main application component
│   ├── store.js            # Zustand state management
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── vite.config.js          # Vite + PWA configuration
└── package.json
```

## Vocabulary Data Format 📝

Theid": 1,
"word": "汉字",
"pinyin": "hàn zì",
"pos": "n",
"meaning": "Chinese characters",
"measure_word": "个",
"measure_word_pinyin": "gè",
"example": "这个～很难写。",
"example_pinyin": "zhè gè ～ hěn nán xiě 。" "meaning": "Chinese characters",
"part_of_speech": "noun",
"measure_word": "个",
"example": "这个汉字很难写。\nZhège hànzì hěn nán xiě."
}
}

```

## Features in Detail 📚

### Quiz Mode

- Customizable quiz length (5-50 words)
- Multiple-choice format with randomized options
- Real-time score and streak tracking
- Immediate feedback with visual/audio cues
- Review sheet with all answers

### Flashcard Mode

- Front: Chinese characters with large, readable font
- Back: Pinyin, meaning, part of speech, measure word, example sentence
- Keyboard navigation (Space to flip, Arrow keys to navigate)
- One-tap pronunciation playback

### Spaced Repetition

- Tracks individual word progress
- Adjusts review intervals based on performance
- Stores learning data locally

## Keyboard Shortcuts ⌨️

**Flashcard Mode:**

- `Space` - Flip card
- `→` - Next card
- `←` - Previous card

## Browser Compatibility 🌐

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing 🤝

Contributions are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

## License 📄

MIT License - feel free to use this project for your own learning!

## Acknowledgments 🙏

Powered by **Laddu** - Making language learning accessible and fun.
```
