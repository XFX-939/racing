"use client";

interface CountdownOverlayProps {
  value: string;
}

export function CountdownOverlay({ value }: CountdownOverlayProps) {
  if (!value) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-40 grid place-items-center bg-slate-950/12">
      <div className="rounded-lg border border-cyan-300/40 bg-slate-950/68 px-10 py-7 text-7xl font-black text-white shadow-neon backdrop-blur-md sm:text-8xl">
        {value}
      </div>
    </div>
  );
}
