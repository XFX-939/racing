"use client";

import { useCallback, useRef } from "react";
import type { PointerEvent } from "react";
import type { ControlsState } from "@/types/game";
import { emptyControls } from "@/hooks/useKeyboardControls";

export function useTouchControls() {
  const controlsRef = useRef<ControlsState>({ ...emptyControls });

  const setControl = useCallback((key: keyof ControlsState, pressed: boolean) => {
    controlsRef.current[key] = pressed;
  }, []);

  const bindControl = useCallback(
    (key: keyof ControlsState) => ({
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        setControl(key, true);
      },
      onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setControl(key, false);
      },
      onPointerCancel: () => setControl(key, false),
      onPointerLeave: () => setControl(key, false)
    }),
    [setControl]
  );

  const resetTouchControls = useCallback(() => {
    controlsRef.current = { ...emptyControls };
  }, []);

  return { controlsRef, bindControl, resetTouchControls };
}
