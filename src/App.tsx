// App.tsx
import { useRef } from "react";
import EarthModel, { type EarthModelHandle } from "./components/EarthModel";
import Navigation from "./components/Navigation";
import FabButtons from "./components/FabButtons";

function App() {
  const earthModelRef = useRef<EarthModelHandle>(null);

  return (
    <div className="w-screen h-screen min-h-screen bg-black flex flex-col items-center justify-center text-white relative">
      {/* 네비게이션 */}
      <Navigation
        onProjectClick={() => earthModelRef.current?.goToEarth()}
        onProfileClick={() => earthModelRef.current?.goToMoon()}
      />

      {/* 지구/달 */}
      <EarthModel ref={earthModelRef} />

      {/* FAB 버튼 (항상 화면 위에 표시) */}
      <FabButtons />
    </div>
  );
}

export default App;
