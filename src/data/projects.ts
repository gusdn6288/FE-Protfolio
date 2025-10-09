export interface Project {
  label: string;
  summary: string;
  details: string;
  image?: string;
  links?: { label: string; url: string }[];
  pdfUrl?: string;
}

export const projects: Project[] = [
  {
    label: "GitPulse",
    summary: "깃허브 활동 분석",
    details:
      "GitPulse는 GitHub 활동 데이터를 시각화하는 웹 애플리케이션입니다.",
    image: "/icons/GitPulse.png",
    links: [
      { label: "GitHub", url: "https://github.com/GitPulse-04" },
      {
        label: "Notion",
        url: "https://wholesale-ogre-01e.notion.site/04-GitPulse-1ec590bd2a14801daf1df499c93a2a37",
      },
      {
        label: "Figma",
        url: "https://www.figma.com/design/kIHFv13Jizhpp3WK92o94R/GitPulse?node-id=0-1&t=iWL5lw33ot27hQLp-1",
      },
      {
        label: "Canva",
        url: "https://www.canva.com/design/DAGn3D7nBTY/-wMvH8T7ZyLk2-Tp2V-KVw/view?utm_content=DAGn3D7nBTY&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=hae932e7b75",
      },
    ],
    pdfUrl: "/pdfs/GitPulse.pdf",
  },
  {
    label: "요금제 챗봇서비스",
    summary: "추천부터 비교까지 AI 챗봇 서비스",
    details: "최적의 요금제를 추천하고 비교할 수 있는 서비스입니다.",
    image: "/icons/UNOA.png",
    links: [
      { label: "GitHub", url: "https://github.com/UNOA-Project" },
      { label: "YouTube", url: "https://youtu.be/N_wU-CFP0rM" },
      {
        label: "Notion",
        url: "https://fern-cesium-085.notion.site/01-UNOA-You-know-NOA-203303b4c814802d9b9ad1fe21f34684?pvs=74",
      },
      {
        label: "Figma",
        url: "https://www.figma.com/design/KBt5oYt5mAsCMx3QqdSzt0/%EC%A2%85%ED%95%A9%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8_1%EC%A1%B0?t=YK1wDd3ggn1E3B6M-0",
      },
      {
        label: "Canva",
        url: "https://www.canva.com/design/DAGp_2T-YvA/76ixWLND28rb758k1Qf4FA/view?utm_content=DAGp_2T-YvA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h50193cef40",
      },
    ],
    pdfUrl: "/pdfs/UNOA.pdf",
  },
  {
    label: "UTONG",
    summary: "주식 기반 데이터 거래 플랫폼",
    details: "데이터 소유자와 구매자를 연결하는 안전한 거래 플랫폼입니다.",
    image: "/icons/UTONG.png",
    links: [
      { label: "GitHub", url: "https://github.com/Ureka-final-project-team-3" },
      { label: "YouTube", url: "https://youtu.be/ObQlTLSia5A" },
      {
        label: "Notion",
        url: "https://boundless-bread-fb1.notion.site/3-3-222a44b1a0d4802ea96ffc2234a79d94",
      },
      {
        label: "Figma",
        url: "https://www.figma.com/design/afmXy5lNQNSDdWj2A35SEe/3%EC%A1%B0-%7C-%EC%8B%A4%EB%B2%84%ED%83%80%EC%9A%B4-3%EB%8B%A8%EC%A7%80?node-id=526-1370",
      },
      {
        label: "Canva",
        url: "https://www.canva.com/design/DAGuyF1YLl4/yQPalMbCx0YxsJxm6ncixw/edit",
      },
    ],
    pdfUrl: "/pdfs/UTONG.pdf",
  },
  {
    label: "이전 포트폴리오",
    summary: "React-vite 기반 웹사이트",
    details: "이전 React로 만든 개인 포트폴리오 웹사이트입니다.",
    image: "/images/portfolio.PNG",
    links: [
      { label: "GitHub", url: "https://github.com/gusdn6288/portfolio" },
      { label: "이동하기", url: "https://portfolio-khw.vercel.app/" },
    ],
  },
];
