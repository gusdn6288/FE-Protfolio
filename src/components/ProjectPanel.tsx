import { useState } from "react";
import PanelLayout from "../layouts/PanelLayout";
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

  // 플랫폼별 스타일 매핑
  const getLinkStyle = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("github"))
      return { textColor: "text-[#24292e]", icon: "/icons/GitHub.png" };
    if (lowerLabel.includes("youtube"))
      return { textColor: "text-[#ff0000]", icon: "/icons/youtube.png" };
    if (lowerLabel.includes("notion"))
      return { textColor: "text-[#000000]", icon: "/icons/notion.png" };
    if (lowerLabel.includes("figma"))
      return { textColor: "text-[#a259ff]", icon: "/icons/Figma.png" };
    if (lowerLabel.includes("canva"))
      return { textColor: "text-[#00c4cc]", icon: "/icons/canva.jpg" };
    return { textColor: "text-blue-600", icon: null };
  };

  return (
    <PanelLayout title="Project" isOpen={!!selected} onClose={onClose}>
      <div className="px-6 pb-6">
        {projects.map((project) => {
          const isActive =
            selected?.label === project.label ||
            hovered?.label === project.label;

          return (
            <div
              key={project.label}
              onClick={() => onSelect(project)}
              onMouseEnter={() => setHovered(project)}
              onMouseLeave={() => setHovered(null)}
              className={`relative p-5 mb-3 rounded-xl cursor-pointer transition-all duration-400 ${
                isActive
                  ? "bg-blue-50 border-2 border-blue-500 shadow-md"
                  : "border-2 border-blue-500/40"
              }`}
            >
              {/* 프로젝트 제목 */}
              <h3
                className={`font-bold text-lg mb-2 ${
                  isActive ? "text-blue-700" : "text-gray-900"
                }`}
              >
                {project.label}
              </h3>

              <p className="text-sm text-gray-600 mb-2 ">{project.summary}</p>

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

                  {/* 상세 설명 */}
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {project.details}
                  </p>

                  {/* 링크들 */}
                  <div className="mt-4 flex gap-3 flex-wrap">
                    {project.links?.map((link) => {
                      const { textColor, icon } = getLinkStyle(link.label);
                      return (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition bg-white hover:bg-gray-100 border border-gray-300 shadow-sm"
                        >
                          {icon ? (
                            <img
                              src={icon}
                              alt={link.label}
                              className="w-4 h-4 object-contain"
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

                    {/* PDF 버튼 */}
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

              {/* 활성화 표시점 */}
              {isActive && (
                <div className="absolute top-5 right-5 w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
          );
        })}
      </div>
    </PanelLayout>
  );
}
