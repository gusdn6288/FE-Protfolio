import { useEffect, useState } from "react";
import { projects } from "../data/projects";
import ProjectModal from "./ProjectModal";
import ChatModal from "./ChatModal";
import EmailModal from "./EmailModal";
import { motion } from "motion/react";
import type { Variants } from "motion/react";

export default function HomeScreen() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // 모달 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  // ✅ 처음 나타날 때만 애니메이션을 실행하기 위한 플래그
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    // 첫 페인트 다음 프레임에 트리거 → 레이아웃 안정 후 애니메이션 시작
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // ─────────────────────────────────────────────────────────
  // 애니메이션 설정 (타입 안전)
  // ─────────────────────────────────────────────────────────
  const SPRING = {
    type: "spring" as const,
    stiffness: 650,
    damping: 30,
    mass: 1,
  };

  // ✅ 컨테이너와 자식이 동시에 실행
  const gridVariants = {
    hidden: { opacity: 0, y: -12, scale: 1.3, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        ...SPRING,
        // when: "beforeChildren",  // ❌ 제거
        // staggerChildren: 0,      // (동시 실행이면 생략해도 됨)
        // delayChildren: 0,        // (동시 실행이면 생략해도 됨)
      },
    },
  } satisfies Variants;

  const iconVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.9, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: SPRING, // 부모와 동일 스프링 → 타이밍 매칭
    },
  } satisfies Variants;
  const dockVariants = {
    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: SPRING,
    },
  } satisfies Variants;

  const dockItemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: SPRING,
    },
  } satisfies Variants;

  // ─────────────────────────────────────────────────────────
  // 이벤트 핸들러
  // ─────────────────────────────────────────────────────────
  const handleAppClick = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsAnimating(true);
    requestAnimationFrame(() => setSelectedProject(index));
  };

  const handleClose = () => {
    setSelectedProject(null);
    setTimeout(() => {
      setButtonRect(null);
      setIsAnimating(false);
    }, 500);
  };

  const isOpen = selectedProject !== null;
  const currentProject =
    selectedProject !== null ? projects[selectedProject] : null;

  // ─────────────────────────────────────────────────────────
  // 렌더
  // ─────────────────────────────────────────────────────────
  return (
    <div className="relative w-full h-full flex items-center justify-center text-white select-none">
      {/* 📱 중앙 컨테이너 */}
      <div className="w-[80%] h-[55%] flex flex-col items-center justify-between py-10">
        {/* 🔹 프로젝트(앱) 아이콘 그리드 — 등장 시 스태거 */}
        <motion.div
          className="grid grid-cols-4 gap-10"
          variants={gridVariants}
          initial="hidden"
          animate={entered ? "show" : "hidden"} // 마운트 후 트리거
        >
          {projects.map((proj, i) => {
            const isSelected = isAnimating && selectedProject === i;
            return (
              <motion.button
                key={proj.label}
                onClick={(e) => handleAppClick(i, e)}
                variants={iconVariants}
                animate={isSelected ? { opacity: 0, scale: 0.9, y: 0 } : "show"}
                transition={
                  isSelected ? { duration: 0.18, ease: "easeOut" } : undefined
                }
                className="w-36 h-36 rounded-2xl border border-white/20 bg-black/70
                   flex flex-col items-center justify-center
                   will-change-transform will-change-opacity
                   hover:bg-black/50 transition-colors"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <img
                  src={proj.image}
                  alt={proj.label}
                  className="w-12 h-12 mb-3 object-contain"
                  draggable={false}
                />
                <span className="text-sm font-medium">{proj.label}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* 🔹 하단: 연락 패널도 첫 등장 애니메이션 */}
        <motion.div
          className="w-[60%] h-30 rounded-3xl border border-white/20 bg-black/70 backdrop-blur-md
                     flex items-center justify-around px-2"
          variants={dockVariants}
          initial="hidden"
          animate={entered ? "show" : "hidden"} // ✅ 함께 트리거
        >
          {[
            {
              name: "Chat",
              icon: "/icons/message.png",
              onClick: () => setIsChatOpen(true),
            },
            {
              name: "Email",
              icon: "/icons/email.png",
              onClick: () => setIsEmailOpen(true),
            },
            {
              name: "GitHub",
              icon: "/icons/GitHub.png",
              link: "https://github.com/gusdn6288",
            },
            {
              name: "Resume",
              icon: "/icons/user.png",
              link: "/pdfs/Profile.pdf",
            },
          ].map((app) =>
            app.link ? (
              <motion.a
                key={app.name}
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={dockItemVariants}
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center
                           hover:bg-white/20 transition-colors"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-16 h-16 object-contain"
                  draggable={false}
                />
              </motion.a>
            ) : (
              <motion.button
                key={app.name}
                onClick={app.onClick}
                variants={dockItemVariants}
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center
                           hover:bg-white/20 transition-colors cursor-pointer"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-16 h-16 object-contain"
                  draggable={false}
                />
              </motion.button>
            )
          )}
        </motion.div>
      </div>

      {/* 🔹 프로젝트 모달 */}
      <ProjectModal
        project={currentProject}
        buttonRect={buttonRect}
        isOpen={isOpen}
        isAnimating={isAnimating}
        onClose={handleClose}
      />

      {/* 💬 카카오톡 스타일 ChatModal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        slug="home-feedback"
      />

      {/* 📧 이메일 전송 모달 */}
      <EmailModal
        isOpen={isEmailOpen}
        onClose={() => setIsEmailOpen(false)}
        serviceId={import.meta.env.VITE_EMAIL_SERVICE_ID!}
        templateId={import.meta.env.VITE_EMAIL_TEMPLATE_ID!}
        toEmail="gusdn-2137@naver.com"
      />
    </div>
  );
}
