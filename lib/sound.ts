type ToneKind = "countdown" | "go" | "finish" | "select";

interface AudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

let audioContext: AudioContext | null = null;
let musicTimer: number | null = null;
let musicGain: GainNode | null = null;
let musicStep = 0;

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

function scheduleMusicVoice(context: AudioContext, frequency: number, start: number, duration: number, type: OscillatorType, volume: number) {
  if (!musicGain) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.006, start + duration * 0.72);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(musicGain);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

function scheduleMusicPulse(context: AudioContext) {
  const now = context.currentTime;
  const bassLine = [73.42, 73.42, 98, 87.31, 65.41, 65.41, 87.31, 98];
  const leadLine = [293.66, 349.23, 392, 466.16, 440, 392, 349.23, 329.63];
  const bass = bassLine[musicStep % bassLine.length] ?? 73.42;
  const lead = leadLine[musicStep % leadLine.length] ?? 293.66;

  scheduleMusicVoice(context, bass, now, 0.22, "sawtooth", 0.028);
  scheduleMusicVoice(context, bass * 0.5, now, 0.2, "triangle", 0.018);

  if (musicStep % 2 === 0) {
    scheduleMusicVoice(context, lead, now + 0.03, 0.16, "square", 0.011);
  }

  if (musicStep % 4 === 3) {
    scheduleMusicVoice(context, lead * 1.5, now + 0.08, 0.11, "triangle", 0.008);
  }

  musicStep += 1;
}

export function startBackgroundMusic(enabled: boolean) {
  if (!enabled || musicTimer !== null) return;
  const context = getAudioContext();
  if (!context) return;

  void context.resume().catch(() => undefined);

  musicGain = context.createGain();
  musicGain.gain.setValueAtTime(0.0001, context.currentTime);
  musicGain.gain.exponentialRampToValueAtTime(0.7, context.currentTime + 0.8);
  musicGain.connect(context.destination);
  musicStep = 0;
  scheduleMusicPulse(context);
  musicTimer = window.setInterval(() => scheduleMusicPulse(context), 240);
}

export function stopBackgroundMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }

  if (musicGain && audioContext) {
    const gain = musicGain;
    gain.gain.cancelScheduledValues(audioContext.currentTime);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.35);
    window.setTimeout(() => gain.disconnect(), 450);
  }

  musicGain = null;
}
