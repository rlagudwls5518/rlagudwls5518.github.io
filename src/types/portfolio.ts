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