"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { MutableRefObject } from "react";
import type { CarPhysicsState } from "@/hooks/useCarPhysics";

interface EffectsProps {
  stateRef: MutableRefObject<CarPhysicsState>;
  lowQuality?: boolean;
}

export function Effects({ stateRef, lowQuality = false }: EffectsProps) {
  const nitroRef = useRef<Group>(null);
  const smokeRefs = useRef<Mesh[]>([]);
  const sparkRefs = useRef<Mesh[]>([]);

  function registerSmoke(mesh: Mesh | null) {
    if (mesh && !smokeRefs.current.includes(mesh)) smokeRefs.current.push(mesh);
  }

  function registerSpark(mesh: Mesh | null) {
    if (mesh && !sparkRefs.current.includes(mesh)) sparkRefs.current.push(mesh);
  }

  useFrame(({ clock }) => {
    const state = stateRef.current;
    const forward = { x: Math.sin(state.heading), z: Math.cos(state.heading) };
    const right = { x: Math.cos(state.heading), z: -Math.sin(state.heading) };
    const time = clock.elapsedTime;

    if (nitroRef.current) {
      nitroRef.current.visible = state.nitroActive && state.speed > 2;
      nitroRef.current.position.set(state.position.x - forward.x * 2.45, 0.7, state.position.z - forward.z * 2.45);
      nitroRef.current.rotation.y = state.heading;
      const pulse = 0.8 + Math.sin(time * 32) * 0.18;
      nitroRef.current.scale.setScalar(pulse);
    }

    smokeRefs.current.forEach((mesh, index) => {
      const visible = !lowQuality && state.driftActive && state.speed > 2;
      mesh.visible = visible;
      if (visible) {
        const side = index % 2 === 0 ? -1 : 1;
        const trail = 1.3 + index * 0.34;
        mesh.position.set(
          state.position.x + right.x * side * 1.18 - forward.x * trail,
          0.22 + index * 0.03,
          state.position.z + right.z * side * 1.18 - forward.z * trail
        );
        const scale = 0.42 + index * 0.08 + Math.sin(time * 8 + index) * 0.04;
        mesh.scale.setScalar(scale);
      }
    });

    sparkRefs.current.forEach((mesh, index) => {
      const visible = !lowQuality && state.collisionFlash > 0;
      mesh.visible = visible;
      if (visible) {
        const angle = (index / sparkRefs.current.length) * Math.PI * 2 + time * 8;
        const radius = 1.1 + index * 0.08;
        mesh.position.set(
          state.position.x + Math.cos(angle) * radius,
          0.5 + Math.sin(time * 18 + index) * 0.25,
          state.position.z + Math.sin(angle) * radius
        );
        mesh.scale.setScalar(state.collisionFlash * (0.8 + index * 0.04));
      }
    });
  });

  return (
    <group>
      <group ref={nitroRef}>
        <mesh position={[-0.55, 0, -0.1]} scale={[0.35, 0.35, 1.2]}>
          <sphereGeometry args={[0.8, 12, 8]} />
          <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.9} transparent opacity={0.75} />
        </mesh>
        <mesh position={[0.55, 0, -0.1]} scale={[0.35, 0.35, 1.2]}>
          <sphereGeometry args={[0.8, 12, 8]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={1.7} transparent opacity={0.68} />
        </mesh>
      </group>

      {Array.from({ length: 8 }).map((_, index) => (
        <mesh key={`smoke-${index}`} ref={registerSmoke} visible={false}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshStandardMaterial color="#CBD5E1" transparent opacity={0.18} roughness={1} />
        </mesh>
      ))}

      {Array.from({ length: 10 }).map((_, index) => (
        <mesh key={`spark-${index}`} ref={registerSpark} visible={false}>
          <boxGeometry args={[0.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={1.8} />
        </mesh>
      ))}
    </group>
  );
}
