"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Flag, Gauge, Play, Settings, Trophy, Zap } from "lucide-react";
import { cars } from "@/data/cars";
import { tracks } from "@/data/tracks";
import { CountdownOverlay } from "@/components/game/CountdownOverlay";
import { GameHUD } from "@/components/game/GameHUD";
import { MobileControls } from "@/components/game/MobileControls";
import { PauseMenu } from "@/components/game/PauseMenu";
import { RaceResultModal } from "@/components/game/RaceResultModal";
import { createInitialPhysicsState, getRaceTelemetry } from "@/hooks/useCarPhysics";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";
import { useRaceState } from "@/hooks/useRaceState";
import { useTouchControls } from "@/hooks/useTouchControls";
import { getQualitySetting, getSoundEnabled, setQualitySetting, setSoundEnabled } from "@/lib/preferences";
import { saveRaceResult } from "@/lib/leaderboard";
import { playTone, startBackgroundMusic, stopBackgroundMusic } from "@/lib/sound";
import type { QualitySetting, RaceResult, RaceTelemetry } from "@/types/game";

const RacingScene = dynamic(() => import("@/components/game/RacingScene").then((mod) => mod.RacingScene), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center bg-slate-950 text-slate-300">加载虚拟赛道...</div>
});

export default function PlayPage() {
  const race = useRaceState();
  const keyboardControlsRef = useKeyboardControls();
  const { controlsRef: touchControlsRef, bindControl, resetTouchControls } = useTouchControls();
  const [quality, setQuality] = useState<QualitySetting>("auto");
  const [soundEnabled, setSound] = useState(true);
  const [savedResult, setSavedResult] = useState<RaceResult | null>(null);
  const [telemetry, setTelemetry] = useState<RaceTelemetry>(() =>
    getRaceTelemetry(createInitialPhysicsState(race.selectedTrack), race.selectedTrack)
  );

  useEffect(() => {
    setQuality(getQualitySetting());
    setSound(getSoundEnabled());
  }, []);

  useEffect(() => {
    if (race.phase !== "racing") {
      resetTouchControls();
    }
  }, [race.phase, resetTouchControls]);

  useEffect(() => {
    if ((race.phase === "countdown" || race.phase === "racing") && soundEnabled) {
      startBackgroundMusic(true);
    } else {
      stopBackgroundMusic();
    }

    return () => stopBackgroundMusic();
  }, [race.phase, soundEnabled]);

  useEffect(() => {
    setSavedResult(null);
  }, [race.raceStats]);

  useEffect(() => {
    if (race.countdownValue === "3" || race.countdownValue === "2" || race.countdownValue === "1") {
      playTone("countdown", soundEnabled);
    }
    if (race.countdownValue === "GO") {
      playTone("go", soundEnabled);
    }
  }, [race.countdownValue, soundEnabled]);

  const handleTelemetry = useCallback((next: RaceTelemetry) => {
    setTelemetry(next);
  }, []);

  const handleFinish = useCallback(
    (stats: Parameters<typeof race.finishRace>[0]) => {
      playTone("finish", soundEnabled);
      race.finishRace(stats);
    },
    [race, soundEnabled]
  );

  const handleQualityChange = useCallback((value: QualitySetting) => {
    setQuality(value);
    setQualitySetting(value);
  }, []);

  const handleSoundChange = useCallback((value: boolean) => {
    setSound(value);
    setSoundEnabled(value);
  }, []);

  const trackOptions = useMemo(() => tracks, []);
  const carOptions = useMemo(() => cars, []);

  function handleSave(result: RaceResult) {
    saveRaceResult(result);
    setSavedResult(result);
  }

  function startRace() {
    playTone("select", soundEnabled);
    startBackgroundMusic(soundEnabled);
    race.startRace();
  }

  return (
    <div className="mx-auto max-w-[1600px] px-2 py-3 sm:px-4">
      <div className="relative h-[calc(100vh-8.5rem)] min-h-[680px] overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.42)] sm:h-[calc(100vh-6.5rem)]">
        <RacingScene
          car={race.selectedCar}
          track={race.selectedTrack}
          phase={race.phase}
          resetKey={race.resetKey}
          keyboardControlsRef={keyboardControlsRef}
          touchControlsRef={touchControlsRef}
          quality={quality}
          onTelemetry={handleTelemetry}
          onFinish={handleFinish}
        />

        {race.phase !== "setup" ? (
          <GameHUD telemetry={telemetry} track={race.selectedTrack} onPause={race.pauseRace} canPause={race.phase === "racing"} />
        ) : null}

        {race.phase === "setup" ? (
          <div className="absolute inset-0 z-40 grid place-items-center bg-slate-950/54 p-4 backdrop-blur-[2px]">
            <div className="glass-panel w-full max-w-4xl rounded-lg p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Time Trial</p>
                  <h1 className="mt-1 text-3xl font-black text-white sm:text-4xl">赛前面板</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    选择车辆和赛道，完成 3 圈计时挑战。检查点会按顺序验证，成绩可保存到本地排行榜。
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
                  <Trophy className="h-4 w-4" />
                  虚拟赛道
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <section className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
                  <div className="mb-3 flex items-center gap-2 font-black text-white">
                    <Gauge className="h-5 w-5 text-cyan-200" />
                    车辆
                  </div>
                  <select
                    value={race.selectedCarId}
                    onChange={(event) => race.updateCar(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-white outline-none focus:border-cyan-300"
                  >
                    {carOptions.map((car) => (
                      <option key={car.id} value={car.id}>{car.name}</option>
                    ))}
                  </select>
                  <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">极速</div>
                      <div className="font-black text-white">{race.selectedCar.maxSpeed}</div>
                    </div>
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">加速</div>
                      <div className="font-black text-white">{race.selectedCar.acceleration}</div>
                    </div>
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">操控</div>
                      <div className="font-black text-white">{race.selectedCar.handling}</div>
                    </div>
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">氮气</div>
                      <div className="font-black text-white">{race.selectedCar.nitroPower}</div>
                    </div>
                  </div>
                </section>

                <section className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
                  <div className="mb-3 flex items-center gap-2 font-black text-white">
                    <Flag className="h-5 w-5 text-cyan-200" />
                    赛道
                  </div>
                  <select
                    value={race.selectedTrackId}
                    onChange={(event) => race.updateTrack(event.target.value)}
                    className="h-12 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-white outline-none focus:border-cyan-300"
                  >
                    {trackOptions.map((track) => (
                      <option key={track.id} value={track.id}>{track.name}</option>
                    ))}
                  </select>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">环境</div>
                      <div className="font-black text-white">{race.selectedTrack.environment}</div>
                    </div>
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">圈数</div>
                      <div className="font-black text-white">{race.selectedTrack.laps}</div>
                    </div>
                    <div className="rounded bg-slate-900/80 p-2">
                      <div className="text-slate-500">检查点</div>
                      <div className="font-black text-white">{race.selectedTrack.checkpoints.length}</div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Settings className="h-4 w-4 text-cyan-200" />
                  PC 使用键盘，手机使用屏幕按钮。画质可在暂停菜单中调整。
                </div>
                <button type="button" onClick={startRace} className="arena-button h-12 px-7">
                  <Play className="h-5 w-5" />
                  开始比赛
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <CountdownOverlay value={race.countdownValue} />

        {race.phase === "paused" ? (
          <PauseMenu
            soundEnabled={soundEnabled}
            quality={quality}
            onResume={race.resumeRace}
            onRestart={race.restartRace}
            onSoundChange={handleSoundChange}
            onQualityChange={handleQualityChange}
          />
        ) : null}

        {race.phase === "finished" && race.raceStats ? (
          <RaceResultModal stats={race.raceStats} savedResult={savedResult} onSave={handleSave} onRestart={race.restartRace} />
        ) : null}

        <MobileControls bindControl={bindControl} enabled={race.phase === "racing"} />

        <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 rounded-lg border border-slate-700/70 bg-slate-950/50 px-3 py-2 text-xs font-bold text-slate-400 backdrop-blur-md sm:block">
          W/↑ 加速 · S/↓ 刹车 · A/D 转向 · Space 漂移 · Shift 氮气
        </div>
      </div>
    </div>
  );
}
