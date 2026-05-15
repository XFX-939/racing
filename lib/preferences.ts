import type { QualitySetting } from "@/types/game";

const CAR_KEY = "felix-selected-car";
const TRACK_KEY = "felix-selected-track";
const QUALITY_KEY = "felix-quality";
const SOUND_KEY = "felix-sound";

function read(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked in private contexts; the game keeps running with defaults.
  }
}

export function getSelectedCarId(): string | null {
  return read(CAR_KEY);
}

export function setSelectedCarId(id: string): void {
  write(CAR_KEY, id);
}

export function getSelectedTrackId(): string | null {
  return read(TRACK_KEY);
}

export function setSelectedTrackId(id: string): void {
  write(TRACK_KEY, id);
}

export function getQualitySetting(): QualitySetting {
  const value = read(QUALITY_KEY);
  return value === "high" || value === "medium" || value === "low" || value === "auto" ? value : "auto";
}

export function setQualitySetting(value: QualitySetting): void {
  write(QUALITY_KEY, value);
}

export function getSoundEnabled(): boolean {
  return read(SOUND_KEY) !== "off";
}

export function setSoundEnabled(enabled: boolean): void {
  write(SOUND_KEY, enabled ? "on" : "off");
}
