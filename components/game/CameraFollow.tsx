"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import type { MutableRefObject } from "react";
import type { CarPhysicsState } from "@/hooks/useCarPhysics";
import { KMH_PER_UNIT } from "@/hooks/useCarPhysics";

interface CameraFollowProps {
  stateRef: MutableRefObject<CarPhysicsState>;
}

export function CameraFollow({ stateRef }: CameraFollowProps) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const state = stateRef.current;
    const speedKmh = Math.max(0, state.speed * KMH_PER_UNIT);
    const forward = new THREE.Vector3(Math.sin(state.heading), 0, Math.cos(state.heading));
    const right = new THREE.Vector3(Math.cos(state.heading), 0, -Math.sin(state.heading));
    const shake = state.collisionFlash > 0 ? Math.sin(clock.elapsedTime * 42) * state.collisionFlash * 0.5 : 0;

    target.set(state.position.x, 1.35, state.position.z);
    desired
      .copy(target)
      .addScaledVector(forward, -17 - speedKmh * 0.045)
      .addScaledVector(right, shake)
      .add(new THREE.Vector3(0, 9.5 + speedKmh * 0.018, 0));

    camera.position.lerp(desired, 0.1);
    camera.lookAt(target);

    const perspective = camera as THREE.PerspectiveCamera;
    const targetFov = 58 + Math.min(10, speedKmh * 0.075) + (state.nitroActive ? 5 : 0);
    perspective.fov += (targetFov - perspective.fov) * 0.08;
    perspective.updateProjectionMatrix();
  });

  return null;
}
