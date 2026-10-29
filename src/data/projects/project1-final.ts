import { ProjectDetail } from "@/types/portfolio";

export const project1Final: ProjectDetail = {
  id: "project-1-final",
  title: "미정 (최종 프로젝트)",
  subtitle: "Yocto Linux 기반 Jetson Orin Nano와 다중 STM32(FreeRTOS) 노드를 연동한 CAN/UART 전장 아키텍처",
  period: "2026.10 ~ 2026.11 (진행 중)",
  teamAndRole: "4인 팀 프로젝트 (임베디드 펌웨어 아키텍처, RTOS 태스크 설계 및 통신 인터페이스 담당)",
  contribution: "하위 제어 노드 펌웨어 및 통신 프로토콜 설계 주도",
  thumbnailPrompt: "Jetson Orin Nano와 다중 STM32 노드 간 CAN 및 UART DMA 통신 아키텍처",
  // thumbnailUrl: "/final-project.png",
  thumbnailTheme: "violet",
  thumbnailBadgeLeft: "Yocto Linux & FreeRTOS",
  thumbnailBadgeRight: "CAN Bus / UART DMA",
  thumbnailCenterSub: "Jetson Orin Nano ↔ Multi-Node STM32",
  thumbnailCenterMain: "분산형 전장 제어 & 엣지 통합 관제 시스템",
  thumbnailFooterLeft: "SocketCAN / Device Tree",
  thumbnailFooterRight: "Deterministic RTOS Task",
  githubUrl: "https://github.com/rlagudwls5518",
  reportPdfUrl: "",
  overview: {
    background:
      "",
    goals: [
      "",
    ],
    myContributions: [
      ""
    ],
  },
  techStack: [
    {
      name: "STM32 & FreeRTOS",
      reason: "복합 센서 데이터 처리와 실시간 모터/액추에이터 제어 주기를 엄격히 분리·보장하기 위해 RTOS 도입",
    },
    {
      name: "CAN Bus & UART DMA",
      reason: "전장 환경의 노이즈 내성을 위한 CAN 통신과 대용량 데이터 전송 시 CPU 인터럽트 부하를 줄이는 DMA 활용",
    },
    {
      name: "Jetson Orin Nano (Yocto Linux)",
      reason: "불필요한 패키지를 제거한 경량 커스텀 리눅스 환경에서 상위 관제 수행",
    },
  ],
  designDecisions: [
    {
      id: "p1-arch-1",
      title: "",
      problem:
        "",
      comparison: {
        optionA: {
          name: "",
          desc: "",
        },
        optionB: {
          name: "",
          desc: "",
          isSelected: true,
        },
        whySelected:
          "",
      },
      impact:
        "",
      codeSnippet: ``,
    },
  ],
  troubleshooting: [
    {
      id: "p1-ts-1",
      title: "[트러블슈팅] 미정",
      issue: "미정",
      rootCause: ["미정", "미정"],
      solution: "미정",
      learned: "미정",
    },
  ],
};