import { useEffect, useRef, useState } from "react";

interface BootScreenProps {
  durationMs?: number; // 기본 5000ms
  logoSrc?: string; // 예: "/apple.svg"
  onContinue?: () => void; // 5초 완료 후 클릭 시 호출
}

export default function BootScreen({
  durationMs = 5000,
  logoSrc = "/apple.svg",
  onContinue,
}: BootScreenProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
      else setReady(true);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [durationMs]);

  const handleClick = () => {
    if (!ready) return;
    onContinue?.();
  };

  // Enter / Space 접근성
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!ready) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ready, onContinue]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      onClick={handleClick}
      style={{ cursor: ready ? "pointer" : "default" }}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-[min(420px,90vw)] flex-col items-center gap-6 text-white select-none">
        {logoSrc ? (
          <img src={logoSrc} alt="logo" className="w-30 h-30 mb-8 opacity-90" />
        ) : (
          <div className="text-4xl font-semibold">●</div>
        )}

        {/* 로딩바 */}
        <div className="w-full">
          <div
            className="h-2 w-full rounded-full bg-white/10 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div
              className="h-full rounded-full bg-white/80 transition-[width] duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-white/70 tabular-nums">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="text-sm text-white/70">
          {ready ? "클릭하여 계속" : "로딩 중…"}
        </div>
      </div>
    </div>
  );
}
