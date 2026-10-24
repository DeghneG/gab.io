"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ENABLE_3D, isWebGLAvailable } from "@/data/setup";
import { Setup3DErrorBoundary } from "./Setup3DErrorBoundary";

const DynamicCanvas = dynamic(() => import("./Setup3DCanvas"), {
  ssr: false,
});

export interface Setup3DLayerProps {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  mouseSlotRef: React.RefObject<HTMLDivElement | null>;
  onActiveStateChange?: (active: boolean) => void;
  onResetReady?: (resetFn: () => void) => void;
  onMousePosChange?: (pos: { x: number; z: number; isDefault: boolean }) => void;
}

export default function Setup3DLayer({
  boardContainerRef,
  mouseSlotRef,
  onActiveStateChange,
  onResetReady,
  onMousePosChange,
}: Setup3DLayerProps) {
  const [canRender3D, setCanRender3D] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const resetFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (ENABLE_3D && isWebGLAvailable()) {
      setCanRender3D(true);
    } else {
      setCanRender3D(false);
      onActiveStateChange?.(false);
    }
  }, [onActiveStateChange]);

  const handleSceneReady = () => {
    setSceneReady(true);
    onActiveStateChange?.(true);
  };

  const handleError = () => {
    setCanRender3D(false);
    setSceneReady(false);
    onActiveStateChange?.(false);
  };

  const handleResetRef = (fn: () => void) => {
    resetFnRef.current = fn;
    onResetReady?.(fn);
  };

  if (!canRender3D) {
    return null;
  }

  return (
    <Setup3DErrorBoundary onError={handleError}>
      <DynamicCanvas
        boardContainerRef={boardContainerRef}
        mouseSlotRef={mouseSlotRef}
        onReady={handleSceneReady}
        onResetRef={handleResetRef}
        onMousePosChange={onMousePosChange}
      />
    </Setup3DErrorBoundary>
  );
}
