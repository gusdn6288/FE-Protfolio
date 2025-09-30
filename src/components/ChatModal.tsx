import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { ApiClient, type Feedback } from "../lib/api";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
}

// Socket.IO 연결
const API_BASE = import.meta.env.VITE_API_BASE || "";
let socket: Socket | null = null;

const getSocket = () => {
  if (!socket) {
    socket = io(API_BASE || window.location.origin, {
      transports: ["websocket", "polling"],
    });
  }
  return socket;
};

export default function ChatModal({ isOpen, onClose, slug }: ChatModalProps) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nickname, setNickname] = useState("익명");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [myIp, setMyIp] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const loadFeedbacks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiClient.getFeedbacks(slug);
      const sortedData = data.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setItems(sortedData);
    } catch (err) {
      console.error("피드백 로드 실패:", err);
      setError(
        err instanceof Error ? err.message : "데이터를 불러올 수 없습니다"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const handleSend = async () => {
    if (!message.trim() || sending || !nickname.trim()) return;

    try {
      setSending(true);
      const socket = getSocket();

      socket.emit("chat:send", {
        slug,
        name: nickname.trim(),
        message: message.trim(),
      });

      setMessage("");
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      alert(err instanceof Error ? err.message : "메시지 전송 실패");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleNameEdit = () => {
    setIsEditingName(!isEditingName);
    if (!isEditingName) {
      setTimeout(() => nameInputRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    loadFeedbacks();
    const socket = getSocket();

    socket.on("connect", () => console.log("Socket connected"));

    const handleNewMessage = (newMsg: Feedback) => {
      if (newMsg.slug === slug) {
        setItems((prev) => [...prev, newMsg]);
        if (!myIp && newMsg.name === nickname) {
          setMyIp(newMsg.clientIp || "");
        }
      }
    };

    socket.on("chat:newMessage", handleNewMessage);

    return () => {
      socket.off("chat:newMessage", handleNewMessage);
      socket.off("connect");
    };
  }, [isOpen, slug, loadFeedbacks]);

  useEffect(() => {
    if (items.length > 0 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg h-[700px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        {/* 헤더 */}
        <div className="relative px-6 py-5 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Feedback</h2>

                {/* 닉네임 편집 */}
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="닉네임 입력"
                      className="bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                      maxLength={20}
                    />
                    <button
                      onClick={toggleNameEdit}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                    >
                      완료
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleNameEdit}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700 transition-colors mt-1"
                  >
                    <span>{nickname || "닉네임 설정"}</span>
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-all w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-600 text-sm mt-4">
                메시지 불러오는 중...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-600 mb-4 text-sm">{error}</p>
              <button
                onClick={loadFeedbacks}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all shadow-lg"
              >
                다시 시도
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 text-sm">첫 메시지를 남겨보세요</p>
            </div>
          ) : (
            items.map((item, index) => {
              const isMine = myIp && item.clientIp === myIp;
              return (
                <div
                  key={item._id || index}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } animate-slideIn`}
                >
                  <div
                    className={`group max-w-[80%] ${
                      isMine ? "items-end" : "items-start"
                    } flex flex-col gap-1`}
                  >
                    {!isMine && (
                      <span className="text-xs font-semibold text-gray-700 px-1">
                        {item.name}
                      </span>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isMine
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md border border-gray-200"
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {item.message}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-1 ${
                        isMine ? "text-blue-600" : "text-gray-500"
                      }`}
                    >
                      {new Date(item.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 입력 영역 */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !nickname.trim()
                    ? "닉네임을 먼저 설정하세요"
                    : "메시지를 입력하세요..."
                }
                className="w-full resize-none rounded-2xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 px-4 py-3 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all max-h-32"
                rows={1}
                disabled={sending || !nickname.trim()}
              />
              {message.trim() && (
                <div className="absolute right-4 bottom-3 text-xs text-gray-400">
                  {message.length}
                </div>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim() || sending || !nickname.trim()}
              className="h-12 w-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/50 disabled:shadow-none group disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
