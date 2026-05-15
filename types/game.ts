export type Difficulty = "easy" | "normal" | "hard";

export type GameMode = "time-trial" | "career" | "practice";

export type RacePhase = "setup" | "countdown" | "racing" | "paused" | "finished";

export type QualitySetting = "auto" | "high" | "medium" | "low";

export interface TrackPoint {
  x: number;
  z: number;
}

export interface CarConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  accentColor: string;
  maxSpeed: number;
  acceleration: number;
  handling: number;
  nitroPower: number;
  driftControl: number;
}

export interface TrackConfig {
  id: string;
  name: string;
  description: string;
  difficulty: Difficulty;
  laps: number;
  targetTime: number;
  environment: string;
  themeColor: string;
  roadWidth: number;
  checkpoints: TrackPoint[];
}

export interface ControlsState {
  accelerate: boolean;
  brake: boolean;
  left: boolean;
  right: boolean;
  drift: boolean;
  nitro: boolean;
}

export interface RaceTelemetry {
  speedKmh: number;
  lap: number;
  totalLaps: number;
  checkpointIndex: number;
  checkpointTotal: number;
  elapsedTime: number;
  bestLapTime: number;
  nitro: number;
  driftActive: boolean;
  collisionCount: number;
  offTrackTime: number;
  maxSpeedKmh: number;
  driftDistance: number;
  progress: number;
}

export interface RaceStats {
  trackId: string;
  trackName: string;
  carId: string;
  carName: string;
  mode: GameMode;
  totalTime: number;
  bestLapTime: number;
  maxSpeed: number;
  driftDistance: number;
  collisionCount: number;
  offTrackTime: number;
  nitroUsed: number;
}

export interface RaceResult extends RaceStats {
  id: string;
  playerName: string;
  score: number;
  rating: "S" | "A" | "B" | "C" | "D";
  createdAt: string;
}
