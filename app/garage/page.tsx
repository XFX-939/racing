"use client";

import { useEffect, useState } from "react";
import { cars, defaultCar } from "@/data/cars";
import { getSelectedCarId, setSelectedCarId } from "@/lib/preferences";
import { CarCard } from "@/components/ui/CarCard";

export default function GaragePage() {
  const [selectedId, setSelectedId] = useState(defaultCar.id);

  useEffect(() => {
    setSelectedId(getSelectedCarId() ?? defaultCar.id);
  }, []);

  function handleSelect(id: string) {
    setSelectedId(id);
    setSelectedCarId(id);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Garage</p>
        <h1 className="mt-2 text-4xl font-black text-white">车库</h1>
        <p className="mt-3 max-w-2xl text-slate-400">选择默认赛车。不同车型会影响极速、加速、漂移和氮气手感。</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} selected={selectedId === car.id} onSelect={handleSelect} />
        ))}
      </div>
    </div>
  );
}
