import type { RaceResult, RaceStats } from "@/types/game";

function makeId(): string {
  return `race-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function calculateRaceResult(stats: RaceStats, playerName: string): RaceResult {
  const safeTime = Number.isFinite(stats.totalTime) && stats.totalTime > 0 ? stats.totalTime : 999;
  const targetBase = stats.trackId === "desert-loop" ? 95 : stats.trackId === "mountain-pass" ? 125 : 105;
  const timeScore = Math.max(0, Math.round((targetBase / safeTime) * 52000));
  const driftBonus = Math.min(9000, Math.round(stats.driftDistance * 18));
  const nitroBonus = Math.min(6500, Math.round(stats.nitroUsed * 24));
  const speedBonus = Math.min(7000, Math.round(stats.maxSpeed * 52));
  const collisionPenalty = stats.collisionCount * 2600;
  const offTrackPenalty = Math.round(stats.offTrackTime * 900);
  const rawScore = 26000 + timeScore + driftBonus + nitroBonus + speedBonus - collisionPenalty - offTrackPenalty;
  const score = Math.max(1200, Math.round(rawScore));
  const rating = score >= 90000 ? "S" : score >= 76000 ? "A" : score >= 60000 ? "B" : score >= 42000 ? "C" : "D";

  return {
    ...stats,
    id: makeId(),
    playerName: playerName.trim() || "匿名车手",
    totalTime: safeTime,
    bestLapTime: Number.isFinite(stats.bestLapTime) && stats.bestLapTime > 0 ? stats.bestLapTime : safeTime,
    maxSpeed: Number.isFinite(stats.maxSpeed) ? stats.maxSpeed : 0,
    driftDistance: Number.isFinite(stats.driftDistance) ? stats.driftDistance : 0,
    collisionCount: Number.isFinite(stats.collisionCount) ? stats.collisionCount : 0,
    offTrackTime: Number.isFinite(stats.offTrackTime) ? stats.offTrackTime : 0,
    nitroUsed: Number.isFinite(stats.nitroUsed) ? stats.nitroUsed : 0,
    score,
    rating,
    createdAt: new Date().toISOString()
  };
}
