/**
 * Web Speech Synthesis utility for native Vietnamese pronunciation.
 * Supports configurable playback rate and automatic cancellation of overlapping utterances.
 */
export const speakVietnamese = (text, rate = 0.9) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }
};

export default speakVietnamese;
