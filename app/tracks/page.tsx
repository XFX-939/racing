"use client";

import { useEffect, useState } from "react";
import { defaultTrack, tracks } from "@/data/tracks";
import { getSelectedTrackId, setSelectedTrackId } from "@/lib/preferences";
import { TrackCard } from "@/components/ui/TrackCard";

export default function TracksPage() {
  const [selectedId, setSelectedId] = useState(defaultTrack.id);

  useEffect(() => {
    setSelectedId(getSelectedTrackId() ?? defaultTrack.id);
  }, []);

  function handleSelect(id: string) {
    setSelectedId(id);
    setSelectedTrackId(id);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Tracks</p>
        <h1 className="mt-2 text-4xl font-black text-white">赛道</h1>
        <p className="mt-3 max-w-2xl text-slate-400">第一版提供三条赛道配置，几何、宽度、目标时间和环境氛围各不相同。</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackCard key={track.id} track={track} selected={selectedId === track.id} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
