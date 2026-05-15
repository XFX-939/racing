"use client";

import { ArrowDown, ArrowLeft, ArrowRight, Flame, Gauge, Wind } from "lucide-react";
import type { ControlsState } from "@/types/game";
import type { PointerEvent } from "react";

type BindControl = (key: keyof ControlsState) => {
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
};

interface MobileControlsProps {
  bindControl: BindControl;
  enabled: boolean;
}

function ControlButton({
  label,
  children,
  enabled,
  bind
}: {
  label: string;
  children: React.ReactNode;
  enabled: boolean;
  bind: ReturnType<BindControl>;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={!enabled}
      className="pointer-events-auto grid h-16 w-16 select-none place-items-center rounded-lg border border-cyan-300/25 bg-slate-950/52 text-white shadow-neon backdrop-blur-md active:scale-95 disabled:opacity-35"
      style={{ touchAction: "none" }}
      {...bind}
    >
      {children}
    </button>
  );
}

export function MobileControls({ bindControl, enabled }: MobileControlsProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 px-4 pb-5 sm:hidden safe-bottom">
      <div className="flex gap-3">
        <ControlButton label="左转" enabled={enabled} bind={bindControl("left")}>
          <ArrowLeft className="h-8 w-8" />
        </ControlButton>
        <ControlButton label="右转" enabled={enabled} bind={bindControl("right")}>
          <ArrowRight className="h-8 w-8" />
        </ControlButton>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ControlButton label="加速" enabled={enabled} bind={bindControl("accelerate")}>
          <Gauge className="h-7 w-7 text-cyan-100" />
        </ControlButton>
        <ControlButton label="刹车" enabled={enabled} bind={bindControl("brake")}>
          <ArrowDown className="h-7 w-7 text-orange-200" />
        </ControlButton>
        <ControlButton label="氮气" enabled={enabled} bind={bindControl("nitro")}>
          <Flame className="h-7 w-7 text-cyan-200" />
        </ControlButton>
        <ControlButton label="漂移" enabled={enabled} bind={bindControl("drift")}>
          <Wind className="h-7 w-7 text-purple-200" />
        </ControlButton>
      </div>
    </div>
  );
}
