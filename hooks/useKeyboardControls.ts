"use client";

import { useEffect, useRef } from "react";
import type { ControlsState } from "@/types/game";

export const emptyControls: ControlsState = {
  accelerate: false,
  brake: false,
  left: false,
  right: false,
  drift: false,
  nitro: false
};

function updateByKey(controls: ControlsState, key: string, pressed: boolean): boolean {
  const normalized = key.toLowerCase();
  if (normalized === "w" || key === "ArrowUp") controls.accelerate = pressed;
  else if (normalized === "s" || key === "ArrowDown") controls.brake = pressed;
  else if (normalized === "a" || key === "ArrowLeft") controls.left = pressed;
  else if (normalized === "d" || key === "ArrowRight") controls.right = pressed;
  else if (key === " ") controls.drift = pressed;
  else if (key === "Shift") controls.nitro = pressed;
  else return false;
  return true;
}

export function useKeyboardControls() {
  const controlsRef = useRef<ControlsState>({ ...emptyControls });

  useEffect(() => {
    function handleKey(event: KeyboardEvent, pressed: boolean) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }
      const handled = updateByKey(controlsRef.current, event.key, pressed);
      if (handled) {
        event.preventDefault();
      }
    }

    const down = (event: KeyboardEvent) => handleKey(event, true);
    const up = (event: KeyboardEvent) => handleKey(event, false);
    const reset = () => {
      controlsRef.current = { ...emptyControls };
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", reset);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return controlsRef;
}
