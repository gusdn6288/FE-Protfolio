import { useGLTF } from "@react-three/drei";
import { forwardRef, useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

interface MoonProps {
  onSelect?: () => void;
  onHover?: (hovered: boolean) => void;
}

const Moon = forwardRef<THREE.Group | null, MoonProps>(
  ({ onSelect, onHover }, ref) => {
    const { scene } = useGLTF("/moon.glb");
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onSelect?.();
    };

    return (
      <group
        ref={ref}
        position={[3, 0, 0]}
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
);

export default Moon;
