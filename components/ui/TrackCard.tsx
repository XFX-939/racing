import { Check, Flag } from "lucide-react";
import type { TrackConfig } from "@/types/game";
import { formatTime } from "@/lib/format";

interface TrackCardProps {
  track: TrackConfig;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const difficultyLabel = {
  easy: "简单",
  normal: "普通",
  hard: "困难"
};

export function TrackCard({ track, selected = false, onSelect }: TrackCardProps) {
  const points = track.checkpoints.map((point) => `${point.x + 76},${point.z + 58}`).join(" ");

  return (
    <article
      className={`glass-panel rounded-lg p-5 transition ${
        selected ? "border-cyan-300/70 shadow-neon" : "hover:border-cyan-300/36"
      }`}
    >
      <div className="mb-5 h-40 overflow-hidden rounded-lg border border-slate-700/70 bg-slate-950/70 p-4">
        <svg viewBox="0 0 152 116" className="h-full w-full" role="img" aria-label={`${track.name} 赛道示意`}>
          <polyline points={points} fill="none" stroke="rgba(148,163,184,0.18)" strokeWidth="16" strokeLinejoin="round" />
          <polyline
            points={points}
            fill="none"
            stroke={track.themeColor}
            strokeWidth="8"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx={track.checkpoints[0].x + 76} cy={track.checkpoints[0].z + 58} r="5" fill="#F8FAFC" />
        </svg>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-white">{track.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{track.description}</p>
        </div>
        {selected ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-300/18 text-cyan-100">
            <Check className="h-5 w-5" />
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-lg bg-slate-950/50 p-3">
          <div className="text-slate-500">难度</div>
          <div className="mt-1 font-black text-white">{difficultyLabel[track.difficulty]}</div>
        </div>
        <div className="rounded-lg bg-slate-950/50 p-3">
          <div className="text-slate-500">圈数</div>
          <div className="mt-1 font-black text-white">{track.laps}</div>
        </div>
        <div className="rounded-lg bg-slate-950/50 p-3">
          <div className="text-slate-500">目标</div>
          <div className="mt-1 font-black text-white">{formatTime(track.targetTime)}</div>
        </div>
      </div>

      {onSelect ? (
        <button
          type="button"
          onClick={() => onSelect(track.id)}
          className={`mt-5 h-11 w-full ${selected ? "arena-button-secondary" : "arena-button"}`}
        >
          {selected ? <Check className="h-4 w-4" /> : <Flag className="h-4 w-4" />}
          {selected ? "已选为默认赛道" : "选择赛道"}
        </button>
      ) : null}
    </article>
  );
}
