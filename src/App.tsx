import { useState } from "react";
import Screen from "./components/Screen";
import BootScreen from "./components/BootScreen";

export default function App() {
  const [bootDone, setBootDone] = useState(false); // ✅ 추가
  const [isLocked, setIsLocked] = useState(true);
  const [powerOn, setPowerOn] = useState(true);
  const [showModal, setShowModal] = useState<string | null>(null);

  const handleAppClick = (appName: string) => {
    if (appName === "프로젝트") setShowModal("프로젝트");
  };

  const handleCloseModal = () => setShowModal(null);
  const handleUnlock = () => setIsLocked(false);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* ⚙️ 컨트롤 패널 */}
      <div className="absolute top-6 left-6 text-white space-y-3 z-10 bg-black/40 p-5 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          iPad 3D Model
        </h1>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => setPowerOn(!powerOn)}
            disabled={!bootDone} // ✅ 부팅 전 비활성화
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
              !bootDone
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : powerOn
                ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            {powerOn ? "⚡ 전원 ON" : "🔌 전원 OFF"}
          </button>

          <button
            onClick={() => setIsLocked(!isLocked)}
            disabled={!powerOn || !bootDone} // ✅ 전원+부팅 체크
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
              !powerOn || !bootDone
                ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                : isLocked
                ? "bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/50"
                : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/50"
            }`}
          >
            {isLocked ? "🔒 잠금 해제" : "🔓 잠금"}
          </button>
        </div>
      </div>

      {/* 🎥 3D 화면 */}
      <Screen
        powerOn={powerOn}
        isLocked={isLocked}
        showModal={showModal}
        onAppClick={handleAppClick}
        onCloseModal={handleCloseModal}
        onUnlock={handleUnlock}
      />

      {/* 🖥️ 부트 오버레이 (5초 후 완료 → 클릭해서 닫기) */}
      {!bootDone && (
        <BootScreen
          durationMs={5000}
          logoSrc="/icons/apple.svg" // public 폴더에 아이콘 있으면 경로 지정
          onContinue={() => setBootDone(true)}
        />
      )}
    </div>
  );
}
