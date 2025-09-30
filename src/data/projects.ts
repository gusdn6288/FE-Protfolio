import type { Project } from "../components/EarthModel";

export const projects: Project[] = [
  {
    lat: 37.5665,
    lon: 126.978,
    label: "GitPulse",
    summary: "깃허브 활동 분석",
    details:
      "GitPulse는 GitHub 활동 데이터를 시각화하는 웹 애플리케이션입니다.",
    image: "/images/GitPulse.png",
    links: [{ label: "GitHub", url: "https://github.com/GitPulse-04" }],
    pdfUrl: "/pdfs/GitPulse.pdf",
  },
  {
    lat: 37.5665,
    lon: 126.978,
    label: "요금제 챗봇서비스",
    summary: "추천부터 비교까지 AI 챗봇 서비스",
    details:
      "통신 패턴을 분석하여 최적의 요금제를 추천하고 비교할 수 있는 서비스입니다.",
    image: "/images/UNOA.jpg",
    links: [
      {
        label: "GitHub",
        url: "https://github.com/UNOA-Project",
      },
      { label: "YouTube", url: "https://youtube.com/chatbot-demo" },
    ],
    pdfUrl: "/pdfs/UNOA.pdf",
  },
  {
    lat: 37.5665,
    lon: 126.978,
    label: "UTONG",
    summary: "주식 기반 데이터 거래 플랫폼",
    details: "데이터 소유자와 구매자를 연결하는 안전한 거래 플랫폼입니다.",
    image: "/images/UTONG.png",
    links: [
      { label: "GitHub", url: "https://github.com/Ureka-final-project-team-3" },
      { label: "YouTube", url: "https://youtube.com/utong-demo" },
    ],
    pdfUrl: "/pdfs/UTONG.pdf",
  },
  {
    lat: 37.5665,
    lon: 126.978,
    label: "이전 포트폴리오",
    summary: "React-vite 기반 웹사이트",
    details: "이전 React로 만든 개인 포트폴리오 웹사이트입니다.",
    image: "/images/portfolio.PNG",
    links: [{ label: "GitHub", url: "https://github.com/gusdn6288/portfolio" }],
    pdfUrl: "https://portfolio-khw.vercel.app/", // ✅ PDF 연결
  },
];
