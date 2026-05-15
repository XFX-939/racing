import type { TrackConfig, TrackPoint } from "@/types/game";

export interface TrackSegment {
  start: TrackPoint;
  end: TrackPoint;
  dx: number;
  dz: number;
  length: number;
  angle: number;
}

export interface ClosestTrackPoint {
  point: TrackPoint;
  distance: number;
  segmentIndex: number;
  normal: TrackPoint;
}

export function getTrackSegments(track: TrackConfig): TrackSegment[] {
  return track.checkpoints.map((start, index) => {
    const end = track.checkpoints[(index + 1) % track.checkpoints.length];
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const length = Math.hypot(dx, dz) || 1;
    return {
      start,
      end,
      dx,
      dz,
      length,
      angle: Math.atan2(dx, dz)
    };
  });
}

export function distance(a: TrackPoint, b: TrackPoint): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

export function getClosestTrackPoint(position: TrackPoint, track: TrackConfig): ClosestTrackPoint {
  const segments = getTrackSegments(track);
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestPoint = track.checkpoints[0];
  let bestSegment = 0;
  let bestNormal = { x: 1, z: 0 };

  segments.forEach((segment, index) => {
    const px = position.x - segment.start.x;
    const pz = position.z - segment.start.z;
    const t = Math.max(0, Math.min(1, (px * segment.dx + pz * segment.dz) / (segment.length * segment.length)));
    const point = {
      x: segment.start.x + segment.dx * t,
      z: segment.start.z + segment.dz * t
    };
    const dx = position.x - point.x;
    const dz = position.z - point.z;
    const dist = Math.hypot(dx, dz);
    if (dist < bestDistance) {
      const fallbackNormal = { x: segment.dz / segment.length, z: -segment.dx / segment.length };
      bestDistance = dist;
      bestPoint = point;
      bestSegment = index;
      bestNormal = dist > 0.0001 ? { x: dx / dist, z: dz / dist } : fallbackNormal;
    }
  });

  return {
    point: bestPoint,
    distance: Number.isFinite(bestDistance) ? bestDistance : 0,
    segmentIndex: bestSegment,
    normal: bestNormal
  };
}

export function getStartHeading(track: TrackConfig): number {
  const start = track.checkpoints[0];
  const next = track.checkpoints[1] ?? { x: start.x, z: start.z + 1 };
  return Math.atan2(next.x - start.x, next.z - start.z);
}
