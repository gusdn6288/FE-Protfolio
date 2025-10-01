// src/components/EarthModel.tsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import Earth from "./Earth";
import Stars from "./Stars";
import ProjectPanel from "./ProjectPanel";
import ProfilePanel from "./ProfilePanel";
import Moon from "./Moon";
import { projects } from "../data/projects";
import * as THREE from "three";

// Postprocessing
import {
  EffectComposer,
  Outline,
  Selection,
  Select,
} from "@react-three/postprocessing";

export interface Project {
  label: string;
  summary: string;
  details: string;
  image?: string;
  links?: { label: string; url: string }[];
  pdfUrl?: string;
}

export interface EarthModelHandle {
  goToEarth: () => void;
  goToMoon: () => void;
}

function CameraAnimator({
  target,
  followRef,
}: {
  target: THREE.Vector3 | null;
  followRef?: React.RefObject<THREE.Group | null>;
}) {
  const { camera, controls } = useThree();

  useFrame(() => {
    if (followRef?.current) {
      const moonPos = new THREE.Vector3();
      followRef.current.getWorldPosition(moonPos);

      const fixedPos = new THREE.Vector3(
        moonPos.x - 1,
        moonPos.y + 1,
        moonPos.z + 4
      );

      camera.position.lerp(fixedPos, 0.05);
      camera.lookAt(moonPos);

      if (controls && "target" in controls) {
        const orbitControls = controls as { target: THREE.Vector3 };
        orbitControls.target.lerp(moonPos, 0.05);
      }
    } else if (target) {
      camera.position.lerp(target, 0.05);
      camera.lookAt(0, 0, 0);

      if (controls && "target" in controls) {
        const orbitControls = controls as { target: THREE.Vector3 };
        orbitControls.target.lerp(new THREE.Vector3(0, 0, 0), 0.05);
      }
    }
  });

  return null;
}

// 🌙 달 공전 애니메이션 컴포넌트
// MoonOrbit 컴포넌트의 타입을 수정
function MoonOrbit({
  moonRef,
}: {
  moonRef: React.RefObject<THREE.Group | null>;
}) {
  const angleRef = useRef(0);

  useFrame(() => {
    if (moonRef.current) {
      angleRef.current += 0.001;

      const radius = 2;
      const tilt = 1;

      const x = Math.cos(angleRef.current) * radius;
      const z = Math.sin(angleRef.current) * radius;
      const y = Math.sin(angleRef.current) * radius * tilt;

      moonRef.current.position.set(x, y, z);
    }
  });

  return null;
}

const EarthModel = forwardRef<EarthModelHandle>((_, ref) => {
  const [selected, setSelected] = useState<Project | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(
    new THREE.Vector3(0, 0, 5)
  );
  const [followMoon, setFollowMoon] = useState(false);
  const [hoveredEarth, setHoveredEarth] = useState(false);
  const [hoveredMoon, setHoveredMoon] = useState(false);

  const moonRef = useRef<THREE.Group>(null);

  const handleSelectEarth = () => {
    setSelected(projects[0]);
    setCameraTarget(new THREE.Vector3(0, 0, 5));
    setFollowMoon(false);
    setIsProfileOpen(false);
  };

  const handleSelectMoon = () => {
    setIsProfileOpen(true);
    setFollowMoon(true);
    setCameraTarget(null);
    setSelected(null);
  };

  useImperativeHandle(ref, () => ({
    goToEarth: handleSelectEarth,
    goToMoon: handleSelectMoon,
  }));

  return (
    <div className="flex w-full h-screen bg-black relative">
      <div className="flex-1 relative">
        <Canvas camera={{ position: [0, 1, 5], fov: 60 }}>
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <Stars />

          <Selection>
            <Select enabled={hoveredEarth}>
              <Earth onSelect={handleSelectEarth} onHover={setHoveredEarth} />
            </Select>

            <Select enabled={hoveredMoon}>
              <Moon
                ref={moonRef}
                onSelect={handleSelectMoon}
                onHover={setHoveredMoon}
              />
            </Select>

            <EffectComposer multisampling={8} autoClear={false}>
              <Outline
                blur
                edgeStrength={10}
                visibleEdgeColor={0xffffff}
                hiddenEdgeColor={0xffffff}
              />
            </EffectComposer>
          </Selection>

          {/* 🌙 달 공전 애니메이션 */}
          <MoonOrbit moonRef={moonRef} />

          <CameraAnimator
            target={cameraTarget}
            followRef={followMoon ? moonRef : undefined}
          />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            enabled={!followMoon}
          />
        </Canvas>
      </div>

      <div className="overflow-y-auto h-full scrollbar-hide">
        <ProjectPanel
          projects={projects}
          selected={selected}
          onClose={() => {
            setSelected(null);
            setFollowMoon(false);
            setCameraTarget(new THREE.Vector3(0, 0, 7));
          }}
          onSelect={(p) => setSelected(p)}
        />

        <ProfilePanel
          isOpen={isProfileOpen}
          onClose={() => {
            setIsProfileOpen(false);
            setFollowMoon(false);
            setCameraTarget(new THREE.Vector3(0, 0, 7));
          }}
        />
      </div>
    </div>
  );
});

export default EarthModel;
