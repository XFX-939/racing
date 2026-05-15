"use client";

import { Pause, Route, Timer, Zap } from "lucide-react";
import type { RaceTelemetry, TrackConfig } from "@/types/game";
import { formatTime } from "@/lib/format";

interface GameHUDProps {
  telemetry: RaceTelemetry;
  track: TrackConfig;
  onPause: () => void;
  canPause: boolean;
}

export function GameHUD({ telemetry, track, onPause, canPause }: GameHUDProps) {
  const points = track.checkpoints.map((point) => `${point.x + 76},${point.z + 58}`).join(" ");

  return (
    <div className="pointer-events-none absolute inset-0 z-20 p-3 text-white sm:p-5">
      <div className="absolute left-3 top-3 rounded-lg border border-cyan-300/30 bg-slate-950/58 px-3 py-3 backdrop-blur-md sm:left-5 sm:top-5">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">圈数</div>
        <div className="mt-1 text-xl font-black text-white">
          {telemetry.lap}/{telemetry.totalLaps}
        </div>
        <div className="mt-1 text-xs text-slate-400">
          检查点 {telemetry.checkpointIndex}/{telemetry.checkpointTotal}
        </div>
      </div>

      <div className="absolute left-1/2 top-3 flex -translate-x-1/2 gap-2 rounded-lg border border-slate-700/70 bg-slate-950/62 px-3 py-2 backdrop-blur-md sm:top-5 sm:px-5">
        <div className="min-w-24 text-center">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-400">
            <Timer className="h-3.5 w-3.5" />
            用时
          </div>
          <div className="mt-1 text-lg font-black text-cyan-100 sm:text-2xl">{formatTime(telemetry.elapsedTime)}</div>
        </div>
        <div className="hidden min-w-24 border-l border-slate-700/70 pl-3 text-center sm:block">
          <div className="text-xs font-bold text-slate-400">最佳圈</div>
          <div className="mt-1 text-lg font-black text-white">{formatTime(telemetry.bestLapTime)}</div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex items-start gap-2 sm:right-5 sm:top-5">
        <div className="hidden rounded-lg border border-slate-700/70 bg-slate-950/58 p-3 backdrop-blur-md sm:block">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-400">
            <Route className="h-3.5 w-3.5" />
            进度
          </div>
          <svg viewBox="0 0 152 116" className="h-20 w-28">
            <polyline points={points} fill="none" stroke="rgba(148,163,184,0.28)" strokeWidth="12" strokeLinejoin="round" />
            <polyline points={points} fill="none" stroke={track.themeColor} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-cyan-300" style={{ width: `${Math.round(telemetry.progress * 100)}%` }} />
          </div>
        </div>
        <button
          type="button"
          onClick={onPause}
          disabled={!canPause}
          className="pointer-events-auto grid h-12 w-12 place-items-center rounded-lg border border-slate-700/70 bg-slate-950/70 text-white backdrop-blur-md disabled:opacity-40"
          aria-label="暂停"
        >
          <Pause className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-40 left-3 rounded-lg border border-slate-700/70 bg-slate-950/62 px-4 py-3 backdrop-blur-md sm:bottom-5 sm:left-5">
        <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">速度</div>
        <div className="mt-1 text-3xl font-black text-white sm:text-5xl">{Math.round(telemetry.speedKmh)}</div>
        <div className="text-xs font-bold text-cyan-100">km/h</div>
      </div>

      <div className="absolute bottom-40 right-3 w-36 rounded-lg border border-slate-700/70 bg-slate-950/62 p-3 backdrop-blur-md sm:bottom-5 sm:right-5 sm:w-52">
        <div className="mb-2 flex items-center justify-between gap-2 text-xs font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-cyan-200" />
            氮气
          </span>
          <span>{Math.round(telemetry.nitro)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-400"
            style={{ width: `${Math.max(0, Math.min(100, telemetry.nitro))}%` }}
          />
        </div>
        <div className={`mt-2 text-xs font-black ${telemetry.driftActive ? "text-orange-300" : "text-slate-400"}`}>
          {telemetry.driftActive ? "DRIFT ACTIVE" : "GRIP MODE"}
        </div>
      </div>
    </div>
  );
}
