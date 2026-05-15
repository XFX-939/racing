type ToneKind = "countdown" | "go" | "finish" | "select";

interface AudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const audioWindow = window as AudioWindow;
  const AudioCtor = window.AudioContext ?? audioWindow.webkitAudioContext;
  if (!AudioCtor) return null;
  if (!audioContext) {
    audioContext = new AudioCtor();
  }
  return audioContext;
}

export function playTone(kind: ToneKind, enabled: boolean) {
  if (!enabled) return;
  const context = getAudioContext();
  if (!context) return;

  const frequencies: Record<ToneKind, number> = {
    countdown: 520,
    go: 880,
    finish: 660,
    select: 420
  };
  const duration = kind === "finish" ? 0.42 : 0.12;
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = kind === "finish" ? "triangle" : "square";
  oscillator.frequency.setValueAtTime(frequencies[kind], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.03);
}
