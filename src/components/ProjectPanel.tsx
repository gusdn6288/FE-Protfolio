import { useState } from "react";
import type { Project } from "./EarthModel";
import { FaExternalLinkAlt } from "react-icons/fa";

interface SidePanelProps {
  projects: Project[];
  selected: Project | null;
  onClose: () => void;
  onSelect: (project: Project) => void;
}

export default function SidePanel({
  projects,
  selected,
  onClose,
  onSelect,
}: SidePanelProps) {
  const [hovered, setHovered] = useState<Project | null>(null);

  // 플랫폼별 텍스트 색상과 아이콘 매칭
  const getLinkStyle = (label: string) => {
    const lowerLabel = label.toLowerCase();

    if (lowerLabel.includes("github")) {
      return { textColor: "text-[#24292e]", icon: "/icons/GitHub.png" };
    } else if (lowerLabel.includes("youtube")) {
      return { textColor: "text-[#ff0000]", icon: "/icons/youtube.png" };
    } else if (lowerLabel.includes("notion")) {
      return { textColor: "text-[#000000]", icon: "/icons/notion.png" };
    } else if (lowerLabel.includes("figma")) {
      return { textColor: "text-[#a259ff]", icon: "/icons/Figma.png" };
    } else if (lowerLabel.includes("canva")) {
      return { textColor: "text-[#00c4cc]", icon: "/icons/canva.jpg" };
    } else {
      return { textColor: "text-blue-600", icon: null };
    }
  };

  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-[700px] 
      bg-white via-indigo-100 to-blue-200
      shadow-2xl border-l border-indigo-300
      z-50 transform transition-transform duration-500 ease-in-out
      flex flex-col ${selected ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* 헤더 */}
      <div className="flex-shrink-0 p-6 flex justify-between items-start">
        <h2 className="text-[30px] font-bold text-gray-900">Project</h2>
        <button
          onClick={onClose}
          className="text-gray-400 text-2xl cursor-pointer hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      {/* 프로젝트 리스트 */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide">
        {projects.map((project, index) => {
          const isActive =
            selected?.label === project.label ||
            hovered?.label === project.label;

          return (
            <div
              key={index}
              onClick={() => onSelect(project)}
              onMouseEnter={() => setHovered(project)}
              onMouseLeave={() => setHovered(null)}
              className={`relative p-5 mb-3 rounded-xl cursor-pointer transition-all duration-400 ${
                isActive
                  ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                  : " border-2 border-blue-500/40 "
              }`}
            >
              <h3
                className={`font-bold text-lg mb-2 ${
                  isActive ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {project.label}
              </h3>

              <p className="text-sm text-gray-600 mb-2">{project.summary}</p>

              {/* 상세 영역 */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isActive ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-3 pt-3 border-t border-blue-200">
                  {/* 이미지 */}
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.label}
                      className="w-full h-auto object-cover rounded-lg mb-3"
                    />
                  )}

                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.details}
                  </p>

                  <div className="mt-4 flex gap-3 flex-wrap">
                    {project.links?.map((link, i) => {
                      const { textColor, icon } = getLinkStyle(link.label);

                      return (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition bg-white hover:bg-gray-100 border border-gray-300 shadow-sm`}
                        >
                          {icon ? (
                            <img
                              src={icon}
                              alt={link.label}
                              className="w-full h-4"
                            />
                          ) : (
                            <FaExternalLinkAlt
                              size={16}
                              className={textColor}
                            />
                          )}
                          <span className={textColor}>{link.label}</span>
                        </a>
                      );
                    })}

                    {/* PDF 자세히 보기 버튼 */}
                    {project.pdfUrl && (
                      <a
                        href={project.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-white hover:bg-gray-100 border border-gray-300 shadow-sm"
                      >
                        <FaExternalLinkAlt
                          size={14}
                          className="text-blue-600"
                        />
                        <span className="text-blue-600">자세히 보기</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="absolute top-5 right-5 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>

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
