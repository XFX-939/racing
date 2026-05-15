"use client";

import { Crown, Medal, Trophy } from "lucide-react";
import type { RaceResult } from "@/types/game";
import { formatDate, formatTime } from "@/lib/format";

interface LeaderboardTableProps {
  results: RaceResult[];
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-5 w-5 text-amber-300" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-200" />;
  if (rank === 3) return <Trophy className="h-5 w-5 text-orange-300" />;
  return <span className="text-sm font-black text-slate-400">#{rank}</span>;
}

export function LeaderboardTable({ results }: LeaderboardTableProps) {
  if (results.length === 0) {
    return <div className="glass-panel rounded-lg p-8 text-center text-slate-300">还没有成绩，先去虚拟赛道跑一圈。</div>;
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-lg border border-slate-800/80 lg:block">
        <table className="w-full border-collapse bg-slate-950/50 text-left text-sm">
          <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-4 py-4">排名</th>
              <th className="px-4 py-4">玩家</th>
              <th className="px-4 py-4">赛道</th>
              <th className="px-4 py-4">车辆</th>
              <th className="px-4 py-4">用时</th>
              <th className="px-4 py-4">分数</th>
              <th className="px-4 py-4">碰撞</th>
              <th className="px-4 py-4">日期</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => {
              const rank = index + 1;
              return (
                <tr key={result.id} className={rank <= 3 ? "bg-cyan-300/6" : "border-t border-slate-800/70"}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <RankIcon rank={rank} />
                      <span className="font-black text-white">{result.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-white">{result.playerName}</td>
                  <td className="px-4 py-4 text-slate-300">{result.trackName}</td>
                  <td className="px-4 py-4 text-slate-300">{result.carName}</td>
                  <td className="px-4 py-4 font-black text-cyan-100">{formatTime(result.totalTime)}</td>
                  <td className="px-4 py-4 font-black text-white">{result.score.toLocaleString("zh-CN")}</td>
                  <td className="px-4 py-4 text-slate-300">{result.collisionCount}</td>
                  <td className="px-4 py-4 text-slate-400">{formatDate(result.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 lg:hidden">
        {results.map((result, index) => {
          const rank = index + 1;
          return (
            <article key={result.id} className={`glass-panel rounded-lg p-4 ${rank <= 3 ? "border-cyan-300/50" : ""}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <RankIcon rank={rank} />
                  <div>
                    <div className="font-black text-white">{result.playerName}</div>
                    <div className="text-sm text-slate-400">{result.trackName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-cyan-100">{formatTime(result.totalTime)}</div>
                  <div className="text-xs font-bold text-slate-400">{result.rating} / {result.score.toLocaleString("zh-CN")}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-300">
                <span className="rounded bg-slate-950/50 px-2 py-2">{result.carName}</span>
                <span className="rounded bg-slate-950/50 px-2 py-2">碰撞 {result.collisionCount}</span>
                <span className="rounded bg-slate-950/50 px-2 py-2">{formatDate(result.createdAt)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
