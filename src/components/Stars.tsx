import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function Stars() {
  const starsCount = 5000;
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, sizes, speeds } = useMemo(() => {
    const pos = new Float32Array(starsCount * 3);
    const col = new Float32Array(starsCount * 3);
    const siz = new Float32Array(starsCount);
    const spd = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
      // 위치 (구형으로 분포)
      pos[i * 3] = (Math.random() - 0.5) * 600;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 600;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 600;

      // 색상 (다양한 별 색상)
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.6);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      // 크기 (다양한 별 크기)
      siz[i] = Math.random() * 2 + 0.5;

      // 반짝임 속도 (각 별마다 다른 속도)
      spd[i] = Math.random() * 2 + 1;
    }

    return { positions: pos, colors: col, sizes: siz, speeds: spd };
  }, [starsCount]);

  // 애니메이션: 반짝임 효과
  useFrame((state) => {
    if (pointsRef.current) {
      const geometry = pointsRef.current.geometry;
      const sizeAttribute = geometry.attributes.size;

      if (sizeAttribute) {
        const time = state.clock.getElapsedTime();

        // 각 별의 크기를 시간에 따라 변경 (반짝임)
        for (let i = 0; i < starsCount; i++) {
          const originalSize = sizes[i];
          const speed = speeds[i];
          const twinkle = Math.sin(time * speed + i) * 0.5 + 0.5;
          sizeAttribute.array[i] = originalSize * (0.5 + twinkle * 0.5);
        }
        sizeAttribute.needsUpdate = true;
      }

      // 별 전체를 천천히 회전
      pointsRef.current.rotation.y += 0.0001;
      pointsRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
