import { useGLTF, Html } from "@react-three/drei";
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

  const canvasTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1366;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // 💜 기본 그라디언트 배경만 유지
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 🚫 비눗방울(랜덤 원) 제거됨
      // ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      // for (let i = 0; i < 10; i++) {
      //   ctx.beginPath();
      //   ctx.arc(
      //     Math.random() * canvas.width,
      //     Math.random() * canvas.height,
      //     Math.random() * 100 + 50,
      //     0,
      //     Math.PI * 2
      //   );
      //   ctx.fill();
      // }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  const blurMaterial = useMemo(() => {
    if (!canvasTexture) return null;
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: canvasTexture },
        uBlurAmount: { value: 0.006 },
        uBrightness: { value: 0.8 },
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
        varying vec2 vUv;
        
        void main() {
          vec4 color = vec4(0.0);
          float total = 0.0;
          
          for (int x = -3; x <= 3; x++) {
            for (int y = -3; y <= 3; y++) {
              vec2 offset = vec2(float(x), float(y)) * uBlurAmount;
              float weight = 1.0 / (1.0 + length(offset) * 10.0);
              color += texture2D(uTexture, vUv + offset) * weight;
              total += weight;
            }
          }
          
          color /= total;
          color.rgb *= uBrightness;
          gl_FragColor = color;
        }
      `,
    });
  }, [canvasTexture]);

  return (
    <group rotation={[0, Math.PI, Math.PI / 2]}>
      {" "}
      {/* ✅ 90도 회전 */}
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
            isLocked && blurMaterial ? (
              <primitive object={blurMaterial} attach="material" />
            ) : (
              <meshBasicMaterial map={canvasTexture} toneMapped={false} />
            )
          ) : (
            <meshStandardMaterial color="#000" />
          )}
        </mesh>
      )}
      {/* 🔒 잠금화면 */}
      {powerOn && isLocked && (
        <Html
          transform
          occlude
          position={[0, 0, -0.002]}
          rotation={[0, Math.PI, Math.PI / 2]} // ✅ 회전 동기화
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
          <LockScreen onUnlock={onUnlock} />
        </Html>
      )}
      {/* 🏠 홈화면 */}
      {powerOn && !isLocked && !showModal && onAppClick && (
        <Html
          transform
          occlude
          position={[0, 0, -0.002]}
          rotation={[0, Math.PI, Math.PI / 2]} // ✅ 동일하게 회전
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
