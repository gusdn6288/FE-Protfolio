import { useEffect, useRef, useState } from "react";

interface LoadingFallbackProps {
  onContinue?: () => void; // 로딩 끝난 뒤 클릭 시 다음 화면으로 전환
  minDurationMs?: number; // 최소 로딩 시간 (기본 5000ms)
  logoSrc?: string; // 로고 이미지 경로 (예: "/apple.svg")
}

export default function LoadingFallback({
  onContinue,
  minDurationMs = 1000,
  logoSrc = "/apple.svg",
}: LoadingFallbackProps) {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false); // 5초 완료 시 true
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  // 5초 동안 0→100% 진행
  useEffect(() => {
    const animate = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(100, (elapsed / minDurationMs) * 100);
      setProgress(p);
      if (p < 100) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setReady(true);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [minDurationMs]);

  const handleContinue = () => {
    if (!ready) return; // 5초 끝나기 전엔 클릭 막기
    onContinue?.();
  };

  // 키보드 접근성 (Enter/Space)
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
      role="dialog"
      aria-modal="true"
      onClick={handleContinue}
      style={{ cursor: ready ? "pointer" : "default" }}
    >
      {/* 컨텐츠 카드 */}
      <div className="flex w-[min(440px,90vw)] flex-col items-center gap-6 text-white select-none">
        {/* 로고 (이미지 없으면 텍스트 폴백) */}
        {logoSrc ? (
          <img
            src={logoSrc}
            alt="logo"
            className="w-12 h-12 opacity-90"
            draggable={false}
          />
        ) : (
          <div className="text-4xl font-semibold">●</div>
        )}

        {/* 로딩바 */}
        <div className="w-full">
          <div
            className="h-2 w-full rounded-full bg-white/10 overflow-hidden"
            aria-label="loading progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            role="progressbar"
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

        {/* 안내 텍스트 */}
        <div className="text-bases text-white/70">
          {ready ? "클릭하여 계속" : "로딩 중…"}
        </div>
      </div>
    </div>
  );
}
