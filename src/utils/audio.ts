let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, startTimeOffset = 0, type: OscillatorType = 'sine', gainValue = 0.14) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + startTimeOffset;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.02);
  } catch {
    // Ignore audio context errors on restricted browsers
  }
}

export function playSoundEffect(kind: 'correct' | 'retry' | 'flip' | 'victory', enabled: boolean) {
  if (!enabled) return;
  if (kind === 'flip') {
    playTone(520, 0.08, 0, 'triangle', 0.08);
    return;
  }
  if (kind === 'retry') {
    playTone(330, 0.14, 0, 'sine', 0.1);
    playTone(280, 0.18, 0.11, 'sine', 0.08);
    return;
  }
  if (kind === 'correct') {
    playTone(523.25, 0.14, 0, 'triangle', 0.14);
    playTone(659.25, 0.14, 0.1, 'triangle', 0.14);
    playTone(783.99, 0.24, 0.2, 'triangle', 0.16);
    return;
  }
  if (kind === 'victory') {
    playTone(523.25, 0.14, 0, 'triangle', 0.14);
    playTone(659.25, 0.14, 0.11, 'triangle', 0.14);
    playTone(783.99, 0.14, 0.22, 'triangle', 0.15);
    playTone(1046.5, 0.36, 0.34, 'triangle', 0.18);
  }
}

export function speakKorean(text: string, enabled: boolean) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Ignore speech synthesis errors on unsupported browsers
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
}
