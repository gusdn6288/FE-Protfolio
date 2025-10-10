// src/components/IpadModel.tsx
import { useGLTF, Html, useVideoTexture } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import LockScreen from "./LockScreen";
import HomeScreen from "./HomeScreen";

interface IpadModelProps {
  onAppClick?: (appName: string) => void;
}
const SCREEN_KEY = "iPad_Mini_Screen_0";

interface MeshData {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
}

const getGeometryMesh = (nodes: Record<string, THREE.Mesh>) => {
  const keys = Object.keys(nodes);
  const screenKey =
    keys.find(
      (k) =>
        k.toLowerCase().includes("screen") ||
        k.toLowerCase().includes("display") ||
        k === SCREEN_KEY
    ) || SCREEN_KEY;

  const standardKeys = keys.filter((k) => k !== screenKey);

  const getMesh = (key: string): MeshData | null => {
    const node = nodes[key];
    if (!node || !node.geometry) return null;
    return {
      geometry: node.geometry as THREE.BufferGeometry,
      material: node.material as THREE.Material,
    };
  };

  const screen = screenKey ? getMesh(screenKey) : null;
  const standard = standardKeys
    .map(getMesh)
    .filter((m): m is MeshData => m !== null);
  return { standard, screen };
};

interface IpadModelProps {
  powerOn?: boolean;
  isLocked?: boolean;
  showModal?: string | null;
  onAppClick?: (appName: string) => void;
  onCloseModal?: () => void;
  onUnlock?: () => void;
}

export default function IpadModel({
  powerOn = false,
  isLocked = true,
  showModal = null,
  onAppClick,
  onUnlock,
}: IpadModelProps) {
  const { nodes } = useGLTF("/models/glb/IPad.glb") as unknown as {
    nodes: Record<string, THREE.Mesh>;
  };

  const { standard, screen } = useMemo(() => getGeometryMesh(nodes), [nodes]);

  // 🎥 VideoTexture
  const videoTexture = useVideoTexture("/videos/wallpaper.mp4", {
    crossOrigin: "anonymous",
    muted: true,
    loop: true,
    autoplay: true,
    start: powerOn,
  });
  videoTexture.flipY = false;
  videoTexture.colorSpace = THREE.SRGBColorSpace;
  videoTexture.center.set(0.5, 0.5);
  videoTexture.rotation = Math.PI / 2;

  // ✅ 가우시안 블러 셰이더 머티리얼
  const blurMaterial = useMemo(() => {
    if (!videoTexture) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: videoTexture },
        uBlurAmount: { value: 0.003 },
        uBrightness: { value: 0.85 },
        uRotation: { value: videoTexture.rotation },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uBlurAmount;
        uniform float uBrightness;
        uniform float uRotation;
        varying vec2 vUv;

        vec2 rotateUV(vec2 uv, float angle) {
          uv -= 0.5;
          float c = cos(angle), s = sin(angle);
          mat2 m = mat2(c, -s, s, c);
          uv = m * uv;
          uv += 0.5;
          return uv;
        }

        float gaussian(float x, float sigma) {
          return exp(-(x * x) / (2.0 * sigma * sigma));
        }

        void main() {
          vec2 baseUv = rotateUV(vUv, uRotation);
          
          vec4 color = vec4(0.0);
          float total = 0.0;
          float sigma = 2.0;

          for (int i = -4; i <= 4; i++) {
            for (int j = -4; j <= 4; j++) {
              vec2 offset = vec2(float(i), float(j)) * uBlurAmount;
              float dist = length(offset);
              
              if (dist <= uBlurAmount * 4.5) {
                vec2 uv = baseUv + offset;
                float weight = gaussian(dist / uBlurAmount, sigma);
                color += texture2D(uTexture, uv) * weight;
                total += weight;
              }
            }
          }

          color /= total;
          color.rgb *= uBrightness;
          gl_FragColor = color;
        }
      `,
      toneMapped: false,
    });
  }, [videoTexture]);

  // 일반 비디오 머티리얼
  const videoMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      toneMapped: false,
    });
    return mat;
  }, [videoTexture]);

  return (
    <group rotation={[0, Math.PI, Math.PI / 2]}>
      {standard.map((mesh, index) => (
        <mesh
          key={`${mesh.geometry.uuid}-${index}`}
          geometry={mesh.geometry}
          material={mesh.material}
          castShadow
          receiveShadow
        />
      ))}

      {screen && (
        <mesh geometry={screen.geometry} castShadow receiveShadow>
          {powerOn ? (
            // ✅ 잠금 시 블러, 해제 시 원본
            isLocked && blurMaterial ? (
              <primitive object={blurMaterial} attach="material" />
            ) : (
              <primitive object={videoMaterial} attach="material" />
            )
          ) : (
            <meshStandardMaterial color="#000" />
          )}
        </mesh>
      )}

      {/* 🔒 잠금화면 UI */}
      {powerOn && isLocked && (
        <Html
          transform
          occlude
          position={[0, 0, -0.002]}
          rotation={[0, Math.PI, Math.PI / 2]}
          scale={0.3}
          distanceFactor={1}
          zIndexRange={[1, 1]}
          style={{
            width: "1024px",
            height: "1366px",
            pointerEvents: "auto",
            userSelect: "none",
          }}
        >
          <LockScreen onUnlock={onUnlock} />
        </Html>
      )}

      {/* 🏠 홈화면 */}
      {powerOn && !isLocked && !showModal && onAppClick && (
        <Html
          transform
          occlude
          position={[0, 0, -0.002]}
          rotation={[0, Math.PI, Math.PI / 2]}
          scale={0.3}
          distanceFactor={1}
          zIndexRange={[0, 0]}
          style={{
            width: "1024px",
            height: "1366px",
            pointerEvents: "auto",
            userSelect: "none",
          }}
        >
          <HomeScreen />
        </Html>
      )}
    </group>
  );
}
