"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import type { MutableRefObject } from "react";
import type { CarConfig } from "@/types/game";
import type { CarPhysicsState } from "@/hooks/useCarPhysics";

interface CarModelProps {
  car: CarConfig;
  stateRef: MutableRefObject<CarPhysicsState>;
}

export function CarModel({ car, stateRef }: CarModelProps) {
  const groupRef = useRef<Group>(null);
  const frontLeftRef = useRef<Group>(null);
  const frontRightRef = useRef<Group>(null);
  const wheelRefs = useRef<Mesh[]>([]);

  useFrame(() => {
    const state = stateRef.current;
    if (!groupRef.current) return;

    groupRef.current.position.set(state.position.x, 0.72, state.position.z);
    groupRef.current.rotation.y = state.heading;

    const steerAngle = state.steerInput * 0.36;
    if (frontLeftRef.current) frontLeftRef.current.rotation.y = steerAngle;
    if (frontRightRef.current) frontRightRef.current.rotation.y = steerAngle;
    wheelRefs.current.forEach((wheel) => {
      wheel.rotation.x = state.wheelSpin;
    });
  });

  function registerWheel(mesh: Mesh | null) {
    if (mesh && !wheelRefs.current.includes(mesh)) {
      wheelRefs.current.push(mesh);
    }
  }

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <boxGeometry args={[2.15, 0.48, 3.9]} />
        <meshStandardMaterial color={car.color} metalness={0.42} roughness={0.32} />
      </mesh>
      <mesh castShadow position={[0, 0.55, 0.15]}>
        <boxGeometry args={[1.28, 0.62, 1.35]} />
        <meshStandardMaterial color="#E0F2FE" metalness={0.12} roughness={0.18} transparent opacity={0.88} />
      </mesh>
      <mesh castShadow position={[0, 0.25, 1.82]}>
        <boxGeometry args={[1.75, 0.2, 0.32]} />
        <meshStandardMaterial color={car.accentColor} emissive={car.accentColor} emissiveIntensity={0.42} />
      </mesh>
      <mesh castShadow position={[0, 0.78, -1.72]}>
        <boxGeometry args={[2.55, 0.14, 0.22]} />
        <meshStandardMaterial color={car.accentColor} emissive={car.accentColor} emissiveIntensity={0.34} />
      </mesh>
      <mesh position={[-0.56, 0.28, 2.03]}>
        <boxGeometry args={[0.36, 0.12, 0.08]} />
        <meshStandardMaterial color="#E0F2FE" emissive="#38BDF8" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[0.56, 0.28, 2.03]}>
        <boxGeometry args={[0.36, 0.12, 0.08]} />
        <meshStandardMaterial color="#E0F2FE" emissive="#38BDF8" emissiveIntensity={1.2} />
      </mesh>
      <mesh position={[-0.55, 0.2, -2.02]}>
        <boxGeometry args={[0.38, 0.12, 0.08]} />
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={1.3} />
      </mesh>
      <mesh position={[0.55, 0.2, -2.02]}>
        <boxGeometry args={[0.38, 0.12, 0.08]} />
        <meshStandardMaterial color="#F97316" emissive="#F97316" emissiveIntensity={1.3} />
      </mesh>

      {[
        { x: -1.2, z: 1.2, front: true },
        { x: 1.2, z: 1.2, front: true },
        { x: -1.2, z: -1.22, front: false },
        { x: 1.2, z: -1.22, front: false }
      ].map((wheel, index) => {
        const content = (
          <mesh ref={registerWheel} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.46, 18]} />
            <meshStandardMaterial color="#0F172A" metalness={0.2} roughness={0.52} />
          </mesh>
        );
        if (wheel.front && wheel.x < 0) {
          return (
            <group ref={frontLeftRef} key={index} position={[wheel.x, -0.24, wheel.z]}>
              {content}
            </group>
          );
        }
        if (wheel.front && wheel.x > 0) {
          return (
            <group ref={frontRightRef} key={index} position={[wheel.x, -0.24, wheel.z]}>
              {content}
            </group>
          );
        }
        return (
          <group key={index} position={[wheel.x, -0.24, wheel.z]}>
            {content}
          </group>
        );
      })}
    </group>
  );
}
