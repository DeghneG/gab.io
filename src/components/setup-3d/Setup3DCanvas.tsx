"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { gsap } from "gsap";

export interface Setup3DCanvasProps {
  boardContainerRef: React.RefObject<HTMLDivElement | null>;
  mouseSlotRef: React.RefObject<HTMLDivElement | null>;
  onReady?: () => void;
  onResetRef?: (resetFn: () => void) => void;
  onMousePosChange?: (pos: { x: number; z: number; isDefault: boolean }) => void;
}

// Mouse real dimensions: 12.22 x 4.13 x 6.48 (1 unit = 10 mm)
const MOUSE_DIMS = {
  width: 6.48, // X axis (width)
  height: 4.13, // Y axis (height)
  length: 12.22, // Z axis (length)
  halfHeight: 4.13 / 2, // 2.065 (resting center Y)
};

// Camera tilt: 12 degrees off vertical
const TILT_DEG = 12;
const TILT_RAD = (TILT_DEG * Math.PI) / 180;
const FOV = 30;

/**
 * Inner 3D Scene rendered inside R3F Canvas
 */
function Pegboard3DScene({
  boardContainerRef,
  mouseSlotRef,
  onReady,
  onResetRef,
  onMousePosChange,
}: Setup3DCanvasProps) {
  const { camera, gl, invalidate } = useThree();

  const meshRef = useRef<THREE.Group>(null);
  const homePosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, MOUSE_DIMS.halfHeight, 0));
  const currentPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, MOUSE_DIMS.halfHeight, 0));
  const grabOffsetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // Motion state for GSAP
  const motionRef = useRef({
    lift: 0,
    tiltX: 0,
    tiltZ: 0,
    yaw: 0,
  });

  const targetTiltRef = useRef({ x: 0, z: 0 });
  const targetYawRef = useRef(0);

  // Board pixel and world bounds
  const boardSizeRef = useRef({
    widthPx: 1000,
    heightPx: 600,
    unitPerPx: 0.122,
    worldWidth: 120,
    worldHeight: 75,
  });

  // Calculate 3D intersection with horizontal ground plane at y = 0
  const getGroundPlaneIntersection = useCallback(
    (clientX: number, clientY: number): THREE.Vector3 | null => {
      if (!boardContainerRef.current) return null;
      const rect = boardContainerRef.current.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      const ndcX = (px / rect.width) * 2 - 1;
      const ndcY = -(py / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
      const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const hit = new THREE.Vector3();
      const res = raycaster.ray.intersectPlane(ground, hit);
      return res ? hit : null;
    },
    [boardContainerRef, camera]
  );

  // Clamp target world position so box stays within board bounds minus 16px margin
  const clampToBoardBounds = useCallback(
    (targetX: number, targetZ: number) => {
      if (!boardContainerRef.current) return { x: targetX, z: targetZ };
      const rect = boardContainerRef.current.getBoundingClientRect();

      // Raycast 16px margins from top-left and bottom-right
      const minHit = getGroundPlaneIntersection(rect.left + 16, rect.top + 16);
      const maxHit = getGroundPlaneIntersection(rect.right - 16, rect.bottom - 16);

      if (!minHit || !maxHit) return { x: targetX, z: targetZ };

      const minX = Math.min(minHit.x, maxHit.x) + MOUSE_DIMS.width / 2;
      const maxX = Math.max(minHit.x, maxHit.x) - MOUSE_DIMS.width / 2;
      const minZ = Math.min(minHit.z, maxHit.z) + MOUSE_DIMS.length / 2;
      const maxZ = Math.max(minHit.z, maxHit.z) - MOUSE_DIMS.length / 2;

      return {
        x: THREE.MathUtils.clamp(targetX, minX, maxX),
        z: THREE.MathUtils.clamp(targetZ, minZ, maxZ),
      };
    },
    [boardContainerRef, getGroundPlaneIntersection]
  );

  // Sync Camera distance & Home slot position with container size
  const updateCameraAndHomePos = useCallback(() => {
    if (!boardContainerRef.current) return;
    const rect = boardContainerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Unit scale: 1 unit = 10 mm. On desktop, ~8.2 px / unit => 0.122 units / px
    const unitPerPx = 0.122;
    const worldW = rect.width * unitPerPx;
    const worldH = rect.height * unitPerPx;

    boardSizeRef.current = {
      widthPx: rect.width,
      heightPx: rect.height,
      unitPerPx,
      worldWidth: worldW,
      worldHeight: worldH,
    };

    // Camera perspective fit
    const halfFovRad = (FOV / 2) * (Math.PI / 180);
    const distY = worldH / (2 * Math.tan(halfFovRad) * Math.cos(TILT_RAD));

    const camY = distY * Math.cos(TILT_RAD);
    const camZ = distY * Math.sin(TILT_RAD);

    camera.position.set(0, camY, camZ);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Determine home position from Mouse tile's icon in DOM
    if (mouseSlotRef.current) {
      const slotRect = mouseSlotRef.current.getBoundingClientRect();
      const slotCenterX = slotRect.left + slotRect.width / 2;
      const slotCenterY = slotRect.top + slotRect.height / 2;

      const hit = getGroundPlaneIntersection(slotCenterX, slotCenterY);
      if (hit) {
        homePosRef.current.set(hit.x, MOUSE_DIMS.halfHeight, hit.z);
        if (!isDraggingRef.current) {
          currentPosRef.current.copy(homePosRef.current);
          if (meshRef.current) {
            meshRef.current.position.copy(homePosRef.current);
          }
        }
      }
    }

    setIsReady(true);
    onReady?.();
    invalidate();
  }, [boardContainerRef, mouseSlotRef, camera, getGroundPlaneIntersection, onReady, invalidate]);

  // Initial measurement and ResizeObserver setup
  useEffect(() => {
    updateCameraAndHomePos();

    const el = boardContainerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      updateCameraAndHomePos();
    });
    ro.observe(el);

    window.addEventListener("resize", updateCameraAndHomePos);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateCameraAndHomePos);
    };
  }, [boardContainerRef, updateCameraAndHomePos]);

  // Reset animation callback
  const handleResetPosition = useCallback(() => {
    if (isDraggingRef.current) return;
    gsap.killTweensOf([currentPosRef.current, motionRef.current]);

    gsap.to(currentPosRef.current, {
      x: homePosRef.current.x,
      z: homePosRef.current.z,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => invalidate(),
    });

    gsap.to(motionRef.current, {
      lift: 0,
      tiltX: 0,
      tiltZ: 0,
      yaw: 0,
      duration: 0.45,
      ease: "bounce.out",
      onUpdate: () => invalidate(),
    });

    targetTiltRef.current = { x: 0, z: 0 };
    targetYawRef.current = 0;
  }, [invalidate]);

  // Expose reset trigger to parent
  useEffect(() => {
    onResetRef?.(handleResetPosition);
  }, [onResetRef, handleResetPosition]);

  // Pointer event handlers for the draggable 3D box
  const handlePointerDown = (e: any) => {
    // Mouse and pen only (ignore touch)
    if (e.pointerType === "touch") return;
    e.stopPropagation();

    isDraggingRef.current = true;
    document.body.style.cursor = "grabbing";

    const hit = getGroundPlaneIntersection(e.clientX, e.clientY);
    if (hit) {
      grabOffsetRef.current.set(
        currentPosRef.current.x - hit.x,
        0,
        currentPosRef.current.z - hit.z
      );
    }

    // Lift 12 mm (1.2 units) with soft lift ease
    gsap.killTweensOf(motionRef.current);
    gsap.to(motionRef.current, {
      lift: 1.2,
      duration: 0.16,
      ease: "power2.out",
      onUpdate: () => invalidate(),
    });
  };

  const handlePointerOver = (e: any) => {
    if (e.pointerType === "touch") return;
    isHoveredRef.current = true;
    if (!isDraggingRef.current) {
      document.body.style.cursor = "grab";
    }
  };

  const handlePointerOut = (e: any) => {
    if (e.pointerType === "touch") return;
    isHoveredRef.current = false;
    if (!isDraggingRef.current) {
      document.body.style.cursor = "default";
    }
  };

  // Global window listeners while dragging
  useEffect(() => {
    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (e.pointerType === "touch") return;

      const hit = getGroundPlaneIntersection(e.clientX, e.clientY);
      if (!hit) return;

      const rawX = hit.x + grabOffsetRef.current.x;
      const rawZ = hit.z + grabOffsetRef.current.z;

      const clamped = clampToBoardBounds(rawX, rawZ);

      const deltaX = clamped.x - currentPosRef.current.x;
      const deltaZ = clamped.z - currentPosRef.current.z;
      const speed = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);

      currentPosRef.current.x = clamped.x;
      currentPosRef.current.z = clamped.z;

      // Tilt ~6 degrees (0.105 rad) toward movement direction
      if (speed > 0.001) {
        const maxTilt = (6 * Math.PI) / 180;
        const dirX = deltaX / speed;
        const dirZ = deltaZ / speed;
        const factor = Math.min(1, speed * 2.2);

        targetTiltRef.current.x = dirZ * maxTilt * factor;
        targetTiltRef.current.z = -dirX * maxTilt * factor;

        // Yaw gently toward travel direction
        targetYawRef.current = Math.atan2(dirX, -dirZ);
      } else {
        targetTiltRef.current.x = 0;
        targetTiltRef.current.z = 0;
      }

      const isHome =
        Math.abs(currentPosRef.current.x - homePosRef.current.x) < 0.2 &&
        Math.abs(currentPosRef.current.z - homePosRef.current.z) < 0.2;
      onMousePosChange?.({
        x: currentPosRef.current.x,
        z: currentPosRef.current.z,
        isDefault: isHome,
      });

      invalidate();
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.style.cursor = isHoveredRef.current ? "grab" : "default";

      // Drop with short bounce (~0.35s)
      gsap.killTweensOf(motionRef.current);
      gsap.to(motionRef.current, {
        lift: 0,
        tiltX: 0,
        tiltZ: 0,
        yaw: 0,
        duration: 0.35,
        ease: "bounce.out",
        onUpdate: () => invalidate(),
      });

      targetTiltRef.current = { x: 0, z: 0 };
      targetYawRef.current = 0;

      const isHome =
        Math.abs(currentPosRef.current.x - homePosRef.current.x) < 0.2 &&
        Math.abs(currentPosRef.current.z - homePosRef.current.z) < 0.2;
      onMousePosChange?.({
        x: currentPosRef.current.x,
        z: currentPosRef.current.z,
        isDefault: isHome,
      });

      invalidate();
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);
    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      document.body.style.cursor = "default";
    };
  }, [getGroundPlaneIntersection, clampToBoardBounds, onMousePosChange, invalidate]);

  // Frame update for smooth damping
  useFrame(() => {
    if (!meshRef.current) return;

    if (isDraggingRef.current) {
      motionRef.current.tiltX = THREE.MathUtils.lerp(
        motionRef.current.tiltX,
        targetTiltRef.current.x,
        0.18
      );
      motionRef.current.tiltZ = THREE.MathUtils.lerp(
        motionRef.current.tiltZ,
        targetTiltRef.current.z,
        0.18
      );
      motionRef.current.yaw = THREE.MathUtils.lerp(
        motionRef.current.yaw,
        targetYawRef.current,
        0.1
      );
    }

    meshRef.current.position.set(
      currentPosRef.current.x,
      MOUSE_DIMS.halfHeight + motionRef.current.lift,
      currentPosRef.current.z
    );

    meshRef.current.rotation.set(
      motionRef.current.tiltX,
      motionRef.current.yaw,
      motionRef.current.tiltZ
    );
  });

  return (
    <>
      {/* ── Lighting ── */}
      {/* Cool ambient/fill light */}
      <ambientLight intensity={0.8} color="#E2E8F0" />

      {/* Key directional light with soft shadows */}
      <directionalLight
        position={[20, 35, 25]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-near={10}
        shadow-camera-far={80}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* ── Ground Shadow Plane at y = 0 ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry
          args={[
            Math.max(160, boardSizeRef.current.worldWidth * 1.4),
            Math.max(100, boardSizeRef.current.worldHeight * 1.4),
          ]}
        />
        <shadowMaterial opacity={0.25} transparent />
      </mesh>

      {/* ── Mouse Placeholder: Rounded Box (12.22 x 4.13 x 6.48) ── */}
      <group
        ref={meshRef}
        position={[
          homePosRef.current.x,
          MOUSE_DIMS.halfHeight,
          homePosRef.current.z,
        ]}
      >
        <RoundedBox
          args={[MOUSE_DIMS.width, MOUSE_DIMS.height, MOUSE_DIMS.length]}
          radius={0.8}
          smoothness={4}
          castShadow
          receiveShadow
          onPointerDown={handlePointerDown}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshStandardMaterial
            color="#8C0027"
            roughness={0.35}
            metalness={0.08}
          />
        </RoundedBox>
      </group>
    </>
  );
}

/**
 * Main Setup 3D Canvas export (R3F Canvas wrapped over board)
 */
export default function Setup3DCanvas({
  boardContainerRef,
  mouseSlotRef,
  onReady,
  onResetRef,
  onMousePosChange,
}: Setup3DCanvasProps) {
  return (
    <Canvas
      eventSource={boardContainerRef as any}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 15,
      }}
      camera={{
        fov: FOV,
        near: 1,
        far: 300,
      }}
      gl={{
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: false,
      }}
      shadows
      dpr={[1, 1.5]}
      frameloop="demand"
    >
      <Pegboard3DScene
        boardContainerRef={boardContainerRef}
        mouseSlotRef={mouseSlotRef}
        onReady={onReady}
        onResetRef={onResetRef}
        onMousePosChange={onMousePosChange}
      />
    </Canvas>
  );
}
