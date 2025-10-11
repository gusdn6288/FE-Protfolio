import { useState } from "react";
import Screen from "./components/Screen";
import BootScreen from "./components/BootScreen";

export default function App() {
  const [bootDone, setBootDone] = useState(false);
  const [isLocked, setIsLocked] = useState(true);
  const [powerOn] = useState(true);
  const [showModal, setShowModal] = useState<string | null>(null);

  const handleAppClick = (appName: string) => {
    if (appName === "프로젝트") setShowModal("프로젝트");
  };

  const handleCloseModal = () => setShowModal(null);
  const handleUnlock = () => setIsLocked(false);

  return (
    // ✅ 배경 그라데이션 제거하고 Screen이 전체를 차지하도록
    <div className="w-screen h-screen relative overflow-hidden">
      <Screen
        powerOn={powerOn}
        isLocked={isLocked}
        showModal={showModal}
        onAppClick={handleAppClick}
        onCloseModal={handleCloseModal}
        onUnlock={handleUnlock}
        backgroundUrl="/images/bg.png"
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
