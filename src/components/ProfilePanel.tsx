import PanelLayout from "../layouts/PanelLayout";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePanel({ isOpen, onClose }: ProfilePanelProps) {
  return (
    <PanelLayout title="Profile" isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        {/* 상단 프로필 섹션 */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-10">
              안녕하세요, 김현우입니다.
            </h1>
            <p className="text-sm text-gray-600 mb-2">2001. 02. 23</p>
            <p className="text-sm font-bold text-gray-900">
              gusdn-2137@naver.com / 010-2351-2137
            </p>
          </div>
          <div className="flex-shrink-0 ml-6">
            <img
              src="/profile.png"
              alt="프로필"
              className="w-24 h-32 object-cover rounded-sm border border-gray-200"
            />
          </div>
        </div>

        <hr className="border-t-2 border-gray-900 mb-8" />

        {/* 소개 */}
        <section className="mb-8">
          <p className="text-gray-800 leading-relaxed mb-3">
            <strong>
              “여기까지는 누구나 한다, 지금부터 시작이다.” 저는 개발에 어려움이
              생기거나 힘들 때마다 이 말을 마음에 새기며 한 걸음 더 나아가고
              있습니다.
            </strong>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            저는 성장을 위해 꾸준히 블로그 작성으로 학습 내용을 기록하고
            있습니다. 또한 코딩테스트 문제를 풀며 문제 해결 능력을 키우고, 예전
            프로젝트 팀원들과의 스터디를 통해 새로운 기술을 함께 학습하고
            피드백을 나누고 있습니다. 이러한 습관을 통해 지속적으로 학습하고
            성장하는 개발자가 되기 위해 노력하고 있습니다.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            주어진 일을 가치고 끝까지 책임지는 개발자가 되기 위해 꾸준히 배우고
            만들어가고 있습니다.
          </p>
        </section>

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

        {/* 교육 */}
        <section className="mb-6 flex">
          <h3 className="w-1/3 font-bold text-gray-900">교육</h3>
          <div className="text-sm">
            <p className="font-semibold text-gray-800">
              LG유플러스 유레카 2기 프론트엔드 교육(URECA)
            </p>
            <p className="text-sm text-gray-600">2025. 01. 20 - 2025. 08. 12</p>
          </div>
        </section>

        {/* 학력 */}
        <section className="mb-6 flex">
          <h3 className="w-1/3 font-bold text-gray-900">학력</h3>
          <div className="flex gap-12 text-sm">
            <div>
              <p className="font-semibold text-gray-800 ">대전대학교</p>
              <p className="text-gray-600">2019 - 2023 컴퓨터공학과</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">한국교통대학교</p>
              <p className="text-sm text-gray-600">
                2023 - 2025 소프트웨어공학과
              </p>
            </div>
          </div>
        </section>

        {/* 자격증 */}
        <section className="mb-6 flex">
          <h3 className="w-1/3 font-bold text-gray-900">자격증</h3>
          <div className=" text-sm">
            <p className="font-semibold text-gray-800">정보처리기사</p>
            <p className="text-gray-600">2024. 09. 10</p>
          </div>
        </section>

        <hr className="border-gray-200 mb-8" />

        {/* Link */}
        <section className="mb-6 flex gap-6">
          <div className="w-1/2">
            <h3 className="text-lg font-bold text-gray-900 mb-3">GitHub</h3>
            <a
              href="https://github.com/gusdn6288"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              https://github.com/gusdn6288
            </a>
          </div>
          <div className="w-1/2">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Portfolio</h3>
            <a
              href="https://fe-protfolio.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              https://fe-protfolio.vercel.app/
            </a>
          </div>
        </section>
      </div>
    </PanelLayout>
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

  const icons: Record<string, string> = {
    TailwindCSS: "/icons/tailwind.png",
    JavaScript: "/icons/JS.png",
    React: "/icons/React.png",
    TypeScript: "/icons/TS.png",
    Figma: "/icons/Figma.png",
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <img
            src={icons[name]}
            alt={name}
            className="w-6 h-6 object-contain"
          />
        </div>
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>
      <span
        className={`px-3 py-1 rounded text-xs font-medium ${levelColors[level]}`}
      >
        {level}
      </span>
    </div>
  );
}
