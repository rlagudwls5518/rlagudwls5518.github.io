"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Code2,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Layers,
  Terminal,
  FileDown,
  ChevronDown,
} from "lucide-react";

// ============================================================================
// 1. TypeScript 인터페이스 정의 (Data Structure)
// ============================================================================

export interface TechStackItem {
  name: string;
  reason: string; // 기술 선정 이유 (툴팁 및 상세 태그 표기용)
}

export interface DesignDecision {
  id: string;
  title: string;
  problem: string; // 구현 전 마주했던 구조적 한계 또는 선택지
  comparison: {
    optionA: { name: string; desc: string };
    optionB: { name: string; desc: string; isSelected: boolean };
    whySelected: string;
  };
  impact: string; // 해당 설계가 유지보수성/성능에 미친 긍정적 영향
  codeSnippet?: string;
}

export interface TroubleshootingItem {
  id: string;
  title: string;
  issue: string; // 증상 (실제 겪었던 버그 또는 병목)
  rootCause: string[]; // 원인 분석 (로그, 오실로스코프, 프로파일링 등)
  logOrCode?: string; // 커널 로그 또는 문제/해결 코드
  solution: string; // 해결 과정 및 최종 적용 방법
  learned: string; // 수치 개선 및 인사이트
}

export interface ProjectDetail {
  id: string;
  title: string;
  subtitle: string;
  period: string;
  teamAndRole: string;
  contribution: string;
  thumbnailPrompt: string; // 실제 이미지 경로(url) 대체용 설명 또는 URL
  githubUrl: string;
  demoUrl?: string;
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
  category: "Embedded / Firmware" | "Frontend / Edge" | "Hardware & Tools";
  iconName: "cpu" | "code" | "wrench";
  items: { name: string; level: "Advanced" | "Intermediate" | "Basic"; desc: string }[];
}

// ============================================================================
// 2. 포트폴리오 상수 데이터 (상단 분리 - 쉽게 수정/추가 가능)
// ============================================================================

const DEVELOPER_INFO = {
  name: "김형진",
  role: "Embedded Firmware & Edge System Developer",
  oneLiner:
    "하드웨어 레지스터 레벨의 정밀한 제어부터 Edge AI 시스템과의 실시간 통신 아키텍처까지, 안정적인 시스템을 설계하는 지원자입니다",
  tags: [
    "#STM32_레지스터_직접제어",
    "#논블로킹_펌웨어_아키텍처",
    "#오실로스코프_커널로그_디버깅",
    "#UART_프로토콜_설계",
  ],
  email: "rlagudwls5518@example.com",
  github: "https://github.com/rlagudwls5518",
  linkedin: "https://linkedin.com",
  resumeUrl: "#resume-download",
};

const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Embedded / Firmware",
    iconName: "cpu",
    items: [
      {
        name: "C / Embedded C",
        level: "Advanced",
        desc: "구조체 캡슐화, 함수 포인터 기반 이벤트 디스패처, 비트마스크 연산 활용",
      },
      {
        name: "STM32 (HAL / LL / Register)",
        level: "Advanced",
        desc: "TIM(ARR/CCR) 레지스터 직접 제어를 통한 PWM 생성, USART 인터럽트 및 1ms 시스템 틱 설계",
      },
      {
        name: "UART / Serial Protocol",
        level: "Advanced",
        desc: "이기종 보드 간 프레임 파싱, ACK/NACK 피드백 규격 및 에러 핸들링 엔진 구현",
      },
    ],
  },
  {
    category: "Frontend / Edge",
    iconName: "code",
    items: [
      {
        name: "Jetson Orin Nano (Linux/Ubuntu)",
        level: "Intermediate",
        desc: "JetPack 환경 세팅, 시리얼 인터페이스 연동 및 커널 로그(dmesg/journalctl) 디버깅",
      },
      {
        name: "React / Next.js & TypeScript",
        level: "Intermediate",
        desc: "관제 대시보드 및 웹 접근성(a11y) 준수 모던 UI 컴포넌트 구축",
      },
    ],
  },
  {
    category: "Hardware & Tools",
    iconName: "wrench",
    items: [
      {
        name: "Circuit Design (회로 설계)",
        level: "Advanced",
        desc: "MCU 주변 회로, DC 모터 드라이버, 피에조 부저, 다채널 LED 인터페이스 설계",
      },
      {
        name: "Oscilloscope (파형 분석)",
        level: "Advanced",
        desc: "Tx/Rx 통신 신호 무결성 검증, 주파수 및 듀티 사이클 측정 기반 하드웨어 디버깅",
      },
      {
        name: "Git / GitHub",
        level: "Intermediate",
        desc: "이기종 파트(AI 비전, 엣지 앱, 펌웨어) 간 협업 및 인터페이스 정의서 버전 관리",
      },
    ],
  },
];

