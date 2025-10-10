import { useState } from "react";
import Screen from "./components/Screen";
import BootScreen from "./components/BootScreen";

export default function App() {
  const [bootDone, setBootDone] = useState(false); // ✅ 추가
  const [isLocked, setIsLocked] = useState(true);
  const [powerOn] = useState(true);
  const [showModal, setShowModal] = useState<string | null>(null);

  const handleAppClick = (appName: string) => {
    if (appName === "프로젝트") setShowModal("프로젝트");
  };

  const handleCloseModal = () => setShowModal(null);
  const handleUnlock = () => setIsLocked(false);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* 🎥 3D 화면 */}
      <Screen
        powerOn={powerOn}
        isLocked={isLocked}
        showModal={showModal}
        onAppClick={handleAppClick}
        onCloseModal={handleCloseModal}
        onUnlock={handleUnlock}
      />

      {!bootDone && (
        <BootScreen
          durationMs={3000}
          logoSrc="/icons/apple.svg"
          onContinue={() => setBootDone(true)}
        />
      )}
    </div>
  );
}
