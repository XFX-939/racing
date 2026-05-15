"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Home, RotateCcw, Save, Trophy } from "lucide-react";
import type { RaceResult, RaceStats } from "@/types/game";
import { formatTime } from "@/lib/format";
import { calculateRaceResult } from "@/lib/scoring";

interface RaceResultModalProps {
  stats: RaceStats;
  savedResult: RaceResult | null;
  onSave: (result: RaceResult) => void;
  onRestart: () => void;
}

export function RaceResultModal({ stats, savedResult, onSave, onRestart }: RaceResultModalProps) {
  const [name, setName] = useState("Felix");

  useEffect(() => {
    try {
      setName(window.localStorage.getItem("felix-player-name") ?? "Felix");
    } catch {
      setName("Felix");
    }
  }, []);

  const preview = useMemo(() => calculateRaceResult(stats, name), [name, stats]);
  const display = savedResult ?? preview;

  function handleSave() {
    try {
      window.localStorage.setItem("felix-player-name", name.trim() || "匿名车手");
    } catch {
      // Ignore unavailable storage.
    }
    onSave(preview);
  }

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950/78 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-lg p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-cyan-200">Finish</p>
            <h2 className="mt-1 text-3xl font-black text-white">比赛完成</h2>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-cyan-300/40 bg-cyan-300/10">
            <Trophy className="h-7 w-7 text-cyan-100" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-slate-950/50 p-3">
            <div className="text-xs text-slate-400">总用时</div>
            <div className="mt-1 font-black text-cyan-100">{formatTime(display.totalTime)}</div>
          </div>
          <div className="rounded-lg bg-slate-950/50 p-3">
            <div className="text-xs text-slate-400">最佳圈</div>
            <div className="mt-1 font-black text-white">{formatTime(display.bestLapTime)}</div>
          </div>
          <div className="rounded-lg bg-slate-950/50 p-3">
            <div className="text-xs text-slate-400">评分</div>
            <div className="mt-1 font-black text-orange-200">{display.rating}</div>
          </div>
          <div className="rounded-lg bg-slate-950/50 p-3">
            <div className="text-xs text-slate-400">分数</div>
            <div className="mt-1 font-black text-white">{display.score.toLocaleString("zh-CN")}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-slate-950/50 p-3 text-sm text-slate-300">最高速度 {Math.round(display.maxSpeed)} km/h</div>
          <div className="rounded-lg bg-slate-950/50 p-3 text-sm text-slate-300">漂移距离 {Math.round(display.driftDistance)} m</div>
          <div className="rounded-lg bg-slate-950/50 p-3 text-sm text-slate-300">碰撞 {display.collisionCount} 次</div>
        </div>

        {!savedResult ? (
          <label className="mt-5 block text-sm font-bold text-slate-300">
            昵称
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={18}
              className="mt-2 h-12 w-full rounded-lg border border-slate-700 bg-slate-950/80 px-4 text-white outline-none focus:border-cyan-300"
            />
          </label>
        ) : (
          <div className="mt-5 rounded-lg border border-green-400/30 bg-green-400/10 p-3 text-sm font-bold text-green-100">
            成绩已保存到本地排行榜。
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {!savedResult ? (
            <button type="button" onClick={handleSave} className="arena-button h-12 px-4">
              <Save className="h-5 w-5" />
              保存成绩
            </button>
          ) : (
            <Link href="/leaderboard" className="arena-button h-12 px-4">
              <Trophy className="h-5 w-5" />
              查看排行
            </Link>
          )}
          <button type="button" onClick={onRestart} className="arena-button-secondary h-12 px-4">
            <RotateCcw className="h-5 w-5" />
            再来一局
          </button>
          <Link href="/" className="arena-button-secondary h-12 px-4">
            <Home className="h-5 w-5" />
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
