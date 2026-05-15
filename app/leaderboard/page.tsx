"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Trophy } from "lucide-react";
import { cars } from "@/data/cars";
import { tracks } from "@/data/tracks";
import { getLeaderboard, isToday } from "@/lib/leaderboard";
import type { RaceResult } from "@/types/game";
import { LeaderboardTable } from "@/components/ui/LeaderboardTable";

export default function LeaderboardPage() {
  const [results, setResults] = useState<RaceResult[]>([]);
  const [trackId, setTrackId] = useState("all");
  const [carId, setCarId] = useState("all");
  const [period, setPeriod] = useState<"all" | "today">("all");

  useEffect(() => {
    setResults(getLeaderboard());
  }, []);

  const filtered = useMemo(() => {
    return results.filter((result) => {
      const trackMatch = trackId === "all" || result.trackId === trackId;
      const carMatch = carId === "all" || result.carId === carId;
      const periodMatch = period === "all" || isToday(result.createdAt);
      return trackMatch && carMatch && periodMatch;
    });
  }, [carId, period, results, trackId]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Leaderboard</p>
          <h1 className="mt-2 text-4xl font-black text-white">排行榜</h1>
          <p className="mt-3 max-w-2xl text-slate-400">本地成绩会保存在浏览器中，后续可以接入 Supabase 做在线排行。</p>
        </div>
        <div className="glass-panel flex flex-col gap-3 rounded-lg p-3 sm:flex-row">
          <label className="flex items-center gap-2 rounded-lg bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-300">
            <Filter className="h-4 w-4 text-cyan-200" />
            <select value={trackId} onChange={(event) => setTrackId(event.target.value)} className="bg-transparent text-white outline-none">
              <option value="all">全部赛道</option>
              {tracks.map((track) => (
                <option key={track.id} value={track.id}>{track.name}</option>
              ))}
            </select>
          </label>
          <label className="rounded-lg bg-slate-950/50 px-3 py-2 text-sm font-bold text-slate-300">
            <select value={carId} onChange={(event) => setCarId(event.target.value)} className="bg-transparent text-white outline-none">
              <option value="all">全部车辆</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setPeriod((value) => (value === "all" ? "today" : "all"))}
            className="arena-button-secondary h-10 px-4"
          >
            <Trophy className="h-4 w-4" />
            {period === "all" ? "全部榜" : "今日榜"}
          </button>
        </div>
      </div>
      <LeaderboardTable results={filtered} />
    </div>
  );
}
