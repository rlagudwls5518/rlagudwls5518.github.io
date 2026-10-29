export interface TechStackItem {
  name: string;
  reason: string;
}

export interface DesignDecision {
  id: string;
  title: string;
  problem: string;
  comparison: {
    optionA: { name: string; desc: string };
    optionB: { name: string; desc: string; isSelected: boolean };
    whySelected: string;
  };
  impact: string;
  codeSnippet?: string;
}

export interface TroubleshootingItem {
  id: string;
  title: string;
  issue: string;
  rootCause: string[];
  imageUrl?: string;      // ★ 추가 1: 단일 트러블슈팅 검증 이미지 경로 (예: "/jojimara/jojimara_osil.jpg")
  imageCaption?: string;  // ★ 추가 2: 이미지 하단 설명 캡션
  images?: { url: string; caption?: string }[]; // ★ 추가 3: 사진을 여러 장 넣고 싶을 때 사용 (선택)
  logOrCode?: string;
  solution: string;
  learned: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  teamAndRole: string;
  contribution: string;
  thumbnailPrompt: string;
  thumbnailUrl?: string;
  thumbnailTheme?: "indigo" | "emerald" | "amber" | "rose" | "cyan" | "violet";
  thumbnailBadgeLeft?: string;
  thumbnailBadgeRight?: string;
  thumbnailCenterSub?: string;
  thumbnailCenterMain?: string;
  thumbnailFooterLeft?: string;
  thumbnailFooterRight?: string;
  githubUrl: string;
  demoUrl?: string;
  reportPdfUrl?: string;
  overview: {
    background: string;
    goals: string[];
    myContributions: string[];
  };
  techStack: TechStackItem[];
  designDecisions: DesignDecision[];
  troubleshooting: TroubleshootingItem[];
}

export interface SkillCategory {
  category: "Embedded / Firmware" | "System / Edge & UI" | "Hardware & Tools";
  iconName: "cpu" | "code" | "wrench";
  items: { name: string; level: "Advanced" | "Intermediate" | "Basic"; desc: string }[];
}