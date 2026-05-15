interface StatCardProps {
  label: string;
  value: string | number;
  caption?: string;
  accent?: string;
}

export function StatCard({ label, value, caption, accent = "#38BDF8" }: StatCardProps) {
  return (
    <div className="hairline-panel rounded-lg p-4">
      <div className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-white" style={{ textShadow: `0 0 18px ${accent}55` }}>
        {value}
      </div>
      {caption ? <div className="mt-1 text-sm text-slate-400">{caption}</div> : null}
    </div>
  );
}
