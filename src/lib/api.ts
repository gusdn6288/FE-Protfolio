// API 베이스 URL 설정
const API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

// API URL 생성 함수
export const apiUrl = (path: string): string => {
  // 로컬 개발환경 (프록시 사용)
  if (!API_BASE || API_BASE.trim() === "") {
    return path.startsWith("/") ? path : `/${path}`;
  }
  // 배포 환경 (실제 백엔드 도메인 사용)
  const baseUrl = API_BASE.replace(/\/+$/, ""); // 끝의 슬래시 제거
  const apiPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${apiPath}`;
};

// 피드백 관련 타입 정의
export interface Feedback {
  _id: string;
  slug: string;
  name: string;
  message: string;
  createdAt: string;
  clientIp?: string; // clientId → clientIp로 변경
}

export interface FeedbackResponse {
  success: boolean;
  data: Feedback[];
  count: number;
}

export interface CreateFeedbackRequest {
  slug: string;
  name?: string;
  message: string;
  email?: string;
  hp?: string; // honeypot
  // clientId 제거 (IP는 백엔드에서 자동 추출)
}

export interface ApiResponse {
  success: boolean;
  message: string;
  id?: string;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  timestamp: string;
  environment: {
    NODE_ENV: string;
    PORT: number;
    MONGODB_URI: boolean;
    MONGODB_DB: string;
    CORS_ORIGIN: string;
  };
  uptime: number;
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
}

// API 호출 함수들
export class ApiClient {
  // 헬스 체크
  static async health(): Promise<HealthResponse> {
    const response = await fetch(apiUrl("/api/health"));
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }

  // 피드백 목록 조회 (기존 API 구조에 맞춤)
  static async getFeedbacks(slug: string): Promise<Feedback[]> {
    const url = apiUrl(`/api/feedback?slug=${encodeURIComponent(slug)}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch feedbacks: ${response.status}`);
    }

    const data: FeedbackResponse = await response.json();
    return data.data || [];
  }

  // 피드백 생성
  static async createFeedback(
    feedback: CreateFeedbackRequest
  ): Promise<ApiResponse> {
    const response = await fetch(apiUrl("/api/feedback"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create feedback: ${response.status}`
      );
    }

    return response.json();
  }

  // 피드백 삭제 (관리자용)
  static async deleteFeedback(id: string): Promise<ApiResponse> {
    const response = await fetch(apiUrl(`/api/feedback/${id}`), {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete feedback: ${response.status}`
      );
    }

    return response.json();
  }
}

// 개발용 로그 함수
export const logApiInfo = () => {
  console.log("🔧 API Configuration:");
  console.log("  VITE_API_BASE:", API_BASE || "(using proxy)");
  console.log("  Sample URL:", apiUrl("/api/health"));
};
