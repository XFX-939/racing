import type { CarConfig, ControlsState, GameMode, RaceStats, RaceTelemetry, TrackConfig, TrackPoint } from "@/types/game";
import { clamp } from "@/lib/format";
import { distance, getClosestTrackPoint, getStartHeading } from "@/lib/track";

export const KMH_PER_UNIT = 8.6;

export interface CarPhysicsState {
  position: TrackPoint;
  heading: number;
  speed: number;
  wheelSpin: number;
  nitro: number;
  nitroActive: boolean;
  nitroUsed: number;
  driftActive: boolean;
  steerInput: number;
  elapsedTime: number;
  lapStartTime: number;
  bestLapTime: number;
  completedLaps: number;
  lap: number;
  checkpointIndex: number;
  collisionCount: number;
  collisionCooldown: number;
  collisionFlash: number;
  offTrackTime: number;
  driftDistance: number;
  maxSpeedKmh: number;
  progress: number;
  finished: boolean;
}

export function createInitialPhysicsState(track: TrackConfig): CarPhysicsState {
  const start = track.checkpoints[0] ?? { x: 0, z: 0 };
  return {
    position: { x: start.x, z: start.z },
    heading: getStartHeading(track),
    speed: 0,
    wheelSpin: 0,
    nitro: 100,
    nitroActive: false,
    nitroUsed: 0,
    driftActive: false,
    steerInput: 0,
    elapsedTime: 0,
    lapStartTime: 0,
    bestLapTime: 0,
    completedLaps: 0,
    lap: 1,
    checkpointIndex: Math.min(1, Math.max(0, track.checkpoints.length - 1)),
    collisionCount: 0,
    collisionCooldown: 0,
    collisionFlash: 0,
    offTrackTime: 0,
    driftDistance: 0,
    maxSpeedKmh: 0,
    progress: 0,
    finished: false
  };
}

export function mergeControls(a: ControlsState, b: ControlsState): ControlsState {
  return {
    accelerate: a.accelerate || b.accelerate,
    brake: a.brake || b.brake,
    left: a.left || b.left,
    right: a.right || b.right,
    drift: a.drift || b.drift,
    nitro: a.nitro || b.nitro
  };
}

export function updateCarPhysics(state: CarPhysicsState, controls: ControlsState, car: CarConfig, track: TrackConfig, dt: number) {
  if (state.finished) return;

  const step = clamp(dt, 0, 0.05);
  const baseMaxSpeed = Math.max(6, car.maxSpeed / KMH_PER_UNIT);
  const acceleration = 4.6 + car.acceleration / 17;
  const braking = 9.5;
  const reverseAcceleration = 3.4;
  const steer = (controls.right ? 1 : 0) - (controls.left ? 1 : 0);
  const absoluteSpeed = Math.abs(state.speed);
  const speedRatio = clamp(absoluteSpeed / baseMaxSpeed, 0, 1.35);
  const canNitro = controls.nitro && state.nitro > 0 && state.speed > 1;
  const nitroMultiplier = canNitro ? 1 + car.nitroPower / 180 : 1;
  const maxSpeed = baseMaxSpeed * (canNitro ? 1.26 + car.nitroPower / 900 : 1);
  const isDrifting = controls.drift && Math.abs(steer) > 0 && state.speed > 2.2;

  state.elapsedTime += step;
  state.steerInput = steer;
  state.driftActive = isDrifting;
  state.nitroActive = canNitro;
  state.collisionCooldown = Math.max(0, state.collisionCooldown - step);
  state.collisionFlash = Math.max(0, state.collisionFlash - step * 2.6);

  if (controls.accelerate) {
    state.speed += acceleration * nitroMultiplier * step;
  }
  if (controls.brake) {
    if (state.speed > 0.4) {
      state.speed -= braking * step;
    } else {
      state.speed -= reverseAcceleration * step;
    }
  }
  if (!controls.accelerate && !controls.brake) {
    state.speed *= Math.pow(0.62, step);
    if (Math.abs(state.speed) < 0.02) {
      state.speed = 0;
    }
  }

  state.speed = clamp(state.speed, -2.4, maxSpeed);

  const steerResponsiveness = (1.9 + car.handling / 62) * (1 - Math.min(speedRatio, 1) * 0.46);
  const driftBoost = isDrifting ? 1.34 + car.driftControl / 260 : 1;
  const speedTurnFactor = clamp(absoluteSpeed / baseMaxSpeed, 0.22, 1);
  state.heading += steer * steerResponsiveness * driftBoost * speedTurnFactor * Math.sign(state.speed || 1) * step;

  if (isDrifting) {
    state.speed *= Math.pow(0.92, step);
    state.driftDistance += absoluteSpeed * step * 2.4;
    state.nitro = clamp(state.nitro + (5 + car.driftControl / 18) * step, 0, 100);
  }

  if (canNitro) {
    const used = (15 + car.nitroPower / 5) * step;
    state.nitro = clamp(state.nitro - used, 0, 100);
    state.nitroUsed += used;
  } else {
    state.nitro = clamp(state.nitro + 5.4 * step, 0, 100);
  }

  const forward = { x: Math.sin(state.heading), z: Math.cos(state.heading) };
  const right = { x: Math.cos(state.heading), z: -Math.sin(state.heading) };
  const lateralSlide = isDrifting ? steer * state.speed * step * (0.2 + car.driftControl / 450) : 0;

  state.position.x += forward.x * state.speed * step + right.x * lateralSlide;
  state.position.z += forward.z * state.speed * step + right.z * lateralSlide;
  state.wheelSpin += state.speed * step * 4.6;

  const closest = getClosestTrackPoint(state.position, track);
  const roadLimit = track.roadWidth * 0.5;
  const barrierLimit = roadLimit + 1.4;

  if (closest.distance > roadLimit) {
    state.offTrackTime += step;
    state.speed *= Math.pow(0.52, step);
  }

  if (closest.distance > barrierLimit) {
    state.position.x = closest.point.x + closest.normal.x * barrierLimit;
    state.position.z = closest.point.z + closest.normal.z * barrierLimit;
    if (state.collisionCooldown <= 0) {
      state.collisionCount += 1;
      state.collisionCooldown = 0.7;
      state.collisionFlash = 1;
    }
    state.speed = state.speed > 0 ? -Math.max(0.65, state.speed * 0.18) : Math.min(0.6, Math.abs(state.speed) * 0.2);
  }

  const speedKmh = Math.max(0, state.speed * KMH_PER_UNIT);
  state.maxSpeedKmh = Math.max(state.maxSpeedKmh, speedKmh);

  updateCheckpoints(state, track);
}