const PROJECTS_DATA: ProjectDetail[] = [
  {
    id: "project-1", // 프로젝트마다 겹치지 않는 고유 ID (예: "smart-factory-v1")
    title: "새 프로젝트 제목",
    subtitle: "프로젝트를 한 줄로 요약하는 서브 타이틀",
    period: "2026.10.01 ~ 2026.10.20",
    teamAndRole: "N인 팀 프로젝트 (본인이 맡은 핵심 역할)",
    contribution: "담당 파트 100% (전체 기여도 N%)",
    thumbnailPrompt: "썸네일 영역 대체 텍스트 설명",
    githubUrl: "https://github.com/rlagudwls5518/저장소이름",
    

    overview: {
      background:
        "이 프로젝트를 시작하게 된 배경과 어떤 시스템인지 2~3문장으로 적어주세요.",
      goals: [
        "핵심 목표 1",
        "핵심 목표 2",
        "핵심 목표 3",
      ],
      myContributions: [
        "내가 직접 구현한 핵심 기능 1",
        "내가 직접 구현한 핵심 기능 2",
        "내가 직접 구현한 핵심 기능 3",
      ],
    },

    techStack: [
      {
        name: "사용 기술 1 (예: FreeRTOS / STM32)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
      {
        name: "사용 기술 2 (예: CAN / SPI 통신)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
    ],

    designDecisions: [
      {
        id: "p2-arch-1",
        title: "설계 고민 제목 (예: 폴링 대신 인터럽트/DMA 링버퍼 도입)",
        problem: "구현 전 마주했던 구조적 한계나 고민했던 지점",
        comparison: {
          optionA: {
            name: "방식 A (기존/단순한 방식)",
            desc: "방식 A의 특징과 한계점",
          },
          optionB: {
            name: "방식 B (내가 최종 선택한 아키텍처)",
            desc: "방식 B의 구조와 동작 방식",
            isSelected: true,
          },
          whySelected: "방식 A 대신 방식 B를 채택한 결정적인 기술적 이유",
        },
        impact: "이 설계를 통해 얻은 유지보수성/성능/협업 측면의 긍정적 결과",
        codeSnippet: `// 핵심 설계 코드 스니펫 (없으면 이 줄을 지우셔도 됩니다)
void Example_Init(void) {
    // 코드 작성
}`,
      },
    ],

    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅 1] 해결한 문제 제목",
        issue: "발생했던 버그, 통신 오류, 또는 성능 병목 현상 설명",
        rootCause: [
          "원인 분석 1단계 (예: 로그/레지스터 확인)",
          "원인 분석 2단계 (예: 오실로스코프/디버거 측정 결과)",
          "파악한 근본 원인 요약",
        ],
        logOrCode: `// 문제 상황 로그 또는 해결 전후 비교 코드 (없으면 지우셔도 됩니다)`,
        solution: "문제를 해결하기 위해 적용한 구체적인 방법",
        learned: "해결 후 개선된 수치(예: 응답속도 개선, 에러율 0%) 및 배운 점",
      },
    ],
  }, // 최종 프로젝트
  {
    id: "project-2", // 프로젝트마다 겹치지 않는 고유 ID (예: "smart-factory-v1")
    title: "새 프로젝트 제목",
    subtitle: "프로젝트를 한 줄로 요약하는 서브 타이틀",
    period: "2026.10.01 ~ 2026.10.20",
    teamAndRole: "N인 팀 프로젝트 (본인이 맡은 핵심 역할)",
    contribution: "담당 파트 100% (전체 기여도 N%)",
    thumbnailPrompt: "썸네일 영역 대체 텍스트 설명",
    githubUrl: "https://github.com/rlagudwls5518/저장소이름",
    

    overview: {
      background:
        "이 프로젝트를 시작하게 된 배경과 어떤 시스템인지 2~3문장으로 적어주세요.",
      goals: [
        "핵심 목표 1",
        "핵심 목표 2",
        "핵심 목표 3",
      ],
      myContributions: [
        "내가 직접 구현한 핵심 기능 1",
        "내가 직접 구현한 핵심 기능 2",
        "내가 직접 구현한 핵심 기능 3",
      ],
    },

    techStack: [
      {
        name: "사용 기술 1 (예: FreeRTOS / STM32)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
      {
        name: "사용 기술 2 (예: CAN / SPI 통신)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
    ],

    designDecisions: [
      {
        id: "p2-arch-1",
        title: "설계 고민 제목 (예: 폴링 대신 인터럽트/DMA 링버퍼 도입)",
        problem: "구현 전 마주했던 구조적 한계나 고민했던 지점",
        comparison: {
          optionA: {
            name: "방식 A (기존/단순한 방식)",
            desc: "방식 A의 특징과 한계점",
          },
          optionB: {
            name: "방식 B (내가 최종 선택한 아키텍처)",
            desc: "방식 B의 구조와 동작 방식",
            isSelected: true,
          },
          whySelected: "방식 A 대신 방식 B를 채택한 결정적인 기술적 이유",
        },
        impact: "이 설계를 통해 얻은 유지보수성/성능/협업 측면의 긍정적 결과",
        codeSnippet: `// 핵심 설계 코드 스니펫 (없으면 이 줄을 지우셔도 됩니다)
void Example_Init(void) {
    // 코드 작성
}`,
      },
    ],

    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅 1] 해결한 문제 제목",
        issue: "발생했던 버그, 통신 오류, 또는 성능 병목 현상 설명",
        rootCause: [
          "원인 분석 1단계 (예: 로그/레지스터 확인)",
          "원인 분석 2단계 (예: 오실로스코프/디버거 측정 결과)",
          "파악한 근본 원인 요약",
        ],
        logOrCode: `// 문제 상황 로그 또는 해결 전후 비교 코드 (없으면 지우셔도 됩니다)`,
        solution: "문제를 해결하기 위해 적용한 구체적인 방법",
        learned: "해결 후 개선된 수치(예: 응답속도 개선, 에러율 0%) 및 배운 점",
      },
    ],
  }, // FPGA 공조기 구현  
  {
    id: "project-3", // 프로젝트마다 겹치지 않는 고유 ID (예: "smart-factory-v1")
    title: "새 프로젝트 제목",
    subtitle: "프로젝트를 한 줄로 요약하는 서브 타이틀",
    period: "2026.10.01 ~ 2026.10.20",
    teamAndRole: "N인 팀 프로젝트 (본인이 맡은 핵심 역할)",
    contribution: "담당 파트 100% (전체 기여도 N%)",
    thumbnailPrompt: "썸네일 영역 대체 텍스트 설명",
    githubUrl: "https://github.com/rlagudwls5518/저장소이름",
    

    overview: {
      background:
        "이 프로젝트를 시작하게 된 배경과 어떤 시스템인지 2~3문장으로 적어주세요.",
      goals: [
        "핵심 목표 1",
        "핵심 목표 2",
        "핵심 목표 3",
      ],
      myContributions: [
        "내가 직접 구현한 핵심 기능 1",
        "내가 직접 구현한 핵심 기능 2",
        "내가 직접 구현한 핵심 기능 3",
      ],
    },

    techStack: [
      {
        name: "사용 기술 1 (예: FreeRTOS / STM32)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
      {
        name: "사용 기술 2 (예: CAN / SPI 통신)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
    ],

    designDecisions: [
      {
        id: "p2-arch-1",
        title: "설계 고민 제목 (예: 폴링 대신 인터럽트/DMA 링버퍼 도입)",
        problem: "구현 전 마주했던 구조적 한계나 고민했던 지점",
        comparison: {
          optionA: {
            name: "방식 A (기존/단순한 방식)",
            desc: "방식 A의 특징과 한계점",
          },
          optionB: {
            name: "방식 B (내가 최종 선택한 아키텍처)",
            desc: "방식 B의 구조와 동작 방식",
            isSelected: true,
          },
          whySelected: "방식 A 대신 방식 B를 채택한 결정적인 기술적 이유",
        },
        impact: "이 설계를 통해 얻은 유지보수성/성능/협업 측면의 긍정적 결과",
        codeSnippet: `// 핵심 설계 코드 스니펫 (없으면 이 줄을 지우셔도 됩니다)
void Example_Init(void) {
    // 코드 작성
}`,
      },
    ],

    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅 1] 해결한 문제 제목",
        issue: "발생했던 버그, 통신 오류, 또는 성능 병목 현상 설명",
        rootCause: [
          "원인 분석 1단계 (예: 로그/레지스터 확인)",
          "원인 분석 2단계 (예: 오실로스코프/디버거 측정 결과)",
          "파악한 근본 원인 요약",
        ],
        logOrCode: `// 문제 상황 로그 또는 해결 전후 비교 코드 (없으면 지우셔도 됩니다)`,
        solution: "문제를 해결하기 위해 적용한 구체적인 방법",
        learned: "해결 후 개선된 수치(예: 응답속도 개선, 에러율 0%) 및 배운 점",
      },
    ],
  }, // 선풍기 리눅스 드라이버 
  {
    id: "jojimara-v1",
    title: "JOJIMARA (졸지마라)",
    subtitle: "Jetson Orin Nano와 STM32를 이용한 AI 졸음운전 자동차 관제 및 실시간 제어 시스템",
    period: "2026.09.08 ~ 2026.09.14",
    teamAndRole: "3인 팀 프로젝트 (임베디드 펌웨어 및 하드웨어 회로 설계 전담)",
    contribution: "펌웨어 & 회로 설계 100% (전체 시스템 기여도 40%)",
    thumbnailPrompt: "STM32 하드웨어 설계도 및 도로주행/졸음감지 AI 실시간 카메라 관제 화면",
    githubUrl: "https://github.com/rlagudwls5518/jojimara",
    overview: {
      background:
        "대한상공회의소 서울기술교육센터에서 진행한 프로젝트로, 주행 중 운전자의 졸음 상태 및 도로 상황(터널 진입/탈출, 차선/차량 인식)을 Edge AI(Jetson Orin Nano)로 실시간 분석하고, 즉각적으로 차량 내 액추에이터(경고 부저, 환기용 에어컨/공기청정기 모터, 다채널 경고 LED)를 정밀 제어하는 통합 관제 시스템입니다.",
      goals: [
        "Jetson Orin Nano(상위 제어기)와 STM32(하위 제어기) 간의 유실 없는 실시간 양방향 UART 통신 규격 확립",
        "다수의 액추에이터(DC 모터 2개, 피에조 부저, 다채널 LED)가 동시에 동작하더라도 명령 수신이 지연되지 않는 1ms 논블로킹(Non-blocking) 펌웨어 아키텍처 구현",
        "하드웨어 회로 설계부터 레지스터 레벨 PWM 제어, 리눅스 커널 레벨 통신 트러블슈팅까지 엔드투엔드(End-to-End) 신뢰성 확보",
      ],
      myContributions: [
        "STM32 MCU 주변 회로 및 DC 모터 드라이버, 피에조 부저, 다채널 LED 하드웨어 회로도 설계 및 브레드보드 구성",
        "Jetson Orin Nano - STM32 간 텍스트 기반 UART 프로토콜 정의 및 인터럽트/테이블 디스패처 기반 파싱 엔진 개발",
        "TIM2/TIM3 레지스터(ARR, CCR) 직접 조작을 통한 모터 속도 PWM 및 3kHz 가변 주파수 피에조 부저 드라이버 개발",
        "비트마스크 연산 기반 다중 상태 LED 점멸 제어 및 1ms 시스템 틱 기반 비동기 태스크 스케줄링 구현",
      ],
    },
    techStack: [
      {
        name: "STM32 (C / Firmware)",
        reason: "실시간성이 중요한 차량 액추에이터 제어를 위해 레지스터(TIM, USART) 직접 접근 및 인터럽트 제어에 최적화된 MCU 채택",
      },
      {
        name: "UART Interrupt & Custom Protocol",
        reason: "Jetson-STM32 간 명확한 명령 전달과 ACK/NACK 기반의 상태 동기화 및 디버깅 가시성 확보",
      },
      {
        name: "TIM Register PWM (TIM2, TIM3)",
        reason: "HAL 기본 함수의 오버헤드를 줄이고 모터 속도 제어 및 3kHz 부저 주파수/듀티비를 정밀하게 가변하기 위해 ARR/CCR 직접 조작",
      },
      {
        name: "Jetson Orin Nano (JetPack 6.23)",
        reason: "운전자 안면/시선 인식 및 도로 객체 인식을 실시간 처리하는 상위 엣지 AI 컴퓨터와의 시리얼 인터페이스 연동",
      },
      {
        name: "Oscilloscope & Kernel Log (dmesg)",
        reason: "SW 로직만으로 찾기 힘든 하드웨어 파형 왜곡 및 OS 커널 DMA 결함을 3단계로 분리 검증하기 위해 활용",
      },
    ],
    designDecisions: [
      {
        id: "arch-1",
        title: "테이블 기반 커맨드 디스패처 (Command Dispatcher) 아키텍처",
        problem:
          "Jetson으로부터 수신하는 제어 명령(졸음 경고, 터널 진입/탈출, 좌/우측 위험, 에어컨 제어 등)이 늘어남에 따라, 단순 분기문으로 처리할 경우 코드 가독성이 떨어지고 명령 추가 시 유지보수가 어려워지는 구조적 한계가 있었습니다.",
        comparison: {
          optionA: {
            name: "다중 if-else / switch 분기문",
            desc: "구현은 단순하나 문자열 비교(strcmp)가 중첩되어 파싱 루틴이 비대해지고, 새로운 센서/액추에이터 명령 추가 시 파서 코어 로직을 매번 수정해야 함 (OCP 위배).",
          },
          optionB: {
            name: "CommandEntry 구조체 배열 & 함수 포인터 매핑",
            desc: "명령어 문자열과 실행할 콜백 함수 포인터를 구조체 테이블(`cmd_table`)로 분리 정의하고, 인터럽트 파서 완료 시 테이블을 순회하며 매핑된 함수를 즉각 호출.",
            isSelected: true,
          },
          whySelected:
            "파싱 엔진과 실제 제어 비즈니스 로직을 완벽히 분리하여, 신규 명령이 추가되더라도 cmd_table에 엔트리 한 줄만 추가하면 되도록 확장성을 극대화했습니다. 또한 정의되지 않은 명령 수신 시 일관되게 NACK_INVALID_CMD 피드백을 반환하도록 표준화했습니다.",
        },
        impact:
          "엣지 애플리케이션 담당 팀원과의 협업 시 사전 합의된 인터페이스 정의서와 1:1로 매핑되는 클린 코드를 유지했으며, 명령어 추가 및 수정 시간을 대폭 단축했습니다.",
        codeSnippet: `typedef void (*CmdHandler)(void);
typedef struct {
    CommandType cmd_type;      // 명령어 Enum 타입
    const char *cmd_str;       // 응답 문자열
    CmdHandler handler;        // 실행할 함수 포인터
} CommandEntry;

// 테이블 정의: 여기에 한 줄씩만 추가/수정하면 모든 로직이 자동 연동됨
static const CommandEntry cmd_table[] = {
    { CMD_DROWSY_WARN, "ACK_DROWSY_WARN", app_start_buzzer },
    { CMD_DROWSY_OK,   "ACK_DROWSY_OK",   app_stop_buzzer },
    { CMD_VENT_ON,     "ACK_VENT_ON",     app_aircon_start },
    { CMD_WARN_CENTER, "ACK_WARN_CENTER", action_warn_center },
    { CMD_WARN_RIGHT,  "ACK_WARN_RIGHT",  action_warn_right },
    { CMD_WARN_LEFT,   "ACK_WARN_LEFT",   action_warn_left },
    { CMD_CENTER_OK,   "ACK_CENTER_OK",   action_center_ok },
    { CMD_RIGHT_OK,    "ACK_RIGHT_OK",    action_right_ok },
    { CMD_LEFT_OK,     "ACK_LEFT_OK",     action_left_ok },
    { CMD_WIN_CLOSE,   "ACK_WIN_CLOSE",   action_win_close },
    { CMD_WIN_OPEN,    "ACK_WIN_OPEN",    action_win_open },
};`,
      },
      {
        id: "arch-2",
        title: "모듈화 드라이버 추상화 (DCMotor_t 캡슐화) 및 비트마스크 LED 상태 관리",
        problem:
          "에어컨과 공기청정기를 대체하는 2개의 DC 모터와 중앙/좌/우 다채널 경고 LED를 각각 제어할 때, 하드웨어 핀과 타이머 채널마다 중복 코드를 작성하면 펌웨어 결합도가 높아지는 문제가 있었습니다.",
        comparison: {
          optionA: {
            name: "액추에이터별 개별 함수 및 전역 변수 나열",
            desc: "Motor1_On(), Motor2_On(), LED_Left_Toggle() 등 하드웨어 채널별로 함수를 중복 작성하여 상태 동기화가 복잡해짐.",
          },
          optionB: {
            name: "DCMotor_t 구조체 캡슐화 & 비트마스크(target_led) 연산",
            desc: "제어 핀과 TIM2 채널 정보를 DCMotor_t 구조체로 추상화하여 단일 드라이버 코드로 다중 모터를 제어하고, LED는 비트마스크(target_led)로 다중 상태를 단일 변수에서 동시 관리.",
            isSelected: true,
          },
          whySelected:
            "하드웨어 의존성을 구조체 내부로 숨겨 재사용성을 높이고, 좌/우/중앙 경고등이 독립적이면서도 동시에 250ms 주기로 깜빡여야 하는 요구사항을 비트 연산(`|`, `&`, `^`)으로 가장 가볍게 처리할 수 있었기 때문입니다.",
        },
        impact:
          "단일 드라이버 로직으로 2개의 모터를 완벽히 제어하고(에어컨 10초 자동 OFF 포함), 메인 루프 방해 없이 백그라운드 인터럽트에서 다채널 LED의 동시 점멸 동기화를 달성했습니다.",
        codeSnippet: `typedef struct {
    GPIO_TypeDef *dir_port;
    uint8_t pin_in1;
    uint8_t pin_in2;
    volatile uint32_t *ccr;
} DCMotor_t;

typedef enum {
   CENTER = (1 << 0),
   RIGHT = (1 << 1),
   LEFT = (1 << 2),
   NONE = 0
} LED_STATE;`,
      },
    ],
    troubleshooting: [
      {
        id: "ts-1",
        title: "[트러블슈팅 1] 블로킹 지연(Delay)으로 인한 Jetson 수신 타임아웃 해결",
        issue:
          "Jetson Orin Nano에서 졸음 감지(`DROWSY_WARN`) 등의 명령을 송신한 후 STM32의 응답(`ACK`)을 대기할 때 간헐적으로 수신 타임아웃이 발생하여, 상위 관제 시스템의 상태 동기화가 실패하고 차량 안전 경보 시퀀스가 지연되는 현상이 발생했습니다.",
        rootCause: [
          "초기 STM32 펌웨어 내 액추에이터(부저 250ms 단속음 비프 패턴, 모터 10초 구동 유지 등) 제어 로직에 블로킹 방식의 지연 함수(Delay)가 사용됨.",
          "지연 함수가 수행되는 동안 CPU 점유가 독점되면서, 그 사이에 들어오는 Jetson의 상태 질의 및 연속 명령에 대해 즉각적인 패킷 파싱과 ACKOK 전송 타이밍을 충족하지 못함.",
        ],
        logOrCode: `// [Before] 블로킹 제어로 인해 CPU가 독점되어 UART 응답 지연 발생
void Buzzer_Alert_Blocking(void) {
    Buzzer_On();
    HAL_Delay(250); // 250ms 동안 다른 명령 처리 및 ACK 송신 불가!
    Buzzer_Off();
    HAL_Delay(250);
}

// [After] 1ms 타이머 인터럽트(TIM1/SysTick) 기반 논블로킹 상태 머신
void app_actuator_1ms_ISR(void) {
    // 인터럽트에서는 오직 상태 플래그와 틱 카운트만 증감 (지연 최소화)
    if (buzzer_state.active && (++buzzer_state.tick >= 250)) {
        buzzer_state.tick = 0;
        buzzer_state.toggle_flag = 1; // 실제 하드웨어 제어는 각 모듈에서 비동기 분기
    }
    if (aircon_motor.is_running && (--aircon_motor.auto_off_tick == 0)) {
        aircon_motor.stop_flag = 1;   // 에어컨 10초(10000ms) 자동 OFF
    }
}`,
        solution:
          "모든 `Delay` 함수를 제거하고 1ms 타이머 인터럽트(`app_motor_1ms_ISR` 등) 기반의 논블로킹(Non-blocking) 아키텍처로 전면 재설계했습니다. 1ms 인터럽트 내부에서는 단순히 상태 플래그와 틱 카운트만 증가시켜 인터럽트 지연(Latency)을 최소화하고, 실제 모터(10초 자동 OFF)와 부저(3kHz, 250ms 단속음) 제어는 각 드라이버 모듈에서 비동기로 분기 처리하도록 구현했습니다.",
        learned:
          "Jetson 측 명령 송신 즉시 지연 없이 `ACKOK\\r\\n` 응답을 100% 실시간 수신 완료했습니다. 임베디드 시스템에서 다중 액추에이터를 제어할 때 시간 지연을 이벤트/틱 기반으로 분리하는 비동기 설계가 시스템 전체의 실시간 응답성(Real-time Responsiveness)을 결정짓는다는 점을 체득했습니다.",
      },
      {
        id: "ts-2",
        title: "[트러블슈팅 2] JetPack 6.x 내부 UART DMA 결함 규명 및 통신 무결성 확보",
        issue:
          "Jetson의 40-pin GPIO UART(`/dev/ttyTHS1`)를 통해 STM32와 통신할 때, 7바이트 이하의 짧은 패킷은 정상 수신되나 **8바이트 이상의 패킷 수신 시 데이터가 `0x00`으로 덮어써지거나 패킷이 유실되는 치명적인 현상**이 발생했습니다.",
        rootCause: [
          "가설 검증을 통한 3단계 디버깅(SW → HW → OS Kernel) 수행:",
          "1단계 [SW 로직 검증]: STM32 내부 함수 흐름 및 `USART2` 레지스터 레벨 전송 버퍼 확인 → 정상 송출 확인.",
          "2단계 [HW 전기적 신호 검증]: 오실로스코프로 STM32 Tx 라인(`ACKOKK\\r\\n`) 파형을 직접 측정 → 56.81kHz, 2.00V 레벨의 깨끗한 구형파 정상 파형이 출력됨을 확인하여 STM32 및 하드웨어 배선 결함 배제.",
          "3단계 [Jetson 커널 로그 분석]: 리눅스 `dmesg` 및 `journalctl` 커널 로그를 정밀 분석한 결과, 정확히 8바이트 수신 시점에 ARM SMMU(System Memory Management Unit) 메모리 보호장치 위반 에러(`Unhandled context fault`, `VPR violation`)가 발생하는 것을 포착.",
          "근본 원인 규명: 7바이트 이하는 FIFO로 동작하나 8바이트부터 활성화되는 내부 UART(`ttyTHS`) DMA 컨트롤러가 JetPack 6.x(6.2) 버전의 디바이스 트리 매핑 결함으로 인해 메모리 쓰기가 차단되는 NVIDIA 공식 보고 이슈임을 확인.",
        ],
        logOrCode: `# Jetson Orin Nano 커널 로그 (dmesg / journalctl) 분석 결과
Sep 14 17:07:13 ubuntu kernel: arm-smmu 12000000.iommu: Unhandled context fault: fsr=0x402, iova=0xff620000...
Sep 14 17:07:13 ubuntu kernel: tegra-mc 2c00000.memory-controller: unknown: secure write VPR violation ((null))
Sep 14 17:07:13 ubuntu kernel: tegra-mc 2c00000.memory-controller: unknown: secure write Route Sanity error ((null))`,
        solution:
          "커널 드라이버의 DMA 결함이 존재하는 온보드 GPIO `ttyTHS1` 인터페이스를 대체하여, 검증된 USB-to-UART 컨트롤러 기반의 통신 경로(`/dev/ttyACM0` ↔ `STM32 USART2`)로 하드웨어/소프트웨어 인터페이스를 신속히 우회 설계하고, 종단 문자(`\\r\\n`)를 포함한 8바이트 초과 장문 ASCII 패킷 파싱 테스트를 재수행했습니다.",
        learned:
          "`0x00` 덮어쓰기 및 패킷 깨짐 현상을 100% 해결하고, 115200 bps 환경에서 장문 패킷의 완벽한 데이터 무결성을 확보했습니다. 특히 문제가 발생했을 때 막연한 추측이 아닌 'SW 코드 → 오실로스코프 파형 측정 → OS 커널 로그 분석'으로 이어지는 계층적 디버깅 방법론의 강력한 위력을 입증한 경험이었습니다.",
      },
    ],
  }, // 졸지마라
  {
    id: "project-4", // 프로젝트마다 겹치지 않는 고유 ID (예: "smart-factory-v1")
    title: "새 프로젝트 제목",
    subtitle: "프로젝트를 한 줄로 요약하는 서브 타이틀",
    period: "2026.10.01 ~ 2026.10.20",
    teamAndRole: "N인 팀 프로젝트 (본인이 맡은 핵심 역할)",
    contribution: "담당 파트 100% (전체 기여도 N%)",
    thumbnailPrompt: "썸네일 영역 대체 텍스트 설명",
    githubUrl: "https://github.com/rlagudwls5518/저장소이름",
    

    overview: {
      background:
        "이 프로젝트를 시작하게 된 배경과 어떤 시스템인지 2~3문장으로 적어주세요.",
      goals: [
        "핵심 목표 1",
        "핵심 목표 2",
        "핵심 목표 3",
      ],
      myContributions: [
        "내가 직접 구현한 핵심 기능 1",
        "내가 직접 구현한 핵심 기능 2",
        "내가 직접 구현한 핵심 기능 3",
      ],
    },

    techStack: [
      {
        name: "사용 기술 1 (예: FreeRTOS / STM32)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
      {
        name: "사용 기술 2 (예: CAN / SPI 통신)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
    ],

    designDecisions: [
      {
        id: "p2-arch-1",
        title: "설계 고민 제목 (예: 폴링 대신 인터럽트/DMA 링버퍼 도입)",
        problem: "구현 전 마주했던 구조적 한계나 고민했던 지점",
        comparison: {
          optionA: {
            name: "방식 A (기존/단순한 방식)",
            desc: "방식 A의 특징과 한계점",
          },
          optionB: {
            name: "방식 B (내가 최종 선택한 아키텍처)",
            desc: "방식 B의 구조와 동작 방식",
            isSelected: true,
          },
          whySelected: "방식 A 대신 방식 B를 채택한 결정적인 기술적 이유",
        },
        impact: "이 설계를 통해 얻은 유지보수성/성능/협업 측면의 긍정적 결과",
        codeSnippet: `// 핵심 설계 코드 스니펫 (없으면 이 줄을 지우셔도 됩니다)
void Example_Init(void) {
    // 코드 작성
}`,
      },
    ],

    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅 1] 해결한 문제 제목",
        issue: "발생했던 버그, 통신 오류, 또는 성능 병목 현상 설명",
        rootCause: [
          "원인 분석 1단계 (예: 로그/레지스터 확인)",
          "원인 분석 2단계 (예: 오실로스코프/디버거 측정 결과)",
          "파악한 근본 원인 요약",
        ],
        logOrCode: `// 문제 상황 로그 또는 해결 전후 비교 코드 (없으면 지우셔도 됩니다)`,
        solution: "문제를 해결하기 위해 적용한 구체적인 방법",
        learned: "해결 후 개선된 수치(예: 응답속도 개선, 에러율 0%) 및 배운 점",
      },
    ],
  }, // 모터 제어 프로젝트
  {
    id: "project-5", // 프로젝트마다 겹치지 않는 고유 ID (예: "smart-factory-v1")
    title: "새 프로젝트 제목",
    subtitle: "프로젝트를 한 줄로 요약하는 서브 타이틀",
    period: "2026.10.01 ~ 2026.10.20",
    teamAndRole: "N인 팀 프로젝트 (본인이 맡은 핵심 역할)",
    contribution: "담당 파트 100% (전체 기여도 N%)",
    thumbnailPrompt: "썸네일 영역 대체 텍스트 설명",
    githubUrl: "https://github.com/rlagudwls5518/저장소이름",
    

    overview: {
      background:
        "이 프로젝트를 시작하게 된 배경과 어떤 시스템인지 2~3문장으로 적어주세요.",
      goals: [
        "핵심 목표 1",
        "핵심 목표 2",
        "핵심 목표 3",
      ],
      myContributions: [
        "내가 직접 구현한 핵심 기능 1",
        "내가 직접 구현한 핵심 기능 2",
        "내가 직접 구현한 핵심 기능 3",
      ],
    },

    techStack: [
      {
        name: "사용 기술 1 (예: FreeRTOS / STM32)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
      {
        name: "사용 기술 2 (예: CAN / SPI 통신)",
        reason: "이 기술을 왜 선택했는지 한 줄 이유",
      },
    ],

    designDecisions: [
      {
        id: "p2-arch-1",
        title: "설계 고민 제목 (예: 폴링 대신 인터럽트/DMA 링버퍼 도입)",
        problem: "구현 전 마주했던 구조적 한계나 고민했던 지점",
        comparison: {
          optionA: {
            name: "방식 A (기존/단순한 방식)",
            desc: "방식 A의 특징과 한계점",
          },
          optionB: {
            name: "방식 B (내가 최종 선택한 아키텍처)",
            desc: "방식 B의 구조와 동작 방식",
            isSelected: true,
          },
          whySelected: "방식 A 대신 방식 B를 채택한 결정적인 기술적 이유",
        },
        impact: "이 설계를 통해 얻은 유지보수성/성능/협업 측면의 긍정적 결과",
        codeSnippet: `// 핵심 설계 코드 스니펫 (없으면 이 줄을 지우셔도 됩니다)
void Example_Init(void) {
    // 코드 작성
}`,
      },
    ],

    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅 1] 해결한 문제 제목",
        issue: "발생했던 버그, 통신 오류, 또는 성능 병목 현상 설명",
        rootCause: [
          "원인 분석 1단계 (예: 로그/레지스터 확인)",
          "원인 분석 2단계 (예: 오실로스코프/디버거 측정 결과)",
          "파악한 근본 원인 요약",
        ],
        logOrCode: `// 문제 상황 로그 또는 해결 전후 비교 코드 (없으면 지우셔도 됩니다)`,
        solution: "문제를 해결하기 위해 적용한 구체적인 방법",
        learned: "해결 후 개선된 수치(예: 응답속도 개선, 에러율 0%) 및 배운 점",
      },
    ],
  }, // Qt 주차장 관제 시스템
];

