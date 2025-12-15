import { useStore } from '../store';

// --- SMART AUDIO ENGINE ---
let voiceCache = null;

export const getBestVoice = () => {
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

// --- HAPTIC FEEDBACK ---
export const triggerHaptic = (style = 'light') => {
    if ('vibrate' in navigator) {
        switch(style) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            case 'success':
                navigator.vibrate([10, 50, 10]);
                break;
            case 'error':
                navigator.vibrate([50, 30, 50]);
                break;
            default:
                navigator.vibrate(10);
        }
    }
};

export const speak = (text) => {
    if (!text) return;

    const { audioEnabled } = useStore.getState();
    if (!audioEnabled) return;

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