function updateCheckpoints(state: CarPhysicsState, track: TrackConfig) {
  const total = track.checkpoints.length;
  if (total < 2 || state.finished) {
    return;
  }

  const nextCheckpoint = track.checkpoints[state.checkpointIndex] ?? track.checkpoints[0];
  const checkpointRadius = Math.max(6.5, track.roadWidth * 0.6);

  if (distance(state.position, nextCheckpoint) <= checkpointRadius) {
    if (state.checkpointIndex === 0) {
      const lapTime = state.elapsedTime - state.lapStartTime;
      state.bestLapTime = state.bestLapTime > 0 ? Math.min(state.bestLapTime, lapTime) : lapTime;
      state.completedLaps += 1;
      state.lapStartTime = state.elapsedTime;

      if (state.completedLaps >= track.laps) {
        state.finished = true;
        state.lap = track.laps;
        state.progress = 1;
        return;
      }

      state.lap = state.completedLaps + 1;
      state.checkpointIndex = 1;
    } else {
      state.checkpointIndex = (state.checkpointIndex + 1) % total;
    }
  }

  const passedInLap = state.checkpointIndex === 0 ? total - 1 : state.checkpointIndex;
  state.progress = clamp((state.completedLaps + passedInLap / total) / track.laps, 0, 1);
}

export function getRaceTelemetry(state: CarPhysicsState, track: TrackConfig): RaceTelemetry {
  return {
    speedKmh: Math.max(0, state.speed * KMH_PER_UNIT),
    lap: clamp(state.lap, 1, track.laps),
    totalLaps: track.laps,
    checkpointIndex: state.checkpointIndex + 1,
    checkpointTotal: track.checkpoints.length,
    elapsedTime: state.elapsedTime,
    bestLapTime: state.bestLapTime,
    nitro: state.nitro,
    driftActive: state.driftActive,
    collisionCount: state.collisionCount,
    offTrackTime: state.offTrackTime,
    maxSpeedKmh: state.maxSpeedKmh,
    driftDistance: state.driftDistance,
    progress: state.progress
  };
}

export function getRaceStats(state: CarPhysicsState, car: CarConfig, track: TrackConfig, mode: GameMode = "time-trial"): RaceStats {
  return {
    trackId: track.id,
    trackName: track.name,
    carId: car.id,
    carName: car.name,
    mode,
    totalTime: state.elapsedTime,
    bestLapTime: state.bestLapTime > 0 ? state.bestLapTime : state.elapsedTime,
    maxSpeed: state.maxSpeedKmh,
    driftDistance: state.driftDistance,
    collisionCount: state.collisionCount,
    offTrackTime: state.offTrackTime,
    nitroUsed: state.nitroUsed
  };
}
