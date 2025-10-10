import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import IpadModel from "./IpadModel";

interface ScreenProps {
  powerOn: boolean;
  isLocked: boolean;
  showModal: string | null;
  onAppClick: (appName: string) => void;
  onCloseModal: () => void;
  onUnlock: () => void;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.7, 0.05]} />
      <meshStandardMaterial color="#333" emissive="#111" />
    </mesh>
  );
}

export default function Screen({
  powerOn,
  isLocked,
  showModal,
  onAppClick,
  onCloseModal,
  onUnlock,
}: ScreenProps) {
  return (
    <Canvas
      shadows
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{ position: [0, 0, 5], fov: 10 }}
      gl={{
        preserveDrawingBuffer: true,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        position={[0, 5, 0]}
        intensity={0.4}
        angle={0.6}
        penumbra={1}
        castShadow
      />
      <Environment preset="city" />

      <Suspense fallback={<LoadingFallback />}>
        <IpadModel
          powerOn={powerOn}
          isLocked={isLocked}
          showModal={showModal}
          onAppClick={onAppClick}
          onCloseModal={onCloseModal}
          onUnlock={onUnlock}
        />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 4}
        target={[0, 0, 0]}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
