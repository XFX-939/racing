import { cars } from "@/data/cars";
import { tracks } from "@/data/tracks";
import type { RaceResult } from "@/types/game";

const STORAGE_KEY = "felix-racing-arena-results";

export interface LeaderboardAdapter {
  list: () => Promise<RaceResult[]>;
  save: (result: RaceResult) => Promise<RaceResult[]>;
}

const mockResults: RaceResult[] = [
  {
    id: "seed-1",
    playerName: "Felix",
    trackId: tracks[0].id,
    trackName: tracks[0].name,
    carId: cars[2].id,
    carName: cars[2].name,
    mode: "time-trial",
    totalTime: 96.842,
    bestLapTime: 31.216,
    maxSpeed: 92,
    driftDistance: 420,
    collisionCount: 1,
    offTrackTime: 1.2,
    nitroUsed: 88,
    score: 95600,
    rating: "S",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-2",
    playerName: "Nova",
    trackId: tracks[1].id,
    trackName: tracks[1].name,
    carId: cars[3].id,
    carName: cars[3].name,
    mode: "time-trial",
    totalTime: 91.337,
    bestLapTime: 29.704,
    maxSpeed: 99,
    driftDistance: 220,
    collisionCount: 0,
    offTrackTime: 0.6,
    nitroUsed: 93,
    score: 91450,
    rating: "S",
    createdAt: new Date().toISOString()
  },
  {
    id: "seed-3",
    playerName: "Vega",
    trackId: tracks[2].id,
    trackName: tracks[2].name,
    carId: cars[1].id,
    carName: cars[1].name,
    mode: "time-trial",
    totalTime: 128.48,
    bestLapTime: 41.902,
    maxSpeed: 95,
    driftDistance: 380,
    collisionCount: 2,
    offTrackTime: 2.8,
    nitroUsed: 76,
    score: 78520,
    rating: "A",
    createdAt: new Date().toISOString()
  }
];

function sortResults(results: RaceResult[]): RaceResult[] {
  return [...results].sort((a, b) => b.score - a.score || a.totalTime - b.totalTime);
}

export function getLeaderboard(): RaceResult[] {
  if (typeof window === "undefined") {
    return sortResults(mockResults);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return sortResults(mockResults);
    }
    const parsed = JSON.parse(raw) as RaceResult[];
    if (!Array.isArray(parsed)) {
      return sortResults(mockResults);
    }
    return sortResults([...parsed, ...mockResults]);
  } catch {
    return sortResults(mockResults);
  }
}

export function saveRaceResult(result: RaceResult): RaceResult[] {
  if (typeof window === "undefined") {
    return [result, ...mockResults];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const existing = raw ? (JSON.parse(raw) as RaceResult[]) : [];
    const cleanExisting = Array.isArray(existing) ? existing : [];
    const next = sortResults([result, ...cleanExisting]).slice(0, 100);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return sortResults([...next, ...mockResults]);
  } catch {
    return sortResults([result, ...mockResults]);
  }
}

export function getTopResults(limit = 5): RaceResult[] {
  return getLeaderboard().slice(0, limit);
}

export function isToday(value: string): boolean {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export const localLeaderboardAdapter: LeaderboardAdapter = {
  list: async () => getLeaderboard(),
  save: async (result) => saveRaceResult(result)
};
