import type { ReactNode } from "react";

interface PanelLayoutProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function PanelLayout({
  title,
  isOpen,
  onClose,
  children,
}: PanelLayoutProps) {
  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-[700px] 
        bg-white shadow-2xl border-l border-gray-200
        z-50 transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* 헤더 */}
      <div className="flex-shrink-0 p-6 flex justify-between items-start border-b border-gray-200">
        <h2 className="text-[30px] font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 text-2xl hover:text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
}
