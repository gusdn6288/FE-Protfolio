import { useState, useEffect } from "react";
import { Battery } from "lucide-react";

interface StatusBarProps {
  className?: string;
  showTime?: boolean;
}

export default function StatusBar({
  className = "",
  showTime = true,
}: StatusBarProps) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const time = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className={`absolute top-75 left-0 right-0 flex items-center justify-between text-white z-50 ${className}`}
    >
      {/* 왼쪽: 시간 */}
      <div className="text-sm font-semibold">{showTime ? currentTime : ""}</div>

      {/* 오른쪽: 상태 아이콘들 */}
      <div className=" flex items-center gap-2 leading-none">
        {/* 통신 신호 (안테나 바) */}
        <div className="flex items-end gap-[1px] h-3">
          <div className="w-[4px] h-[4px] bg-white rounded-[1px]" />
          <div className="w-[4px] h-[6px] bg-white rounded-[1px]" />
          <div className="w-[4px] h-[8px] bg-white rounded-[1px]" />
          <div className="w-[4px] h-[10px] bg-white rounded-[1px]" />
        </div>

        {/* 5G 텍스트 */}
        <div className="flex items-center text-[13px] font-semibold tracking-tight leading-none pt-1">
          5G
        </div>

        {/* 배터리 아이콘 */}
        <div className="flex items-center leading-none">
          <Battery size={22} strokeWidth={3} className="fill-white" />
          <span className="text-[13px] font-semibold pt-1 ml-1">97%</span>
        </div>
      </div>
    </div>
  );
}
