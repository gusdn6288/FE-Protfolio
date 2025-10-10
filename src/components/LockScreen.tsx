import { useEffect, useRef, useState } from "react";
import StatusBar from "./StatusBar";
interface LockScreenProps {
  onUnlock?: () => void;
  onSlideStart?: () => void; // (선택)
  onSlideEnd?: () => void; // (선택)
}

export default function LockScreen({
  onUnlock,
  onSlideStart,
  onSlideEnd,
}: LockScreenProps) {
  const [time, setTime] = useState(new Date());
  const [isPressed, setIsPressed] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0); // 0~100
  const [trackWidth, setTrackWidth] = useState(0); // px 단위 트랙 너비
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 트랙 너비 추적 (리사이즈 대응)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => setTrackWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPressed(true);
    onSlideStart?.();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsPressed(false);
    onSlideEnd?.();
    if (slideProgress > 75) onUnlock?.();
    setSlideProgress(0);
  };

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPressed || !trackRef.current) return;
    e.stopPropagation();
    e.preventDefault();

    const rect = trackRef.current.getBoundingClientRect();
    const max = Math.max(0, rect.width - 64); // 64 = 버튼 지름
    const x = e.clientX - rect.left - 32; // 32 = 버튼 반지름
    const clamped = Math.min(Math.max(x, 0), max);
    setSlideProgress((clamped / max) * 100);
  };

  const timeText = time.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateText =
    time.toLocaleDateString("ko-KR", { month: "long", day: "numeric" }) +
    " " +
    time.toLocaleDateString("ko-KR", { weekday: "long" });

  const maxPx = Math.max(0, trackWidth - 64);
  const knobX = (slideProgress / 100) * maxPx;

  return (
    <div className="relative w-full h-full flex items-center justify-center text-white select-none">
      <div className="w-[90%] h-[55%] flex flex-col items-center justify-between py-10">
        <StatusBar showTime={false} />
        {/* 시간/날짜 */}
        <div className="flex flex-col items-center">
          <div className="text-[120px] font-extralight leading-none tracking-tight tabular-nums">
            {timeText}
          </div>
          <div className="mt-4 text-xl font-light opacity-90">{dateText}</div>
        </div>

        {/* 슬라이드 잠금 해제 */}
        <div className="w-[60%] space-y-4">
          <div
            ref={trackRef}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(slideProgress)}
            tabIndex={0}
            className="
              relative h-20 rounded-full overflow-hidden
              border border-white/20 bg-white/30 backdrop-blur-md
              touch-none select-none cursor-pointer
            "
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={(e) => isPressed && endDrag(e)}
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* 트랙 흐르는 하이라이트 */}
            <div
              className="absolute inset-0 bg-white/10"
              style={{
                maskImage:
                  "linear-gradient(90deg, transparent 0%, black 35%, black 65%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(90deg, transparent 0%, black 35%, black 65%, transparent 100%)",
                transform: `translateX(${slideProgress - 50}%)`,
                transition: !isPressed ? "transform 0.25s ease-out" : "none",
              }}
            />

            {/* 🔘 슬라이더 버튼 */}
            <div
              className="
                absolute top-2 left-2 w-16 h-16 rounded-full
                bg-white/90 shadow-lg flex items-center justify-center
                transition-transform
                will-change-transform
              "
              style={{
                transform: `translateX(${knobX}px)`,
                transition: !isPressed ? "transform 0.25s ease-out" : "none",
              }}
            >
              <span className="text-2xl text-black">
                {slideProgress > 60 ? ">" : ">"}
              </span>
            </div>

            {/* 안내 텍스트 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="text-white/80 font-medium text-lg transition-opacity"
                style={{ opacity: 1 - slideProgress / 40 }}
              >
                밀어서 잠금 해제
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
