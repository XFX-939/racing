"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Flag, Gauge, Gamepad2, Keyboard, Smartphone, Trophy, Zap } from "lucide-react";
import { cars } from "@/data/cars";
import { tracks } from "@/data/tracks";
import { getTopResults } from "@/lib/leaderboard";
import { formatTime } from "@/lib/format";
import type { RaceResult } from "@/types/game";
import { StatCard } from "@/components/ui/StatCard";

const modes = [
  {
    name: "计时挑战",
    description: "3 圈完整计时，成绩进入排行榜。",
    icon: Gauge
  },
  {
    name: "竞速闯关",
    description: "预留赛季关卡入口，后续接更多目标。",
    icon: Flag
  },
  {
    name: "自由练习",
    description: "无排名压力练路线，熟悉漂移和氮气。",
    icon: Gamepad2
  }
];

export default function HomePage() {
  const [leaders, setLeaders] = useState<RaceResult[]>([]);

  useEffect(() => {
    setLeaders(getTopResults(5));
  }, []);

  const heroCar = cars[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid min-h-[calc(100vh-9rem)] items-center gap-8 py-8 lg:grid-cols-[1fr_0.86fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-bold text-cyan-100">
            <Zap className="h-4 w-4" />
            虚拟霓虹赛道开放
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            极速竞技场
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            选择赛车，冲进霓虹赛道，用最快圈速登上排行榜。这里是虚拟赛道的街机竞速，不是现实驾驶教学。
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/play" className="arena-button h-12 px-6">
              立即开跑
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/leaderboard" className="arena-button-secondary h-12 px-6">
              <Trophy className="h-5 w-5" />
              查看排行榜
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <StatCard label="车辆" value={cars.length} caption="可选调校" accent="#38BDF8" />
            <StatCard label="赛道" value={tracks.length} caption="计时配置" accent="#A855F7" />
            <StatCard label="圈数" value="3" caption="标准挑战" accent="#F97316" />
          </div>
        </div>

        <div className="glass-panel speed-surface rounded-lg p-5">
          <div className="relative z-10 overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950/70 p-6">
            <div className="absolute inset-0 bg-speed-lines opacity-70" />
            <div className="relative h-[26rem]">
              <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full border border-cyan-300/20 bg-cyan-300/5 blur-sm" />
              <div className="absolute bottom-20 left-1/2 h-16 w-[82%] -translate-x-1/2 skew-x-[-18deg] rounded-full bg-cyan-300/10 blur-xl" />
              <div className="absolute bottom-28 left-1/2 h-32 w-[78%] -translate-x-1/2">
                <div
                  className="absolute left-8 top-12 h-16 w-[72%] rounded-lg shadow-neon"
                  style={{ background: `linear-gradient(90deg, ${heroCar.color}, ${heroCar.accentColor})` }}
                />
                <div className="absolute left-[32%] top-2 h-20 w-[30%] -skew-x-12 rounded bg-slate-200/90" />
                <div className="absolute left-0 top-[4.2rem] h-12 w-12 rounded-full border-[10px] border-slate-950 bg-slate-500 shadow-[0_0_22px_rgba(56,189,248,0.45)]" />
                <div className="absolute right-8 top-[4.2rem] h-12 w-12 rounded-full border-[10px] border-slate-950 bg-slate-500 shadow-[0_0_22px_rgba(56,189,248,0.45)]" />
                <div className="absolute right-0 top-16 h-4 w-16 rounded-full bg-orange-400 shadow-[0_0_28px_rgba(249,115,22,0.75)]" />
                <div className="absolute -right-14 top-16 h-3 w-12 rounded-full bg-orange-400/40 blur-sm" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-3 text-sm">
                  <div className="text-slate-500">默认车辆</div>
                  <div className="mt-1 font-black text-white">{heroCar.name}</div>
                </div>
                <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-3 text-sm">
                  <div className="text-slate-500">主赛道</div>
                  <div className="mt-1 font-black text-white">{tracks[0].name}</div>
                </div>
                <div className="rounded-lg border border-slate-700/70 bg-slate-900/70 p-3 text-sm">
                  <div className="text-slate-500">目标</div>
                  <div className="mt-1 font-black text-white">{formatTime(tracks[0].targetTime)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-white">模式选择</h2>
            <p className="mt-2 text-slate-400">第一版先打磨计时挑战，其他模式保留入口。</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <article key={mode.name} className="glass-panel rounded-lg p-5">
                <Icon className="h-8 w-8 text-cyan-200" />
                <h3 className="mt-4 text-xl font-black text-white">{mode.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{mode.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 py-10 lg:grid-cols-[1fr_0.8fr]">
        <div className="glass-panel rounded-lg p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-white">今日排行榜预览</h2>
            <Link href="/leaderboard" className="text-sm font-bold text-cyan-200 hover:text-white">
              全部成绩
            </Link>
          </div>
          <div className="grid gap-3">
            {leaders.slice(0, 5).map((leader, index) => (
              <div key={leader.id} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg bg-slate-950/50 p-3">
                <div className="font-black text-cyan-100">#{index + 1}</div>
                <div className="min-w-0">
                  <div className="truncate font-black text-white">{leader.playerName}</div>
                  <div className="truncate text-sm text-slate-400">
                    {leader.trackName} / {leader.carName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-white">{formatTime(leader.totalTime)}</div>
                  <div className="text-xs text-slate-400">{leader.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-lg p-5">
          <h2 className="text-2xl font-black text-white">操作说明</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center gap-2 font-black text-white">
                <Keyboard className="h-5 w-5 text-cyan-200" />
                PC
              </div>
              <p className="text-sm leading-7 text-slate-300">W / ↑ 加速，S / ↓ 刹车，A/D 或方向键转向，Space 漂移，Shift 氮气。</p>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
              <div className="mb-3 flex items-center gap-2 font-black text-white">
                <Smartphone className="h-5 w-5 text-cyan-200" />
                手机
              </div>
              <p className="text-sm leading-7 text-slate-300">左侧方向键，右侧加速、刹车、氮气、漂移按钮，支持连续触控。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
