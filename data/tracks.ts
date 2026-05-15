import type { TrackConfig } from "@/types/game";

export const tracks: TrackConfig[] = [
  {
    id: "neon-city",
    name: "Neon City",
    description: "霓虹城市环道，直线和中速弯均衡，是极速竞技场的标准计时赛道。",
    difficulty: "normal",
    laps: 3,
    targetTime: 105,
    environment: "城市夜景",
    themeColor: "#38BDF8",
    roadWidth: 13,
    checkpoints: [
      { x: 0, z: -38 },
      { x: 32, z: -36 },
      { x: 58, z: -12 },
      { x: 54, z: 28 },
      { x: 20, z: 45 },
      { x: -24, z: 39 },
      { x: -56, z: 12 },
      { x: -48, z: -28 },
      { x: -18, z: -43 }
    ]
  },
  {
    id: "desert-loop",
    name: "Desert Loop",
    description: "沙漠高速环线，长直道更多，适合练习氮气释放和极速走线。",
    difficulty: "easy",
    laps: 3,
    targetTime: 95,
    environment: "沙漠高速",
    themeColor: "#F97316",
    roadWidth: 15,
    checkpoints: [
      { x: 0, z: -43 },
      { x: 46, z: -40 },
      { x: 72, z: -10 },
      { x: 66, z: 31 },
      { x: 20, z: 50 },
      { x: -36, z: 42 },
      { x: -70, z: 4 },
      { x: -54, z: -35 }
    ]
  },
  {
    id: "mountain-pass",
    name: "Mountain Pass",
    description: "山路弯道密集，连续漂移和轻碰撞修正会决定成绩上限。",
    difficulty: "hard",
    laps: 3,
    targetTime: 125,
    environment: "山路夜赛",
    themeColor: "#A855F7",
    roadWidth: 12,
    checkpoints: [
      { x: 0, z: -34 },
      { x: 20, z: -48 },
      { x: 42, z: -32 },
      { x: 34, z: -8 },
      { x: 56, z: 14 },
      { x: 28, z: 42 },
      { x: -2, z: 32 },
      { x: -28, z: 50 },
      { x: -55, z: 22 },
      { x: -38, z: -10 },
      { x: -55, z: -38 },
      { x: -20, z: -44 }
    ]
  }
];

export const defaultTrack = tracks[0];

export function getTrackById(id: string | null | undefined): TrackConfig {
  return tracks.find((track) => track.id === id) ?? defaultTrack;
}
