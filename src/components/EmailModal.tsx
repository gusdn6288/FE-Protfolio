import React, { useRef, useState } from "react";
import { Mail, X, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export type EmailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  templateId: string;
  toEmail?: string;
  onSuccess?: () => void;
  /** 최소 전송 애니메이션 시간 (ms) */
  minSendingMs?: number;
  /** 성공 애니메이션 노출 시간 (ms) — 기본 3500 (3.5초) */
  successDurationMs?: number;
};

type Phase = "form" | "sending" | "success";

export default function EmailModal({
  isOpen,
  onClose,
  serviceId,
  templateId,
  toEmail = "gusdn-2137@naver.com",
  onSuccess,
  minSendingMs = 2000, // ✅ 전송 애니메이션 최소 2초
  successDurationMs = 1900, // ✅ 성공 애니메이션 3.5초 (원하면 3000~4000으로 조정)
}: EmailModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const sendStartRef = useRef<number | null>(null);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsSending(true);
    setPhase("sending");
    sendStartRef.current = Date.now();

    try {
      const emailParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: toEmail,
      };

      await emailjs.send(serviceId, templateId, emailParams);

      const elapsed = Date.now() - (sendStartRef.current ?? Date.now());
      const wait = Math.max(minSendingMs - elapsed, 0);

      window.setTimeout(() => {
        setPhase("success");
        setIsSending(false);
        setFormData({ name: "", email: "", subject: "", message: "" });

        window.setTimeout(() => {
          onSuccess?.();
          onClose();
          setPhase("form");
        }, successDurationMs); // ✅ 성공 애니메이션 노출 시간
      }, wait);
    } catch (error) {
      console.error("메일 전송 실패:", error);
      setIsSending(false);
      setPhase("form");
      alert("메일 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-gray-900">
        {/* 닫기 버튼: 전송/성공 단계에선 비활성 */}
        {!isSending && phase !== "success" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="모달 닫기"
          >
            <X size={20} />
          </button>
        )}

        {/* 폼 */}
        {phase === "form" && (
          <>
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  메일 보내기
                </h2>
              </div>
              <p className="text-sm text-gray-500">
                궁금한 점이나 문의사항을 보내주세요.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="이름을 입력하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="메일 제목을 입력하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="메시지를 입력하세요..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      메일 보내기
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* 전송 애니메이션 (최소 minSendingMs) */}
        {phase === "sending" && (
          <div className="flex flex-col items-center justify-center py-8">
            <DotLottieReact
              src="https://lottie.host/9d6d76bf-8655-415d-a746-fcb0c9aaaee6/V5NXoGZskp.lottie"
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
            <p className="mt-3 text-lg text-gray-600">
              메일을 전송 중입니다...
            </p>
          </div>
        )}

        {/* 성공 애니메이션 (successDurationMs 동안 표시) */}
        {phase === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <DotLottieReact
              src="https://lottie.host/18a3d584-2541-480e-aa78-7bdd2e6b0083/maBoqO8FV2.lottie"
              loop
              autoplay
              style={{ width: 200, height: 200 }}
            />
            <p className="mt-3 text-lg font-medium text-gray-800">
              메일이 성공적으로 전송되었습니다!
            </p>
            <p className="text-xs text-gray-500">자동으로 닫혀요</p>
          </div>
        )}
      </div>
    </div>
  );
}
