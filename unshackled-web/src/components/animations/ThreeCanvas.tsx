"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCanvasProps {
  children?: React.ReactNode;
  onAnimate?: (state: {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    clock: THREE.Clock;
    frame: number;
  }) => void;
  className?: string;
  id?: string;
}

/**
 * Base wrapper for Three.js animations.
 * Handles renderer initialization, scene setup, camera aspect ratio on resize,
 * and the animation loop.
 */
export default function ThreeCanvas({ onAnimate, className = "", id }: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const frameRef = useRef(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent background to layer over UI
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Initialize Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // 3. Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // 4. Animation Loop
    const animate = () => {
      if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;

      frameRef.current += 1;
      
      if (onAnimate) {
        onAnimate({
          scene: sceneRef.current,
          camera: cameraRef.current,
          renderer: rendererRef.current,
          clock: clockRef.current,
          frame: frameRef.current,
        });
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    // 5. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [onAnimate]);

  return (
    <div 
      ref={containerRef} 
      id={id}
      className={`fixed inset-0 z-0 pointer-events-none ${className}`} 
    />
  );
}
