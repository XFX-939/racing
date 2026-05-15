import type { CarConfig } from "@/types/game";

export const cars: CarConfig[] = [
  {
    id: "street-falcon",
    name: "Street Falcon",
    description: "平衡型街机赛车，适合第一圈找节奏，也能稳定冲刺。",
    color: "#38BDF8",
    accentColor: "#F97316",
    maxSpeed: 80,
    acceleration: 75,
    handling: 75,
    nitroPower: 70,
    driftControl: 72
  },
  {
    id: "night-panther",
    name: "Night Panther",
    description: "高极速车型，直道爆发强，弯前需要更早收油。",
    color: "#A855F7",
    accentColor: "#22D3EE",
    maxSpeed: 90,
    acceleration: 70,
    handling: 65,
    nitroPower: 75,
    driftControl: 66
  },
  {
    id: "drift-fox",
    name: "Drift Fox",
    description: "漂移型赛车，弯道控制细腻，适合连贯甩尾走线。",
    color: "#F97316",
    accentColor: "#38BDF8",
    maxSpeed: 75,
    acceleration: 70,
    handling: 90,
    nitroPower: 65,
    driftControl: 92
  },
  {
    id: "thunder-gt",
    name: "Thunder GT",
    description: "爆发型 GT，氮气和加速强劲，对转向预判要求更高。",
    color: "#22C55E",
    accentColor: "#A855F7",
    maxSpeed: 85,
    acceleration: 90,
    handling: 60,
    nitroPower: 85,
    driftControl: 62
  }
];

export const defaultCar = cars[0];

export function getCarById(id: string | null | undefined): CarConfig {
  return cars.find((car) => car.id === id) ?? defaultCar;
}
