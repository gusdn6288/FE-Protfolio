import { FaReact, FaJsSquare, FaFigma } from "react-icons/fa";
import { SiTypescript, SiTailwindcss } from "react-icons/si";
import type { ReactNode } from "react";
interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  return (
    <aside
      className={`fixed top-0 right-0 h-screen w-[700px] 
        bg-white shadow-2xl border-l border-gray-200
        z-50 transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* 헤더 (고정) */}
      <div className="flex-shrink-0 p-8 flex justify-between items-start border-b border-gray-200">
        <h2 className="text-5xl font-light text-gray-300">Profile</h2>
        <button
          onClick={onClose}
          className="text-gray-400 text-2xl hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>

      {/* 스크롤 가능한 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-8">
          {/* 상단 프로필 섹션 */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-10">
                안녕하세요, 김현우입니다.
              </h1>
              <p className="text-sm text-gray-600 mb-2">2001. 02. 23</p>
              <p className="text-sm font-bold text-gray-900">
                gusdn-2137@naver.com / 01023512137
              </p>
            </div>
            <div className="flex-shrink-0 ml-6">
              <div className="relative">
                <img
                  src="/profile.png"
                  alt="프로필"
                  className="w-24 h-32 object-cover rounded-sm border border-gray-200"
                />
              </div>
            </div>
          </div>

          <hr className="border-t-2 border-gray-900 mb-8" />

          {/* 소개 */}
          <section className="mb-8">
            <p className="text-gray-800 leading-relaxed mb-3">
              <strong>
                “여기까지는 누구나 한다, 지금부터 시작이다.” 저는 개발에
                어려움이 생기거나 힘들 때마다 이 말을 마음에 새기며 한 걸음 더
                나아가고 있습니다.
              </strong>
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              저는 성장을 위해 꾸준히 블로그 작성으로 학습 내용을 기록하고
              있습니다. 또한 코딩테스트 문제를 풀며 문제 해결 능력을 키우고,
              예전 프로젝트 팀원들과의 스터디를 통해 새로운 기술을 함께 학습하고
              피드백을 나누고 있습니다. 이러한 습관을 통해 지속적으로 학습하고
              성장하는 개발자가 되기 위해 노력하고 있습니다.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              주어진 일을 가치고 끝까지 책임지는 개발자가 되기 위해 꾸준히
              배우고 만들어가고 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">ㅁㄴㅇㄹ</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              ㅁㄴㅇㄹ
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              ㅁㄴㅇㄹ
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">ㅁㄴㅇㄹ</p>
          </section>

          <hr className="border-gray-200 mb-8" />

          {/* 희망 직무 */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">희망 직무</h3>
              <p className="text-sm text-gray-600">프론트엔드 엔지니어</p>
            </div>
          </section>

          {/* 주요 기술 */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">주요 기술</h3>
            <div className="space-y-3">
              <SkillItem name="TailwindCSS" level="중" />
              <SkillItem name="JavaScript" level="상" />
              <SkillItem name="React" level="상" />
              <SkillItem name="TypeScript" level="중" />
              <SkillItem name="Figma" level="중" />
            </div>
          </section>

          <hr className="border-gray-200 mb-8" />

          {/* 경력 */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">경력</h3>
            <div>
              <p className="font-semibold text-gray-800">
                LG유플러스 유레카 2기 프론트엔드 교육(URECA)
              </p>
              <p className="text-sm text-gray-600">
                2025. 01. 20 - 2025. 08. 12
              </p>
            </div>
          </section>

          {/* 학력 */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">학력</h3>
            <div className="flex justify-between gap-6">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">대전대학교</p>
                <p className="text-sm text-gray-600">
                  2019 - 2023 컴퓨터공학과
                </p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">한국교통대학교</p>
                <p className="text-sm text-gray-600">
                  2023 - 2025 소프트웨어공학과
                </p>
              </div>
            </div>
          </section>

          {/* 자격증 */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">자격증</h3>
            <div>
              <p className="font-semibold text-gray-800">정보처리기사</p>
              <p className="text-sm text-gray-600">2024. 09. 10</p>
            </div>
          </section>

          <hr className="border-gray-200 mb-8" />

          {/* Link */}
          <section className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Link</h3>
            <a
              href="https://github.com/gusdn6288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              https://github.com/gusdn6288
            </a>
          </section>

          {/* Portfolio */}
          <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h3>
            <a
              href="https://portfolio-gamma-peach-44.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              https://portfolio-gamma-peach-44.vercel.app/
            </a>
          </section>
        </div>
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

interface SkillItemProps {
  name: string;
  level: string;
}

function SkillItem({ name, level }: SkillItemProps) {
  const levelColors: Record<string, string> = {
    하: "bg-gray-200 text-gray-600",
    중: "bg-blue-500 text-white",
    상: "bg-blue-600 text-white",
  };

  const icons: Record<string, ReactNode> = {
    TailwindCSS: <SiTailwindcss className="w-5 h-5 text-cyan-600" />,
    JavaScript: <FaJsSquare className="w-5 h-5 text-yellow-500" />,
    React: <FaReact className="w-5 h-5 text-blue-500" />,
    TypeScript: <SiTypescript className="w-5 h-5 text-blue-600" />,
    Figma: <FaFigma className="w-5 h-5 text-purple-500" />,
  };

  return (
    <div className="flex items-center justify-between">
      {/* 왼쪽 아이콘 + 이름 */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          {icons[name] ?? "?"}
        </div>
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>

      {/* 오른쪽 레벨 */}
      <div className="flex space-x-1">
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${
            level === "하" ? levelColors["하"] : "bg-gray-200 text-gray-600"
          }`}
        >
          하
        </span>
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${
            level === "중" ? levelColors["중"] : "bg-gray-200 text-gray-600"
          }`}
        >
          중
        </span>
        <span
          className={`px-3 py-1 rounded text-xs font-medium ${
            level === "상" ? levelColors["상"] : "bg-gray-200 text-gray-600"
          }`}
        >
          상
        </span>
      </div>
    </div>
  );
}
