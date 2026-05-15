"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultCar, getCarById } from "@/data/cars";
import { defaultTrack, getTrackById } from "@/data/tracks";
import { getSelectedCarId, getSelectedTrackId, setSelectedCarId, setSelectedTrackId } from "@/lib/preferences";
import type { RacePhase, RaceStats } from "@/types/game";

export function useRaceState() {
  const [phase, setPhase] = useState<RacePhase>("setup");
  const [countdownValue, setCountdownValue] = useState("");
  const [selectedCarId, setSelectedCar] = useState(defaultCar.id);
  const [selectedTrackId, setSelectedTrack] = useState(defaultTrack.id);
  const [resetKey, setResetKey] = useState(0);
  const [raceStats, setRaceStats] = useState<RaceStats | null>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    setSelectedCar(getSelectedCarId() ?? defaultCar.id);
    setSelectedTrack(getSelectedTrackId() ?? defaultTrack.id);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const startRace = useCallback(() => {
    clearTimers();
    setRaceStats(null);
    setResetKey((value) => value + 1);
    setPhase("countdown");
    setCountdownValue("3");

    const sequence = [
      { value: "2", delay: 850 },
      { value: "1", delay: 1700 },
      { value: "GO", delay: 2550 },
      { value: "", delay: 3300, start: true }
    ];

    timersRef.current = sequence.map((step) =>
      window.setTimeout(() => {
        setCountdownValue(step.value);
        if (step.start) {
          setPhase("racing");
        }
      }, step.delay)
    );
  }, [clearTimers]);

  const pauseRace = useCallback(() => {
    setPhase((value) => (value === "racing" ? "paused" : value));
  }, []);

  const resumeRace = useCallback(() => {
    setPhase((value) => (value === "paused" ? "racing" : value));
  }, []);

  const restartRace = useCallback(() => {
    startRace();
  }, [startRace]);

  const returnToSetup = useCallback(() => {
    clearTimers();
    setCountdownValue("");
    setRaceStats(null);
    setResetKey((value) => value + 1);
    setPhase("setup");
  }, [clearTimers]);

  const finishRace = useCallback((stats: RaceStats) => {
    clearTimers();
    setRaceStats(stats);
    setCountdownValue("");
    setPhase("finished");
  }, [clearTimers]);

  const updateCar = useCallback((id: string) => {
    setSelectedCar(id);
    setSelectedCarId(id);
  }, []);

  const updateTrack = useCallback((id: string) => {
    setSelectedTrack(id);
    setSelectedTrackId(id);
  }, []);

  return {
    phase,
    countdownValue,
    selectedCar: getCarById(selectedCarId),
    selectedTrack: getTrackById(selectedTrackId),
    selectedCarId,
    selectedTrackId,
    resetKey,
    raceStats,
    setPhase,
    startRace,
    pauseRace,
    resumeRace,
    restartRace,
    returnToSetup,
    finishRace,
    updateCar,
    updateTrack
  };
}
