"use client";

import { useRef, useCallback, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

interface MagneticTiltConfig {
  maxRotateX?: number;
  maxRotateY?: number;
  scale?: number;
  perspective?: number;
  springConfig?: { tension: number; friction: number };
}

interface MagneticTiltResult {
  ref: React.RefObject<HTMLDivElement>;
  style: ReturnType<typeof useSpring>[0];
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
    onMouseEnter: () => void;
  };
  spotlightPos: { x: number; y: number };
  isHovered: boolean;
}

export function useMagneticTilt(config: MagneticTiltConfig = {}): MagneticTiltResult {
  const {
    maxRotateX = 8,
    maxRotateY = 12,
    scale = 1.02,
    perspective = 1000,
    springConfig = { tension: 300, friction: 20 },
  } = config;

  const ref = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const [style, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    config: springConfig,
  }));

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized position (-1 to 1)
      const normalX = (e.clientX - centerX) / (rect.width / 2);
      const normalY = (e.clientY - centerY) / (rect.height / 2);

      // Clamp
      const clampedX = Math.max(-1, Math.min(1, normalX));
      const clampedY = Math.max(-1, Math.min(1, normalY));

      api.start({
        rotateX: -clampedY * maxRotateX,
        rotateY: clampedX * maxRotateY,
        scale,
      });

      // Spotlight position for specular highlight (percentage)
      setSpotlightPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    },
    [api, maxRotateX, maxRotateY, scale]
  );

  const onMouseLeave = useCallback(() => {
    api.start({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
    setIsHovered(false);
    setSpotlightPos({ x: 50, y: 50 });
  }, [api]);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  return {
    ref,
    style: {
      ...style,
      transform: style.rotateX.to(
        (rx) =>
          `perspective(${perspective}px) rotateX(${rx}deg) rotateY(${style.rotateY.get()}deg) scale(${style.scale.get()})`
      ),
    } as any,
    handlers: { onMouseMove, onMouseLeave, onMouseEnter },
    spotlightPos,
    isHovered,
  };
}

export { animated };