// ============================================================================
// 3. 프로젝트 상세 모달 컴포넌트 (접근성 a11y, Focus Trap, Scroll Lock 완비)
// ============================================================================

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

const ProjectDetailModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 아코디언 열림 상태 관리 (기본적으로 모두 열어두어 바로 읽히게 하되 토글 가능)
  const [openTroubleshootingIds, setOpenTroubleshootingIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setOpenTroubleshootingIds(project.troubleshooting.map((t) => t.id));
    }
  }, [project]);

  const toggleTroubleshooting = (id: string) => {
    setOpenTroubleshootingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // [a11y] 1. 배경 스크롤 방지 (Scroll Lock) 및 포커스 복귀 저장
  useEffect(() => {
    if (!project) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    // 모달 열릴 때 닫기 버튼으로 초기 포커스 이동
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalStyle;
      clearTimeout(timer);
      // 모달 닫힐 때 원래 트리거했던 카드 버튼으로 포커스 복귀
      previousActiveElement.current?.focus();
    };
  }, [project]);

  // [a11y] 2. ESC 키 닫기 및 Focus Trap (모달 내부로만 Tab 이동 제한)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        aria-describedby="modal-project-subtitle"
        onKeyDown={handleKeyDown}
      >
        {/* Backdrop (배경 클릭 시 닫힘) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* 1. 모달 헤더 (Sticky Header) */}
          <header className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {project.period}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {project.contribution}
                </span>
              </div>
              <h2
                id="modal-project-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {project.title}
              </h2>
              <p
                id="modal-project-subtitle"
                className="text-sm text-slate-600 dark:text-slate-400"
              >
                {project.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} GitHub 저장소 새 창에서 열기`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} 라이브 데모 새 창에서 열기`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* 모달 본문 (Scrollable Content) */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-10">
            {/* 2. 개요 및 기술 스택 (Overview & Tech Stack) */}
            <section aria-labelledby="section-overview">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h3 id="section-overview" className="text-lg font-bold">
                  1. 프로젝트 개요 및 핵심 기여 (Overview & Tech Stack)
                </h3>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.overview.background}
                </p>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  👥 팀 구성 및 역할: <span className="text-slate-900 dark:text-slate-200">{project.teamAndRole}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      🎯 핵심 목표
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {project.overview.goals.map((g, i) => (
                        <li key={i} className="leading-relaxed">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      🛠️ 내가 기여한 부분 (전담 구현)
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {project.overview.myContributions.map((c, i) => (
                        <li key={i} className="leading-relaxed">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 기술 스택 및 선정 이유 카드 */}
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  사용 기술 및 선정 이유
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.techStack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {tech.name}
                      </span>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                        {tech.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. 설계 및 아키텍처 고민 (Design Decisions & Architecture) */}
            <section aria-labelledby="section-architecture">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h3 id="section-architecture" className="text-lg font-bold">
                  2. 설계 및 아키텍처 고민 (Design Decisions)
                </h3>
              </div>

              <div className="space-y-6">
                {project.designDecisions.map((decision, idx) => (
                  <article
                    key={decision.id}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-950/80 shadow-sm space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-indigo-600 text-white">
                        설계 포인트 {idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {decision.title}
                      </h4>
                    </div>

                    {/* 문제 정의 */}
                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong className="font-semibold text-slate-900 dark:text-white block mb-1">
                        📌 문제 정의 및 구조적 고민:
                      </strong>
                      {decision.problem}
                    </div>

                    {/* A 방식 vs B 방식 비교 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Option A (기존/일반적 방식)
                        </div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                          {decision.comparison.optionA.name}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {decision.comparison.optionA.desc}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg border-2 border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-950/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            Option B (채택한 아키텍처)
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-600 text-white">
                            Selected
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                          {decision.comparison.optionB.name}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {decision.comparison.optionB.desc}
                        </p>
                      </div>
                    </div>

                    {/* 선정 이유 및 결과 Callout */}
                    <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            채택 이유:{" "}
                          </strong>
                          {decision.comparison.whySelected}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            결과 및 시사점:{" "}
                          </strong>
                          {decision.impact}
                        </p>
                      </div>
                    </div>

                    {/* 코드 스니펫 */}
                    {decision.codeSnippet && (
                      <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Architecture Code Snippet (C / STM32)</span>
                        </div>
                        <pre className="text-xs font-mono leading-relaxed">
                          <code>{decision.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* 4. 트러블슈팅 및 문제 해결 (Troubleshooting - 아코디언 카드) */}
            <section aria-labelledby="section-troubleshooting">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <h3 id="section-troubleshooting" className="text-lg font-bold">
                  3. 트러블슈팅 및 기술적 문제 해결 (Troubleshooting)
                </h3>
              </div>

              <div className="space-y-4">
                {project.troubleshooting.map((ts) => {
                  const isOpen = openTroubleshootingIds.includes(ts.id);
                  return (
                    <div
                      key={ts.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTroubleshooting(ts.id)}
                        aria-expanded={isOpen}
                        aria-controls={`ts-content-${ts.id}`}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                            Troubleshooting
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {ts.title}
                          </h4>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`ts-content-${ts.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-200 dark:border-slate-800"
                          >
                            <div className="p-5 space-y-4 text-xs sm:text-sm">
                              {/* 1) 증상 (Issue) */}
                              <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                                <div className="font-bold text-rose-800 dark:text-rose-300 mb-1">
                                  🚨 증상 및 문제 발생 (Issue)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.issue}
                                </p>
                              </div>

                              {/* 2) 원인 분석 (Root Cause) */}
                              <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                                <div className="font-bold text-amber-900 dark:text-amber-300 mb-1.5">
                                  🔍 원인 분석 및 가설 검증 (Root Cause Analysis)
                                </div>
                                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                                  {ts.rootCause.map((cause, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                      {cause}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* 로그 또는 코드 블록 */}
                              {ts.logOrCode && (
                                <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                                    <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Verification Log / Firmware Code</span>
                                  </div>
                                  <pre className="text-xs font-mono leading-relaxed">
                                    <code>{ts.logOrCode}</code>
                                  </pre>
                                </div>
                              )}

                              {/* 3) 해결 과정 (Solution) */}
                              <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                                <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                                  🛠️ 해결 방안 및 적용 (Solution)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.solution}
                                </p>
                              </div>

                              {/* 4) 결과 및 배운 점 (Learned) */}
                              <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/60">
                                <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                                  ✅ 결과 및 인사이트 (Result & Learned)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.learned}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* 5. 모달 푸터 (이전/다음 프로젝트 탐색 및 닫기 버튼) */}
          <footer className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="이전 프로젝트 보기"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>이전 프로젝트</span>
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="다음 프로젝트 보기"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>다음 프로젝트</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              닫기
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ============================================================================
// 4. 메인 포트폴리오 페이지 컴포넌트 (SPA)
// ============================================================================

export default function DeveloperPortfolio() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // 시스템 테마 연동 및 초기 다크모드 설정
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(DEVELOPER_INFO.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Fallback
    }
  };

  const selectedProject =
    selectedProjectIndex !== null ? PROJECTS_DATA[selectedProjectIndex] : null;

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
        {/* 스킵 네비게이션 (웹 접근성 a11y) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:font-semibold"
        >
          본문으로 바로가기
        </a>

        {/* 1. Header / Navigation */}
        <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a
              href="#"
              aria-label="홈으로 이동"
              className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-1"
            >
              HJ<span className="text-indigo-600 dark:text-indigo-400">.DEV</span>
            </a>

            <nav aria-label="주요 섹션 내비게이션" className="flex items-center gap-1 sm:gap-6">
              <a
                href="#about"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                About
              </a>
              <a
                href="#skills"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Skills
              </a>
              <a
                href="#projects"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Projects
              </a>
              <a
                href="#contact"
                className="px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Contact
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDarkMode ? "라이트 모드로 전환" : "다크 모드로 전환"}
                className="ml-2 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700" aria-hidden="true" />
                )}
              </button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-24">
          {/* 2. Hero (About) Section */}
          <section id="about" aria-labelledby="hero-heading" className="scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200 dark:border-indigo-800/80">
                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse" />
                <span>{DEVELOPER_INFO.role}</span>
              </div>

              <h1
                id="hero-heading"
                className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
              >
                안녕하세요, <br className="sm:hidden" />
                <span className="text-indigo-600 dark:text-indigo-400">{DEVELOPER_INFO.name}</span>
                입니다.
              </h1>

              <p className="max-w-3xl text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                {DEVELOPER_INFO.oneLiner}
              </p>

              {/* 핵심 강점 태그 */}
              <ul aria-label="핵심 강점 키워드" className="flex flex-wrap gap-2 pt-1">
                {DEVELOPER_INFO.tags.map((tag, idx) => (
                  <li
                    key={idx}
                    className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 shadow-2xs"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              {/* 액션 버튼 */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <a
                  href={DEVELOPER_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub 프로필 새 창에서 열기"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span>GitHub 방문하기</span>
                </a>

                <a
                  href={DEVELOPER_INFO.resumeUrl}
                  aria-label="이력서 PDF 다운로드"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold text-sm border border-slate-300 dark:border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <FileDown className="w-4 h-4" aria-hidden="true" />
                  <span>이력서 다운로드</span>
                </a>
              </div>
            </motion.div>
          </section>

          {/* 3. Skills Section */}
          <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-24 space-y-8">
            <div className="space-y-2">
              <h2 id="skills-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
                Skills & Expertise
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                하드웨어 제어부터 상위 시스템 인터페이스 연동까지 보유한 기술 스택입니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SKILLS_DATA.map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                      {group.iconName === "cpu" && <Cpu className="w-5 h-5" aria-hidden="true" />}
                      {group.iconName === "code" && <Code2 className="w-5 h-5" aria-hidden="true" />}
                      {group.iconName === "wrench" && (
                        <Wrench className="w-5 h-5" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold">{group.category}</h3>
                  </div>

                  <ul className="space-y-4">
                    {group.items.map((skill) => (
                      <li
                        key={skill.name}
                        className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">
                            {skill.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold rounded-full ${
                              skill.level === "Advanced"
                                ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            }`}
                          >
                            {skill.level}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {skill.desc}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>

          {/* 4. Projects Section */}
          <section
            id="projects"
            aria-labelledby="projects-heading"
            className="scroll-mt-24 space-y-8"
          >
            <div className="space-y-2">
              <h2 id="projects-heading" className="text-2xl sm:text-3xl font-bold tracking-tight">
                Featured Projects
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                카드를 클릭하면 아키텍처 설계 고민과 오실로스코프·커널 로그 기반 트러블슈팅 과정을 상세히 확인하실 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS_DATA.map((project, index) => (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-500/50 transition-all duration-200"
                >
                  <div>
                    {/* 썸네일 영역 (시각적 다이어그램 프리뷰 + alt 대체 텍스트 제공) */}
                    <div
                      role="img"
                      aria-label={project.thumbnailPrompt}
                      className="relative h-52 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 flex flex-col justify-between overflow-hidden"
                    >
                      <div className="flex items-center justify-between z-10">
                        <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-red-500/20 text-red-300 border border-red-500/30">
                          DROWSINESS ALERT! WAKE UP!
                        </span>
                        <span className="px-2.5 py-1 text-xs font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          UART 115200bps ACK_OK
                        </span>
                      </div>

                      <div className="z-10 my-auto">
                        <div className="text-xs font-mono text-indigo-300 mb-1">
                          Jetson Orin Nano ↔ STM32F103/4xx
                        </div>
                        <div className="text-lg font-bold text-white tracking-tight">
                          AI 졸음운전 관제 & 임베디드 제어 시스템
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
                        <span>TIM2/TIM3 PWM Control</span>
                        <span>1ms Non-blocking ISR</span>
                      </div>
                    </div>

                    {/* 카드 본문 */}
                    <div className="p-6 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {project.period}
                        </span>
                        <span aria-hidden="true">•</span>
                        <span className="text-slate-600 dark:text-slate-400">
                          {project.contribution}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {project.subtitle}
                        </p>
                      </div>

                      {/* 기술 스택 뱃지 */}
                      <ul aria-label="사용된 주요 기술" className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech, i) => (
                          <li
                            key={i}
                            className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          >
                            {tech.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 상세 보기 트리거 버튼 */}
                  <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIndex(index)}
                      aria-label={`${project.title} 프로젝트 설계 고민 및 트러블슈팅 상세 모달 열기`}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-600 dark:bg-indigo-950/60 dark:hover:bg-indigo-600 text-indigo-700 hover:text-white dark:text-indigo-300 dark:hover:text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <span>설계 고민 & 트러블슈팅 상세보기</span>
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </main>

        {/* 5. Contact / Footer */}
        <footer
          id="contact"
          aria-labelledby="contact-heading"
          className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <h2 id="contact-heading" className="text-2xl font-bold">
                  Contact
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  새로운 기술적 도전과 협업 제안을 언제나 환영합니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="이메일 주소 클립보드에 복사하기"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium text-slate-900 dark:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                      <span>복사 완료! ({DEVELOPER_INFO.email})</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-slate-500" aria-hidden="true" />
                      <span>{DEVELOPER_INFO.email}</span>
                      <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                    </>
                  )}
                </button>

                <a
                  href={DEVELOPER_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub 새 창에서 열기"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                </a>

                <a
                  href={DEVELOPER_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn 새 창에서 열기"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Linkedin className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200/70 dark:border-slate-800/70 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <p>© {new Date().getFullYear()} Hyungjin Kim. All rights reserved.</p>
              <p>Built with React, TypeScript, Tailwind CSS & Framer Motion (a11y compliant).</p>
            </div>
          </div>
        </footer>

        {/* 프로젝트 상세 모달 */}
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectIndex(null)}
          onPrev={() =>
            setSelectedProjectIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
          }
          onNext={() =>
            setSelectedProjectIndex((prev) =>
              prev !== null && prev < PROJECTS_DATA.length - 1 ? prev + 1 : prev
            )
          }
          hasPrev={selectedProjectIndex !== null && selectedProjectIndex > 0}
          hasNext={
            selectedProjectIndex !== null && selectedProjectIndex < PROJECTS_DATA.length - 1
          }
        />
      </div>
    </div>
  );
}