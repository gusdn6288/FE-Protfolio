import { useGLTF } from "@react-three/drei";
import { useRef, useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface EarthProps {
  onSelect?: () => void;
  onHover?: (hovered: boolean) => void;
}

export default function Earth({ onSelect, onHover }: EarthProps) {
  const { scene } = useGLTF("/earth.glb");
  const earthRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect?.();
  };

  return (
    <group
      ref={earthRef}
      scale={2}
      onClick={handleClick}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover?.(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        onHover?.(false);
        document.body.style.cursor = "default";
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}
