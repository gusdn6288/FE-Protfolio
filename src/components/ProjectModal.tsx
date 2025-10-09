// src/components/ProjectModal.tsx
import { useEffect, useState } from "react";
import type { projects } from "../data/projects";
type Project = (typeof projects)[number];

interface ProjectModalProps {
  project: Project | null;
  buttonRect: DOMRect | null;
  isOpen: boolean;
  isAnimating: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  buttonRect,
  isOpen,
  isAnimating,
  onClose,
}: ProjectModalProps) {
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setContentVisible(true), 250);
      return () => clearTimeout(t);
    } else {
      setContentVisible(false);
    }
  }, [isOpen]);

  if (!isAnimating || !buttonRect) return null;

  const getIconPath = (label: string): string => {
    const name = label.toLowerCase();
    if (name.includes("github")) return "/icons/GitHub.png";
    if (name.includes("youtube")) return "/icons/youtube.png";
    if (name.includes("notion")) return "/icons/notion.png";
    if (name.includes("figma")) return "/icons/Figm.png";
    if (name.includes("canva")) return "/icons/canva.png";
    if (name.includes("pdf")) return "/icons/pdf.png";
    return "/icons/link.png"; // fallback
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-auto ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="relative flex items-center justify-center w-full h-full pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-black/50 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl pointer-events-auto"
          style={
            isOpen
              ? { width: "800px", height: "440px", opacity: 1 }
              : {
                  width: `${buttonRect.width}px`,
                  height: `${buttonRect.height}px`,
                  opacity: 0,
                  transform: `translate(${
                    buttonRect.left +
                    buttonRect.width / 2 -
                    window.innerWidth / 2
                  }px, ${
                    buttonRect.top +
                    buttonRect.height / 2 -
                    window.innerHeight / 2
                  }px)`,
                }
          }
        >
          {project && (
            <div
              className={`w-full h-full p-8 flex flex-col transition-all duration-400 ${
                contentVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={project.image}
                    alt={project.label}
                    className="w-14 h-14 object-contain rounded-lg"
                  />
                  <h2 className="text-3xl font-bold">{project.label}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* 내용 */}
              <div className="flex-1 flex flex-col gap-6">
                <p className="text-lg text-white/80 leading-relaxed">
                  {project.details}
                </p>

                {/* 🔗 링크 섹션 */}
                <div>
                  <h3 className="text-sm font-semibold text-white/60 mb-3">
                    주요 링크
                  </h3>
                  <div
                    className="flex flex-wrap gap-10
                  "
                  >
                    {project?.links?.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.label}
                        className="w-22 h-22 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                      >
                        <img
                          src={getIconPath(link.label)}
                          alt={link.label}
                          className="w-18 h-18 object-contain"
                        />
                      </a>
                    ))}
                  </div>
                </div>

                {/* PDF 버튼 */}
                {project.pdfUrl && (
                  <a
                    href={project.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl text-center font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <span>프로젝트 PDF 보기</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
