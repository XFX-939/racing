"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { MutableRefObject } from "react";
import type { CarConfig, ControlsState, QualitySetting, RacePhase, RaceStats, RaceTelemetry, TrackConfig } from "@/types/game";
import { CameraFollow } from "@/components/game/CameraFollow";
import { CarModel } from "@/components/game/CarModel";
import { Checkpoints } from "@/components/game/Checkpoints";
import { Effects } from "@/components/game/Effects";
import { TrackModel } from "@/components/game/TrackModel";
import {
  createInitialPhysicsState,
  getRaceStats,
  getRaceTelemetry,
  mergeControls,
  updateCarPhysics
} from "@/hooks/useCarPhysics";

interface RacingSceneProps {
  car: CarConfig;
  track: TrackConfig;
  phase: RacePhase;
  resetKey: number;
  keyboardControlsRef: MutableRefObject<ControlsState>;
  touchControlsRef: MutableRefObject<ControlsState>;
  quality: QualitySetting;
  onTelemetry: (telemetry: RaceTelemetry) => void;
  onFinish: (stats: RaceStats) => void;
}

interface RaceLoopProps extends RacingSceneProps {
  lowQuality: boolean;
}

function RaceLoop({
  car,
  track,
  phase,
  resetKey,
  keyboardControlsRef,
  touchControlsRef,
  onTelemetry,
  onFinish,
  lowQuality
}: RaceLoopProps) {
  const physicsRef = useRef(createInitialPhysicsState(track));
  const lastTelemetryRef = useRef(0);
  const finishedCalledRef = useRef(false);

  useEffect(() => {
    physicsRef.current = createInitialPhysicsState(track);
    finishedCalledRef.current = false;
    lastTelemetryRef.current = 0;
    onTelemetry(getRaceTelemetry(physicsRef.current, track));
  }, [car.id, onTelemetry, resetKey, track]);

  useFrame((_, delta) => {
    const state = physicsRef.current;

    if (phase === "racing") {
      const controls = mergeControls(keyboardControlsRef.current, touchControlsRef.current);
      updateCarPhysics(state, controls, car, track, delta);
    } else {
      state.nitroActive = false;
      state.driftActive = false;
      state.steerInput = 0;
    }

    if (state.elapsedTime - lastTelemetryRef.current >= 0.1 || state.finished) {
      lastTelemetryRef.current = state.elapsedTime;
      onTelemetry(getRaceTelemetry(state, track));
    }

    if (state.finished && !finishedCalledRef.current) {
      finishedCalledRef.current = true;
      onFinish(getRaceStats(state, car, track, "time-trial"));
    }
  });

  return (
    <>
      <color attach="background" args={["#050713"]} />
      <fog attach="fog" args={["#070B1A", 80, 210]} />
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow={!lowQuality}
        position={[24, 34, -18]}
        intensity={lowQuality ? 1.2 : 1.8}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={["#38BDF8", "#070B1A", 0.6]} />
      <TrackModel track={track} lowQuality={lowQuality} />
      <Checkpoints track={track} />
      <CarModel car={car} stateRef={physicsRef} />
      <Effects stateRef={physicsRef} lowQuality={lowQuality} />
      <CameraFollow stateRef={physicsRef} />
    </>
  );
}

export function RacingScene(props: RacingSceneProps) {
  const lowQuality = useMemo(() => {
    if (props.quality === "low") return true;
    if (props.quality === "high") return false;
    if (typeof window === "undefined") return false;
    return props.quality === "auto" ? window.innerWidth < 760 : props.quality === "medium";
  }, [props.quality]);

  const dpr = lowQuality ? [1, 1.15] : [1, 1.75];

  return (
    <Canvas
      shadows={!lowQuality}
      dpr={dpr as [number, number]}
      camera={{ position: [0, 12, -24], fov: 58, near: 0.1, far: 420 }}
      gl={{ antialias: !lowQuality, powerPreference: "high-performance" }}
    >
      <RaceLoop {...props} lowQuality={lowQuality} />
    </Canvas>
  );
}
