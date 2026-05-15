"use client";

import type { TrackConfig } from "@/types/game";
import { getStartHeading } from "@/lib/track";

interface CheckpointsProps {
  track: TrackConfig;
}

export function Checkpoints({ track }: CheckpointsProps) {
  const startHeading = getStartHeading(track);

  return (
    <group>
      {track.checkpoints.map((checkpoint, index) => (
        <group
          key={`${track.id}-checkpoint-${index}`}
          position={[checkpoint.x, 0.28, checkpoint.z]}
          rotation={[0, index === 0 ? startHeading : 0, 0]}
        >
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <torusGeometry args={[index === 0 ? 3.8 : 2.8, 0.08, 8, 42]} />
            <meshStandardMaterial
              color={index === 0 ? "#F8FAFC" : track.themeColor}
              emissive={index === 0 ? "#38BDF8" : track.themeColor}
              emissiveIntensity={index === 0 ? 0.8 : 0.45}
              transparent
              opacity={index === 0 ? 0.95 : 0.48}
            />
          </mesh>
          {index === 0 ? (
            <>
              <mesh position={[-track.roadWidth / 2, 3.2, 0]}>
                <boxGeometry args={[0.45, 6.2, 0.45]} />
                <meshStandardMaterial color="#F8FAFC" emissive="#38BDF8" emissiveIntensity={0.35} />
              </mesh>
              <mesh position={[track.roadWidth / 2, 3.2, 0]}>
                <boxGeometry args={[0.45, 6.2, 0.45]} />
                <meshStandardMaterial color="#F8FAFC" emissive="#38BDF8" emissiveIntensity={0.35} />
              </mesh>
              <mesh position={[0, 6.2, 0]}>
                <boxGeometry args={[track.roadWidth + 1.2, 0.45, 0.45]} />
                <meshStandardMaterial color="#38BDF8" emissive="#38BDF8" emissiveIntensity={0.7} />
              </mesh>
            </>
          ) : null}
        </group>
      ))}
    </group>
  );
}
