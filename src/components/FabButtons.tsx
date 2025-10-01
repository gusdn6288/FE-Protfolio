import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import EmailModal from "./EmailModal";
import ChatModal from "./ChatModal";

const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string,
};

export default function FabButtons() {
  const [open, setOpen] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }, []);

  return (
    <div className="absolute left-5 bottom-10 flex flex-col items-center gap-4 z-50">
      {/* 펼쳐질 버튼들 */}
      {open && (
        <div className="flex flex-col gap-4">
          {/* Message → 채팅 모달 열기 */}
          <button
            onClick={() => setShowChatModal(true)}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-200 animate-slideUp cursor-pointer"
          >
            <img src="/icons/message.png" alt="Message" className="w-6 h-6" />
          </button>

          {/* Email → 이메일 모달 */}
          <button
            onClick={() => setShowEmailModal(true)}
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-200 animate-slideUp cursor-pointer"
          >
            <img src="/icons/email.png" alt="Email" className="w-6 h-6" />
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/gusdn6288"
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:bg-gray-200 animate-slideUp cursor-pointer"
          >
            <img src="/icons/GitHub.png" alt="GitHub" className="w-6 h-6" />
          </a>
        </div>
      )}

      {/* 메인 FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-white text-black text-2xl flex items-center justify-center shadow-xl hover:bg-gray-200 transition-transform cursor-pointer"
      >
        {open ? "×" : "≡"}
      </button>

      {/* 이메일 모달 */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        serviceId={EMAILJS_CONFIG.serviceId}
        templateId={EMAILJS_CONFIG.templateId}
        toEmail="gusdn-2137@naver.com"
      />

      {/* 채팅 모달 */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        slug="/feedback"
      />
    </div>
  );
}
