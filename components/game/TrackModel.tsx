"use client";

import { useMemo } from "react";
import type { TrackConfig, TrackPoint } from "@/types/game";
import { distance, getClosestTrackPoint, getTrackSegments } from "@/lib/track";

interface TrackModelProps {
  track: TrackConfig;
  lowQuality?: boolean;
}

interface SceneryItem {
  x: number;
  z: number;
  height: number;
  width: number;
  color: string;
}

function getSafeSceneryPosition(
  base: TrackPoint,
  normal: TrackPoint,
  width: number,
  track: TrackConfig,
  index: number
): TrackPoint | null {
  const roadClearance = track.roadWidth * 0.5 + width * 1.15 + 14;
  const startClearance = track.roadWidth + 24 + (index === 0 ? 18 : 0);
  const offsetSteps = [0, 10, 22, 36];
  const sides = index % 2 === 0 ? [1, -1] : [-1, 1];

  for (const extraOffset of offsetSteps) {
    for (const side of sides) {
      const offset = roadClearance + extraOffset;
      const candidate = {
        x: base.x + normal.x * offset * side,
        z: base.z + normal.z * offset * side
      };
      const closest = getClosestTrackPoint(candidate, track);
      const farFromStart = distance(candidate, track.checkpoints[0]) > startClearance;
      const clearOfRoad = closest.distance > track.roadWidth * 0.5 + width * 0.85 + 9;

      if (farFromStart && clearOfRoad) {
        return candidate;
      }
    }
  }

  return null;
}

export function TrackModel({ track, lowQuality = false }: TrackModelProps) {
  const segments = useMemo(() => getTrackSegments(track), [track]);
  const scenery = useMemo<SceneryItem[]>(
    () =>
      segments
        .map((segment, index) => {
          const width = 4 + (index % 3);
          const base = {
            x: (segment.start.x + segment.end.x) / 2,
            z: (segment.start.z + segment.end.z) / 2
          };
          const normal = {
            x: segment.dz / segment.length,
            z: -segment.dx / segment.length
          };
          const position = getSafeSceneryPosition(base, normal, width, track, index);

          if (!position) {
            return null;
          }

          return {
            x: position.x,
            z: position.z,
            height: 6 + ((index * 7) % 15),
            width,
            color: index % 3 === 0 ? track.themeColor : index % 3 === 1 ? "#1E293B" : "#111827"
          };
        })
        .filter((item): item is SceneryItem => item !== null),
    [segments, track]
  );

  const lightPosts = useMemo(
    () =>
      segments.map((segment, index) => {
        const side = index % 2 === 0 ? 1 : -1;
        const offset = track.roadWidth * 0.5 + 4.5;
        const midX = (segment.start.x + segment.end.x) / 2;
        const midZ = (segment.start.z + segment.end.z) / 2;
        const normalX = segment.dz / segment.length;
        const normalZ = -segment.dx / segment.length;
        return {
          x: midX + normalX * offset * side,
          z: midZ + normalZ * offset * side
        };
      }),
    [segments, track.roadWidth]
  );

  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[230, 190, 1, 1]} />
        <meshStandardMaterial color="#050816" roughness={0.88} metalness={0.12} />
      </mesh>

      {segments.map((segment, index) => {
        const midX = (segment.start.x + segment.end.x) / 2;
        const midZ = (segment.start.z + segment.end.z) / 2;
        const rightX = Math.cos(segment.angle);
        const rightZ = -Math.sin(segment.angle);
        const guardOffset = track.roadWidth / 2 + 0.55;

        return (
          <group key={`${track.id}-segment-${index}`}>
            <mesh receiveShadow position={[midX, 0, midZ]} rotation={[0, segment.angle, 0]}>
              <boxGeometry args={[track.roadWidth, 0.12, segment.length + 1.3]} />
              <meshStandardMaterial color="#111827" roughness={0.62} metalness={0.16} />
            </mesh>
            <mesh position={[midX, 0.08, midZ]} rotation={[0, segment.angle, 0]}>
              <boxGeometry args={[0.34, 0.06, Math.max(2, segment.length * 0.7)]} />
              <meshStandardMaterial color={track.themeColor} emissive={track.themeColor} emissiveIntensity={0.38} />
            </mesh>
            <mesh castShadow position={[midX + rightX * guardOffset, 0.55, midZ + rightZ * guardOffset]} rotation={[0, segment.angle, 0]}>
              <boxGeometry args={[0.42, 0.9, segment.length + 0.4]} />
              <meshStandardMaterial color={track.themeColor} emissive={track.themeColor} emissiveIntensity={0.5} />
            </mesh>
            <mesh castShadow position={[midX - rightX * guardOffset, 0.55, midZ - rightZ * guardOffset]} rotation={[0, segment.angle, 0]}>
              <boxGeometry args={[0.42, 0.9, segment.length + 0.4]} />
              <meshStandardMaterial color="#334155" emissive="#0F172A" emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}

      <mesh position={[track.checkpoints[0].x, 0.15, track.checkpoints[0].z]} rotation={[0, segments[0]?.angle ?? 0, 0]}>
        <boxGeometry args={[track.roadWidth, 0.08, 1.2]} />
        <meshStandardMaterial color="#F8FAFC" emissive="#38BDF8" emissiveIntensity={0.25} />
      </mesh>

      {!lowQuality
        ? scenery.map((item, index) => (
            <group key={`${track.id}-building-${index}`} position={[item.x, item.height / 2 - 0.08, item.z]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[item.width, item.height, item.width * 1.2]} />
                <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={index % 3 === 0 ? 0.35 : 0.08} roughness={0.7} />
              </mesh>
              <mesh position={[0, item.height / 2 + 0.12, 0]}>
                <boxGeometry args={[item.width * 1.05, 0.15, item.width * 1.25]} />
                <meshStandardMaterial color={track.themeColor} emissive={track.themeColor} emissiveIntensity={0.9} />
              </mesh>
            </group>
          ))
        : null}

      {!lowQuality
        ? lightPosts.map((point, index) => (
            <pointLight
              key={`${track.id}-light-${index}`}
              position={[point.x, 8, point.z]}
              color={index % 2 === 0 ? track.themeColor : "#22D3EE"}
              intensity={28}
              distance={34}
            />
          ))
        : null}
    </group>
  );
}
