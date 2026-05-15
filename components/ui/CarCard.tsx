import { Check, Gauge, Zap } from "lucide-react";
import type { CarConfig } from "@/types/game";

interface CarCardProps {
  car: CarConfig;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export function CarCard({ car, selected = false, onSelect }: CarCardProps) {
  return (
    <article
      className={`glass-panel speed-surface rounded-lg p-5 transition ${
        selected ? "border-cyan-300/70 shadow-neon" : "hover:border-cyan-300/36"
      }`}
    >
      <div className="relative z-10">
        <div className="mb-5 grid h-36 place-items-center rounded-lg border border-slate-700/70 bg-slate-950/55">
          <div className="relative h-16 w-44">
            <div
              className="absolute left-6 top-6 h-8 w-32 rounded-md shadow-neon"
              style={{ background: car.color }}
            />
            <div
              className="absolute left-16 top-2 h-9 w-48 max-w-[6rem] -skew-x-12 rounded-sm"
              style={{ background: `${car.accentColor}CC` }}
            />
            <div className="absolute left-5 top-12 h-5 w-5 rounded-full border-4 border-slate-900 bg-slate-500" />
            <div className="absolute right-5 top-12 h-5 w-5 rounded-full border-4 border-slate-900 bg-slate-500" />
            <div className="absolute right-2 top-8 h-2 w-8 rounded-full" style={{ background: car.accentColor }} />
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white">{car.name}</h3>
            <p className="mt-1 min-h-12 text-sm leading-6 text-slate-400">{car.description}</p>
          </div>
          {selected ? (
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-300/18 text-cyan-100">
              <Check className="h-5 w-5" />
            </span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          <StatBar label="极速" value={car.maxSpeed} color={car.color} />
          <StatBar label="加速" value={car.acceleration} color={car.accentColor} />
          <StatBar label="操控" value={car.handling} color="#22D3EE" />
          <StatBar label="氮气" value={car.nitroPower} color="#A855F7" />
        </div>

        {onSelect ? (
          <button
            type="button"
            onClick={() => onSelect(car.id)}
            className={`mt-5 h-11 w-full ${selected ? "arena-button-secondary" : "arena-button"}`}
          >
            {selected ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
            {selected ? "已选为默认赛车" : "选择赛车"}
          </button>
        ) : (
          <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-300">
            <Gauge className="h-4 w-4 text-cyan-200" />
            街机调校
          </div>
        )}
      </div>
    </article>
  );
}
