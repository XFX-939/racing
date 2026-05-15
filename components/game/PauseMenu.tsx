"use client";

import Link from "next/link";
import { Home, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import type { QualitySetting } from "@/types/game";

interface PauseMenuProps {
  soundEnabled: boolean;
  quality: QualitySetting;
  onResume: () => void;
  onRestart: () => void;
  onSoundChange: (value: boolean) => void;
  onQualityChange: (value: QualitySetting) => void;
}

export function PauseMenu({ soundEnabled, quality, onResume, onRestart, onSoundChange, onQualityChange }: PauseMenuProps) {
  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-slate-950/72 p-4 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-md rounded-lg p-5">
        <h2 className="text-3xl font-black text-white">比赛暂停</h2>
        <div className="mt-5 grid gap-3">
          <button type="button" onClick={onResume} className="arena-button h-12 px-4">
            <Play className="h-5 w-5" />
            继续游戏
          </button>
          <button type="button" onClick={onRestart} className="arena-button-secondary h-12 px-4">
            <RotateCcw className="h-5 w-5" />
            重新开始
          </button>
          <Link href="/" className="arena-button-secondary h-12 px-4">
            <Home className="h-5 w-5" />
            返回首页
          </Link>
        </div>

        <div className="mt-6 rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
          <div className="mb-3 text-sm font-bold text-slate-300">音效</div>
          <button type="button" onClick={() => onSoundChange(!soundEnabled)} className="arena-button-secondary h-10 px-4">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {soundEnabled ? "开启" : "关闭"}
          </button>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
          <div className="mb-3 text-sm font-bold text-slate-300">画质</div>
          <div className="grid grid-cols-4 gap-2">
            {(["auto", "high", "medium", "low"] as QualitySetting[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onQualityChange(item)}
                className={`h-10 rounded-lg border text-sm font-black ${
                  quality === item
                    ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                    : "border-slate-700 bg-slate-900/80 text-slate-300"
                }`}
              >
                {item === "auto" ? "自动" : item === "high" ? "高" : item === "medium" ? "中" : "低"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
