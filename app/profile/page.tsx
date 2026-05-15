"use client";

import { useEffect, useState } from "react";
import { Bell, SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import type { QualitySetting } from "@/types/game";
import { getQualitySetting, getSoundEnabled, setQualitySetting, setSoundEnabled } from "@/lib/preferences";

export default function ProfilePage() {
  const [quality, setQuality] = useState<QualitySetting>("auto");
  const [sound, setSound] = useState(true);
  const [nickname, setNickname] = useState("Felix");

  useEffect(() => {
    setQuality(getQualitySetting());
    setSound(getSoundEnabled());
    try {
      setNickname(window.localStorage.getItem("felix-player-name") ?? "Felix");
    } catch {
      setNickname("Felix");
    }
  }, []);

  function updateQuality(value: QualitySetting) {
    setQuality(value);
    setQualitySetting(value);
  }

  function updateSound(value: boolean) {
    setSound(value);
    setSoundEnabled(value);
  }

  function updateNickname(value: string) {
    setNickname(value);
    try {
      window.localStorage.setItem("felix-player-name", value);
    } catch {
      // Ignore unavailable storage.
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Profile</p>
        <h1 className="mt-2 text-4xl font-black text-white">玩家资料和设置</h1>
        <p className="mt-3 max-w-2xl text-slate-400">这里先保存本地昵称、音效和画质偏好。</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.8fr_1fr]">
        <section className="glass-panel rounded-lg p-5">
          <div className="mb-4 flex items-center gap-2 text-xl font-black text-white">
            <Bell className="h-5 w-5 text-cyan-200" />
            车手名片
          </div>
          <label className="block text-sm font-bold text-slate-300">
            昵称
            <input
              value={nickname}
              onChange={(event) => updateNickname(event.target.value)}
              className="mt-2 h-12 w-full rounded-lg border border-slate-700 bg-slate-950/70 px-4 text-white outline-none focus:border-cyan-300"
              maxLength={18}
            />
          </label>
          <div className="mt-5 rounded-lg bg-slate-950/50 p-4">
            <div className="text-sm text-slate-400">默认保存名</div>
            <div className="mt-1 text-2xl font-black text-white">{nickname.trim() || "匿名车手"}</div>
          </div>
        </section>

        <section className="glass-panel rounded-lg p-5">
          <div className="mb-4 flex items-center gap-2 text-xl font-black text-white">
            <SlidersHorizontal className="h-5 w-5 text-cyan-200" />
            游戏设置
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-300">音效 / 音乐</div>
              <button
                type="button"
                onClick={() => updateSound(!sound)}
                className="arena-button-secondary h-11 px-4"
              >
                {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {sound ? "声音开启" : "声音关闭"}
              </button>
            </div>
            <div className="rounded-lg border border-slate-700/70 bg-slate-950/50 p-4">
              <div className="mb-3 text-sm font-bold text-slate-300">画质</div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(["auto", "high", "medium", "low"] as QualitySetting[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => updateQuality(item)}
                    className={`h-11 rounded-lg border text-sm font-black ${
                      quality === item
                        ? "border-cyan-300 bg-cyan-300/15 text-cyan-100"
                        : "border-slate-700 bg-slate-900/70 text-slate-300"
                    }`}
                  >
                    {item === "auto" ? "自动" : item === "high" ? "高" : item === "medium" ? "中" : "低"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
