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
  FileText,
} from "lucide-react";

// ============================================================================
// 1. TypeScript 인터페이스 정의 (Data Structure)
// ============================================================================

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
  thumbnailUrl?: string; // public 폴더 내 이미지 경로 (예: "/jojimara.png") - 넣으면 자동 이미지 출력
  thumbnailTheme?: "indigo" | "emerald" | "amber" | "rose" | "cyan" | "violet"; // 카드별 포인트 테마
  thumbnailBadgeLeft?: string;
  thumbnailBadgeRight?: string;
  thumbnailCenterSub?: string;
  thumbnailCenterMain?: string;
  thumbnailFooterLeft?: string;
  thumbnailFooterRight?: string;
  githubUrl: string;
  demoUrl?: string;
  reportPdfUrl: string;
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

// ============================================================================
// 2. 포트폴리오 상수 데이터 (6개 프로젝트 완비)
// ============================================================================

const DEVELOPER_INFO = {
  name: "김형진",
  role: "Embedded Firmware & Edge System Developer",
  oneLiner:
    "하드웨어 레지스터 레벨의 정밀한 제어부터 Linux 커널 드라이버 및 통신 아키텍처까지, 안정적인 시스템을 만드려고 노력하는 지원자입니다.",
  tags: [
    "#STM32_레지스터_직접제어",
    "#Linux_Device_Driver",
    "#Verilog_FPGA_설계",
    "#논블로킹_펌웨어_아키텍처",
    "#오실로스코프_커널로그_디버깅",
  ],
  email: "rlagudwls5518@example.com",
  github: "https://github.com/rlagudwls5518",
  linkedin: "https://linkedin.com",
  resumeUrl: "/resume.pdf",
};

const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Embedded / Firmware",
    iconName: "cpu",
    items: [
      {
        name: "C / Embedded C",
        level: "Advanced",
        desc: "구조체 캡슐화, 함수 포인터 기반 이벤트 디스패처, 비트마스크 연산 및 메모리 직접 제어",
      },
      {
        name: "STM32 (Register / HAL / FreeRTOS)",
        level: "Advanced",
        desc: "TIM(ARR/CCR) 레지스터 직접 조작 PWM 생성, USART 인터럽트, 1ms 시스템 틱 및 RTOS 태스크 설계",
      },
      {
        name: "UART / CAN / I2C / SPI",
        level: "Advanced",
        desc: "이기종 보드 간 커스텀 프레임 파싱, ACK/NACK 피드백 규격 및 에러 핸들링 프로토콜 엔진 구현",
      },
    ],
  },
  {
    category: "System / Edge & UI",
    iconName: "code",
    items: [
      {
        name: "Linux Kernel Driver & Multithreading",
        level: "Advanced",
        desc: "Character 디바이스 드라이버, pthreads 멀티스레딩 및 단일 Mutex 상태 스냅샷 동기화",
      },
      {
        name: "Jetson Orin Nano (Yocto / Ubuntu)",
        level: "Intermediate",
        desc: "JetPack/Yocto 환경 구축, 시리얼 인터페이스 연동 및 커널 로그(dmesg/journalctl) 디버깅",
      },
      {
        name: "C++ (Qt) & React / Next.js",
        level: "Intermediate",
        desc: "Qt 기반 실시간 시리얼 관제 GUI 애플리케이션 및 모던 웹 대시보드 구축",
      },
    ],
  },
  {
    category: "Hardware & Tools",
    iconName: "wrench",
    items: [
      {
        name: "Verilog HDL / FPGA (Basys 3)",
        level: "Advanced",
        desc: "Xilinx Vivado 기반 FSM 설계, UART+FIFO 아키텍처, PWM 및 FND 컨트롤러 하드웨어 로직 구현",
      },
      {
        name: "Circuit Design & Oscilloscope",
        level: "Advanced",
        desc: "MCU 주변 회로 설계, 오실로스코프 파형 분석을 통한 신호 무결성 검증 및 하드웨어 디버깅",
      },
      {
        name: "Makefile / Git / Cross-Compile",
        level: "Advanced",
        desc: "ARM툴체인 크로스 컴파일 통합 Makefile 작성 및 인터페이스 정의서 기반 협업",
      },
    ],
  },
];

const PROJECTS_DATA: ProjectDetail[] = [
  // --------------------------------------------------------------------------
  // 1. 최종 프로젝트 (Jetson Orin Nano + Multi-STM32 FreeRTOS & CAN)
  // --------------------------------------------------------------------------
  {
    id: "project-1-final",
    title: "미정 (최종 프로젝트)",
    subtitle: "Yocto Linux 기반 Jetson Orin Nano와 다중 STM32(FreeRTOS) 노드를 연동한 CAN/UART 전장 아키텍처",
    period: "2026.10 ~ 2026.11 (진행 중)",
    teamAndRole: "4인 팀 프로젝트 (임베디드 펌웨어 아키텍처, RTOS 태스크 설계 및 통신 인터페이스 담당)",
    contribution: "하위 제어 노드 펌웨어 및 통신 프로토콜 설계 주도",
    thumbnailPrompt: "Jetson Orin Nano와 다중 STM32 노드 간 CAN 및 UART DMA 통신 아키텍처",
    // thumbnailUrl: "/final-project.png", // public 폴더에 사진 추가 시 주석 해제
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
        "단일 MCU 제어의 한계를 넘어 실제 차량 전장 환경과 유사하게 상위 제어기(Jetson Orin Nano)와 다수의 하위 제어기(STM32)를 CAN 버스와 고속 UART DMA로 연결한 분산 제어 시스템입니다.",
      goals: [
        "Yocto Project 기반 커스텀 리눅스 이미지 구축 및 전장 통신 인터페이스(CAN/UART) 최적화",
        "STM32 내 FreeRTOS 도입을 통한 센서 수집·통신 파싱·액추에이터 제어 태스크의 실시간 결정성(Determinism) 확보",
        "다중 노드 간 데이터 충돌 방지 및 우선순위 기반 메시지 중재 아키텍처 구현",
      ],
      myContributions: [
        "STM32 FreeRTOS 기반 멀티 태스크(센서/통신/제어) 우선순위 설계 및 Queue/Semaphore 동기화 구현",
        "고속 패킷 수신 시 CPU 부하를 최소화하기 위한 UART DMA + Ring Buffer 수신 구조 설계",
        "노드 간 상태 동기화 및 워치독(Watchdog) 기반 페일세이프(Fail-safe) 제어 로직 작성",
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
        reason: "불필요한 패키지를 제거한 경량 커스텀 리눅스 환경에서 상위 관제 및 AI 추론 수행",
      },
    ],
    designDecisions: [
      {
        id: "p1-arch-1",
        title: "Super-loop(폴링/단순 ISR) 대비 FreeRTOS 태스크 분리 및 Queue 파이프라인 설계",
        problem:
          "통신 패킷 파싱, 다중 센서 필터링, 모터 PID/PWM 제어가 단일 루프에서 돌면 특정 연산이 길어질 때 제어 주기가 흔들리는(Jitter) 문제가 발생합니다.",
        comparison: {
          optionA: {
            name: "단일 Super-loop + 플래그 폴링",
            desc: "구현이 직관적이나 기능 추가 시 루프 실행 시간이 가변되어 엄격한 제어 주기(예: 1ms/5ms) 보장이 어려움.",
          },
          optionB: {
            name: "FreeRTOS 우선순위 태스크 + Message Queue",
            desc: "하드웨어 인터럽트(DMA/CAN Rx)는 데이터를 Queue에 넣기만 하고, 우선순위가 부여된 워커 태스크가 깨어나 처리.",
            isSelected: true,
          },
          whySelected:
            "통신 폭주 상황에서도 최고 우선순위를 가진 안전 제어 태스크의 실행 주기를 100% 보장하고 모듈 간 결합도를 낮추기 위해 선택했습니다.",
        },
        impact:
          "센서 노드 확장 및 프로토콜 변경 시에도 제어 태스크 코드를 전혀 건드리지 않는 유연한 전장 소프트웨어 구조를 확립했습니다.",
        codeSnippet: `// ISR에서는 최소한의 동작으로 Queue에 프레임만 전달하고 즉시 컨텍스트 스위칭
void CAN_Rx_IRQHandler(void) {
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;
    CanFrame_t rx_frame = CAN_ReadFrame();
    xQueueSendFromISR(xCanRxQueue, &rx_frame, &xHigherPriorityTaskWoken);
    portYIELD_FROM_ISR(xHigherPriorityTaskWoken);
}`,
      },
    ],
    troubleshooting: [
      {
        id: "p1-ts-1",
        title: "[트러블슈팅] 미정",
        issue:
          "미정",
        rootCause: [
          "미정",
          "미정",
        ],
        solution:
          "미정",
        learned:
          "미정",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 2. FPGA 공조기 구현 (RTC 기반 공조기 시스템 - Verilog HDL)
  // --------------------------------------------------------------------------
  {
    id: "project-2-fpga",
    title: "RTC 기반 스마트 공조기 제어 시스템 (FPGA)",
    subtitle: "Digilent Basys 3 FPGA와 Verilog HDL을 활용한 하드웨어 레벨 실시간 공조기 및 주변장치 제어",
    period: "2026.10",
    teamAndRole: "팀/개인 설계 프로젝트 (Verilog RTL 모듈 설계, FSM 제어기 및 합성/검증)",
    contribution: "RTL 모듈 설계 및 하드웨어 통합 검증 100%",
    thumbnailPrompt: "Basys 3 FPGA 보드 기반 Verilog HDL 스마트 공조기 시스템 회로 및 동작",
    // thumbnailUrl: "/fpga-hvac.png",
    thumbnailTheme: "cyan",
    thumbnailBadgeLeft: "Verilog HDL / Basys 3",
    thumbnailBadgeRight: "FSM & UART FIFO",
    thumbnailCenterSub: "Xilinx Vivado • Hardware Logic Design",
    thumbnailCenterMain: "RTC 기반 스마트 공조기 제어 시스템 (FPGA)",
    thumbnailFooterLeft: "PWM Motor & Buzzer",
    thumbnailFooterRight: "Zero-CPU Hardware Parallelism",
    githubUrl: "https://github.com/rlagudwls5518",
    reportPdfUrl: "",
    overview: {
      background:
        "소프트웨어(CPU) 개입 없이 순수 디지털 논리 회로(Verilog HDL)만으로 실시간 시계(RTC), 온습도/센서 데이터 수집, DC 팬 모터 PWM 제어, FND 디스플레이 및 UART 통신을 병렬 처리하는 하드웨어 공조기 시스템입니다.",
      goals: [
        "클럭 분주기(Tick Generator)와 유한 상태 머신(FSM)을 이용한 정밀한 타이밍 제어 회로 설계",
        "FND 7-Segment 동적 구동, PWM 모터 속도 제어, 피에조 부저 효과음 생성 모듈의 완전 병렬 동작 구현",
        "UART + FIFO 버퍼 아키텍처를 통한 데이터 유실 없는 외부 인터페이스 구축",
      ],
      myContributions: [
        "2-Always 블록 기반의 안정적인 Moore/Mealy FSM 상태 머신 설계로 모드 전환 및 제어 로직 구현",
        "100MHz 시스템 클럭 기반 정밀 Tick 생성기, Up/Down 카운터 및 FND 컨트롤러 모듈 작성",
        "듀티비 가변형 PWM 하드웨어 모듈 및 부저 주파수 생성기 RTL 구현 및 Vivado 시뮬레이션/합성 검증",
      ],
    },
    techStack: [
      {
        name: "Verilog HDL & Xilinx Vivado",
        reason: "하드웨어 기술 언어를 통해 클럭 단위의 오차 없는 병렬 디지털 로직을 설계하고 타이밍 시뮬레이션 수행",
      },
      {
        name: "Digilent Basys 3 (Artix-7 FPGA)",
        reason: "실제 스위치/버튼 디바운싱, 7-Segment FND, 외부 모터/센서 PMOD 인터페이스를 하드웨어 레벨에서 검증",
      },
      {
        name: "FSM & UART FIFO Architecture",
        reason: "복잡한 제어 시퀀스를 상태 머신으로 명확히 분리하고, 비동기 직렬 통신의 속도 차이를 완충하기 위해 FIFO 적용",
      },
    ],
    designDecisions: [
      {
        id: "p2-arch-1",
        title: "2-Always 블록 기반 FSM 설계 및 계층적(Hierarchical) 모듈 분리",
        problem:
          "단일 Always 블록에 상태 천이, 다음 상태 조건, 출력 로직을 모두 혼용하면 합성 시 의도치 않은 래치(Latch)가 생성되거나 타이밍 분석 및 디버깅이 까다로워지는 문제가 있었습니다.",
        comparison: {
          optionA: {
            name: "단일 블록 내 제어/연산 혼합 설계",
            desc: "코드 길이는 짧아 보이나 순차 회로(Flip-Flop)와 조합 회로(Combinational Logic)의 경계가 모호해져 글리치(Glitch) 및 래치 발생 위험이 큼.",
          },
          optionB: {
            name: "순차/조합 로직을 분리한 2-Always FSM + Top-down 모듈화",
            desc: "클럭 동기화 상태 레지스터(`r_curr_state <= r_next_state`)와 다음 상태/출력 조합 로직(`always @(*)`)을 명확히 분리하고, Tick/PWM/FND를 독립 IP처럼 모듈화.",
            isSelected: true,
          },
          whySelected:
            "합성기(Vivado)가 명확한 상태 머신으로 인식하여 최적의 게이트 회로를 생성하게 하고, 모든 조건 분기에서 `default` 할당을 강제하여 래치 발생을 원천 차단하기 위해 채택했습니다.",
        },
        impact:
          "각 기능 모듈(FND, PWM, Buzzer, UART)을 독립적으로 시뮬레이션 검증한 뒤 Top 모듈에서 배선(`wire`)만으로 깔끔하게 통합할 수 있었습니다.",
        codeSnippet: `// 1. 순차 회로: 클럭 엣지에 동기화된 상태 레지스터 업데이트
always @(posedge i_clk or posedge i_reset) begin
    if (i_reset) r_curr_state <= S_IDLE;
    else         r_curr_state <= r_next_state;
end

// 2. 조합 회로: Latch 방지를 위한 초기값 선언 및 다음 상태 결정
always @(*) begin
    r_next_state = r_curr_state; // 기본값 유지로 Latch 방지
    case (r_curr_state)
        S_IDLE: if (w_start_tick) r_next_state = S_ACTIVE;
        S_ACTIVE: if (w_stop_cond) r_next_state = S_IDLE;
        default: r_next_state = S_IDLE;
    endcase
end`,
      },
    ],
    troubleshooting: [
      {
        id: "p2-ts-1",
        title: "[트러블슈팅] 기계식 입력 채터링(Chattering) 및 카운터 오버플로우/언더플로우 방지",
        issue:
          "보드상의 물리 버튼이나 로터리/스위치 조작 시 미세한 접점 떨림(Bounce)으로 인해 설정 온도나 풍량 카운터가 한 번에 여러 단계씩 튀거나, 최대/최소 경계값(`8'hFF`, `8'h00`)에서 값이 반전(Wrap-around)되는 현상이 발생했습니다.",
        rootCause: [
          "100MHz(10ns 주기) 고속 클럭 환경에서 수 ms 동안 지속되는 물리적 스위치 진동이 수만 번의 엣지로 인식됨.",
          "8비트 레지스터(`r_counter`)가 `8'hFF`에서 `+1` 될 때 `8'h00`으로 오버플로우되는 경계 조건 미처리.",
        ],
        logOrCode: `// 상태 히스토리 결합 및 포화 연산(Saturation)을 통한 오버플로우/언더플로우 원천 방지
case ({r_prev_state, r_curr_state})
    4'b0010, 4'b0011, 4'b1101, 4'b0100: begin // CW 방향 증가
        if (r_counter < 8'hFF && r_step == 2'b11)
            r_counter <= r_counter + 1'b1;
        r_step <= r_step + 1'b1;
    end
    4'b0001, 4'b0011, 4'b1110, 4'b0100: begin // CCW 방향 감소
        if (r_counter > 8'h00 && r_step == 2'b11)
            r_counter <= r_counter - 1'b1;
        r_step <= r_step + 1'b1;
    end
endcase`,
        solution:
          "입력 신호를 동기화 플립플롭 체인과 디바운서(Debouncer) 모듈에 통과시켜 안정된 유효 엣지만 추출하고, 카운터 증감 시 `r_counter < 8'hFF` 및 `r_counter > 8'h00` 조건을 검사하는 포화(Saturation) 로직과 스텝(`r_step == 2'b11`) 분주 조건을 결합했습니다.",
        learned:
          "소프트웨어와 달리 모든 로직이 매 클럭 동시에 평가되는 FPGA 환경에서는 신호 동기화, 디바운싱, 그리고 비트폭 경계 조건 설계가 시스템 안정성의 핵심임을 깊이 체득했습니다.",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 3. 선풍기 리눅스 드라이버 (Fan_Linux_Driver - Jetson Orin Nano)
  // --------------------------------------------------------------------------
  {
    id: "project-3-linux-driver",
    title: "스마트 선풍기 리눅스 디바이스 드라이버 & 멀티스레드 제어 시스템",
    subtitle: "Jetson Orin Nano 기반 커널 디바이스 드라이버 연동 및 pthreads 멀티스레드 유저 애플리케이션 구현",
    period: "2026.10.09 ~ 2026.10.12",
    teamAndRole: "4인 팀 프로젝트 (유저 애플리케이션 아키텍처, 3개 워커 스레드, fan_api.h 추상화 및 통합 Makefile 전담)",
    contribution: "멀티스레드 앱 아키텍처 & 드라이버 추상화 API & 빌드 시스템 100%",
    thumbnailPrompt: "Jetson Orin Nano 리눅스 커널 디바이스 드라이버 및 멀티스레드 제어 아키텍처",
    // thumbnailUrl: "/fan-driver.png",
    thumbnailTheme: "emerald",
    thumbnailBadgeLeft: "Linux Device Driver",
    thumbnailBadgeRight: "pthreads & Mutex",
    thumbnailCenterSub: "Kernel Space (/dev) ↔ User Space (fan_api.h)",
    thumbnailCenterMain: "스마트 선풍기 리눅스 드라이버 & 멀티스레드 시스템",
    thumbnailFooterLeft: "Single-Mutex State Snapshot",
    thumbnailFooterRight: "Unified Cross Makefile",
    githubUrl: "https://github.com/rlagudwls5518",
    reportPdfUrl: "",
    overview: {
      background:
        "Jetson Orin Nano 리눅스 환경에서 하드웨어 제어용 커널 디바이스 드라이버 모듈과 유저 공간 멀티스레드 제어 애플리케이션을 분리 설계하여, 사용자 입력·타이머·센서 데이터를 동시에 처리하는 스마트 선풍기 시스템입니다.",
      goals: [
        "커널 디바이스 드라이버와 유저 애플리케이션 간의 깔끔한 계층 분리(fan_api.h 추상화)",
        "입력, 타이머, 센서 3개의 워커 스레드가 동시에 동작할 때 데드락 및 레이스 컨디션 완벽 방지",
        "커널 모듈과 유저 애플리케이션을 단일 명령어로 빌드하는 통합 Makefile 구축",
      ],
      myContributions: [
        "전체 유저 공간 애플리케이션 아키텍처 설계 및 3개 워커 스레드(input, timer, sensor) 제어 로직 구현",
        "저수준 파일 디스크립터 및 시스템 콜을 캡슐화한 fan_api.h 하드웨어 추상화 인터페이스 정의",
        "공유 상태를 SystemContext 구조체로 통합하고 단일 뮤텍스(g_state_lock) 스냅샷 패턴으로 동시성 이슈 해결",
        "커널 모듈과 C 애플리케이션을 한 번에 빌드/클린하는 통합 Makefile 작성",
      ],
    },
    techStack: [
      {
        name: "C & POSIX Threads (pthreads)",
        reason: "센서 폴링, 타이머 카운트다운, 사용자 버튼/명령 입력을 블로킹 없이 병렬로 처리하기 위해 채택",
      },
      {
        name: "Linux Device Driver Interface",
        reason: "유저 공간에서 직접 하드웨어 레지스터를 건드리지 않고 커널 드라이버 노드(`/dev/...`)를 통해 안전하게 제어",
      },
      {
        name: "Single-Mutex SystemContext Pattern",
        reason: "다중 스레드 간 공유 변수 접근 시 락 순서 역전으로 인한 데드락(Deadlock)을 원천 차단하기 위해 설계",
      },
      {
        name: "GNU Make (Unified Makefile)",
        reason: "팀원들이 개발한 다수의 드라이버 모듈과 메인 앱의 빌드 과정을 표준화하고 배포 효율을 극대화",
      },
    ],
    designDecisions: [
      {
        id: "p3-arch-1",
        title: "SystemContext 단일 뮤텍스(g_state_lock) 스냅샷 아키텍처 및 fan_api.h 계층 분리",
        problem:
          "3개의 워커 스레드(입력, 타이머, 센서)가 풍속, 타이머 잔여 시간, 현재 온도 등의 상태 변수를 동시에 읽고 쓸 때, 변수마다 개별 Mutex를 두면 락 획득 순서가 꼬여 데드락(Deadlock)에 빠질 위험이 높았습니다.",
        comparison: {
          optionA: {
            name: "기능/변수별 다중 Mutex + 스레드 내 직접 드라이버 I/O 호출",
            desc: "`lock(motor_mutex)` 후 `lock(timer_mutex)`를 호출하는 식의 중첩 락 구조로 데드락 위험이 크고, 락을 잡은 채 느린 디바이스 I/O를 수행해 다른 스레드가 블로킹됨.",
          },
          optionB: {
            name: "SystemContext 단일 Mutex(g_state_lock) + 로컬 스냅샷 패턴",
            desc: "모든 공유 상태를 `SystemContext` 구조체 하나로 묶고 오직 단일 뮤텍스(`g_state_lock`)로만 보호. 임계 구역 안에서는 구조체 메모리 복사(Snapshot)만 수행하고, 실제 하드웨어 제어(`fan_api.h`)는 락 해제 후 호출.",
            isSelected: true,
          },
          whySelected:
            "단일 락을 사용함으로써 락 순서 역전(Lock Ordering Issue)에 의한 데드락 가능성을 수학적으로 0%로 만들고, 임계 구역 체류 시간을 수 나노초(메모리 복사)로 줄이기 위해 채택했습니다.",
        },
        impact:
          "커널 드라이버 팀원이 내부 구현을 수정하더라도 `fan_api.h` 인터페이스만 유지되면 애플리케이션 코드는 수정할 필요가 없었으며, 장시간 멀티스레드 스트레스 테스트에서도 경쟁 상태나 데드락 없이 안정적으로 동작했습니다.",
        codeSnippet: `typedef struct {
    int fan_speed;
    int timer_remaining_sec;
    int current_temp;
    bool is_auto_mode;
} SystemContext;

static SystemContext g_ctx;
static pthread_mutex_t g_state_lock = PTHREAD_MUTEX_INITIALIZER;

// 임계 구역 최소화: Lock 내부에서는 로컬 스냅샷만 복사하고 I/O는 Lock 밖에서 수행
void *sensor_worker_thread(void *arg) {
    while (g_running) {
        int temp = fan_api_read_temperature(); // 느린 HW I/O는 Lock 외부에서 실행

        pthread_mutex_lock(&g_state_lock);
        g_ctx.current_temp = temp;
        SystemContext snapshot = g_ctx;        // 빠른 메모리 스냅샷 획득
        pthread_mutex_unlock(&g_state_lock);

        // 스냅샷 기반으로 풍속 갱신 판단
        if (snapshot.is_auto_mode) {
            fan_api_set_speed(calc_target_speed(snapshot.current_temp));
        }
        usleep(100000);
    }
    return NULL;
}`,
      },
    ],
    troubleshooting: [
      {
        id: "p3-ts-1",
        title: "[트러블슈팅] 멀티스레드 종료 시 자원 누수 방지 및 디바이스 파일 동시 접근 직렬화",
        issue:
          "4일간의 단기 집중 프로젝트에서 여러 팀원이 작성한 커널 드라이버들과 유저 스레드들을 통합할 때, 시그널(`SIGINT`) 종료 시 디바이스가 켜진 채로 남거나 스레드들이 동시에 디바이스 파일에 접근하며 상태가 덮어써지는 문제가 있었습니다.",
        rootCause: [
          "각 워커 스레드가 무한 루프(`while(1)`)로만 돌고 있어 강제 종료 시 모터 정지 및 `close(fd)` 클린업 루틴이 실행되지 않음.",
          "상태 변경과 하드웨어 반영 사이의 원자성(Atomicity)이 보장되지 않으면 이전 상태의 명령이 최신 명령을 덮어씀.",
        ],
        solution:
          "`SIGINT` 시그널 핸들러와 전역 종료 플래그를 연동하여 모든 워커 스레드가 루프를 안전하게 빠져나와 `pthread_join` 되도록 구성하고, 종료 직전 `fan_api_cleanup()`을 통해 모터 정지 및 파일 디스크립터 반환이 보장되도록 처리했습니다.",
        learned:
          "리눅스 시스템 프로그래밍에서 커널 공간과 유저 공간의 경계를 명확히 추상화(`fan_api.h`)하는 것과 안전한 스레드 생명주기(Graceful Shutdown) 관리의 중요성을 체득했습니다.",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 4. JOJIMARA (졸지마라 - AI 졸음운전 자동차 관제 시스템)
  // --------------------------------------------------------------------------
  {
    id: "jojimara-v1",
    title: "JOJIMARA (졸지마라)",
    subtitle: "Jetson Orin Nano와 STM32를 이용한 AI 졸음운전 자동차 관제 및 실시간 제어 시스템",
    period: "2026.09.08 ~ 2026.09.14",
    teamAndRole: "3인 팀 프로젝트 (임베디드 펌웨어 및 하드웨어 회로 설계 전담)",
    contribution: "펌웨어 & 회로 설계 100% (전체 시스템 기여도 40%)",
    thumbnailPrompt: "STM32 하드웨어 설계도 및 도로주행/졸음감지 AI 실시간 카메라 관제 화면",
    thumbnailUrl: "/public/jojimara_hw.png",
    thumbnailTheme: "indigo",
    thumbnailBadgeLeft: "DROWSINESS ALERT! WAKE UP!",
    thumbnailBadgeRight: "UART 115200bps ACK_OK",
    thumbnailCenterSub: "Jetson Orin Nano ↔ STM32F4",
    thumbnailCenterMain: "AI 졸음운전 관제 & 임베디드 제어 시스템",
    thumbnailFooterLeft: "TIM2/TIM3 PWM Control",
    thumbnailFooterRight: "1ms Non-blocking ISR",
    githubUrl: "https://github.com/rlagudwls5518/jojimara",
    reportPdfUrl: "/public/jojimara/jojimara.pdf",
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
   RIGHT  = (1 << 1),
   LEFT   = (1 << 2),
   NONE   = 0
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
  },

  // --------------------------------------------------------------------------
  // 5. 양방향 DC 모터 제어 프로젝트 (STM32 Bare-metal Register Control)
  // --------------------------------------------------------------------------
  {
    id: "project-4-motor",
    title: "STM32 레지스터 직접 제어 기반 양방향 DC 모터 제어 시스템",
    subtitle: "HAL 추상화 의존도를 낮추고 타이머(TIM) 및 GPIO 레지스터 직접 조작으로 구현한 정밀 모터 드라이버",
    period: "2026.07 ~ 2026.08",
    teamAndRole: "개인 프로젝트 (베어메탈 레지스터 제어, 타이머 PWM 설계 및 방향 전환 상태 머신 구현)",
    contribution: "펌웨어 설계 및 하드웨어 인터락 구현 100%",
    thumbnailPrompt: "STM32 레지스터 직접 제어를 통한 양방향 DC 모터 PWM 및 상태 머신 제어",
    // thumbnailUrl: "/motor-control.png",
    thumbnailTheme: "amber",
    thumbnailBadgeLeft: "Bare-metal C / STM32",
    thumbnailBadgeRight: "TIM PWM & Dead-time",
    thumbnailCenterSub: "Direct Register Manipulation (RCC/GPIO/TIM)",
    thumbnailCenterMain: "양방향 DC 모터 정밀 제어 & 안전 상태 머신",
    thumbnailFooterLeft: "1-Sec Stop Interlock",
    thumbnailFooterRight: "32-bit TIM2 / PWM Control",
    githubUrl: "https://github.com/rlagudwls5518",
    reportPdfUrl: "",
    overview: {
      background:
        "고수준 라이브러리(HAL)가 내부적으로 어떻게 하드웨어를 구동하는지 밑바닥(First-principles)부터 파악하기 위해, 데이터시트와 레퍼런스 매뉴얼을 기반으로 클럭(RCC), GPIO, 타이머(TIM) 레지스터를 직접 조작하여 구현한 양방향 DC 모터 제어 시스템입니다.",
      goals: [
        "RCC, GPIO, TIM 레지스터 비트 필드를 직접 제어하여 원하는 주파수와 듀티비의 PWM 파형 생성",
        "정회전(CW) ↔ 역회전(CCW) 급격한 전환 시 역기전력 및 과전류로 인한 모터 드라이버 소손을 방지하는 안전 상태 머신 설계",
        "오실로스코프를 통한 PWM 듀티비 및 방향 전환 시퀀스 타이밍 실측 검증",
      ],
      myContributions: [
        "데이터시트 기반 타이머 프리스케일러(PSC), 자동 리로드 레지스터(ARR), 캡처/비교 레지스터(CCR) 계산 및 직접 제어",
        "방향 전환 요청 시 즉시 정지(Brake/Coast) 후 1초간 대기했다가 반대 방향으로 구동하는 하드웨어 보호용 FSM 구현",
        "단계별 속도 제어 및 외부 입력 인터럽트 연동 구현",
      ],
    },
    techStack: [
      {
        name: "STM32F4 (Bare-metal C)",
        reason: "코드 생성기 의존 없이 메모리 맵과 레지스터 비트 연산만으로 하드웨어를 제어하는 로우레벨 역량 확보",
      },
      {
        name: "32-bit Timer (TIM2) PWM",
        reason: "정밀한 분해능으로 듀티비를 조절하여 모터의 회전 속도를 부드럽게 가감속하기 위해 사용",
      },
      {
        name: "H-Bridge Motor Driver",
        reason: "IN1/IN2 방향 제어 핀과 PWM Enable 신호를 조합하여 정회전, 역회전, 정지 상태를 전기적으로 제어",
      },
    ],
    designDecisions: [
      {
        id: "p4-arch-1",
        title: "역기전력 및 H-브리지 보호를 위한 '정지 후 1초 딜레이' 방향 전환 상태 머신(FSM)",
        problem:
          "고속으로 정회전(CW) 중인 DC 모터를 즉각 역회전(CCW) 신호로 바꾸면, 관성에 의한 역기전력(Back-EMF)과 돌입 전류(Inrush Current)가 발생해 모터 드라이버 IC가 과열되거나 보드 전원이 출렁이는 현상이 발생합니다.",
        comparison: {
          optionA: {
            name: "입력 즉시 IN1/IN2 핀 상태 반전",
            desc: "구현은 간단하나 회전 관성이 남아 있는 상태에서 역전압이 인가되어 하드웨어 수명 단축 및 전원 리셋 유발.",
          },
          optionB: {
            name: "CW → STOP_WAIT(1초 정지 대기) → CCW 상태 머신 제어",
            desc: "방향 전환 명령 수신 시 먼저 듀티비를 0으로 낮추고 정지 상태로 전환한 뒤, 정확히 1초간 대기하여 회전 에너지를 소진시킨 후 반대 방향으로 기동.",
            isSelected: true,
          },
          whySelected:
            "하드웨어 회로의 물리적·전기적 특성을 소프트웨어 상태 머신으로 보호(Interlock)하여 안정적인 구동을 보장하기 위해 채택했습니다.",
        },
        impact:
          "반복적인 정/역회전 전환 테스트에서도 전원 강하(Brown-out)나 드라이버 발열 없이 안정적인 모터 제어를 달성했습니다.",
        codeSnippet: `typedef enum {
    MOTOR_IDLE = 0,
    MOTOR_RUN_CW,
    MOTOR_WAIT_STOP_1S, // 방향 전환 전 1초 정지 보호 상태
    MOTOR_RUN_CCW
} MotorState_t;

// 방향 전환 시 반드시 정지 및 1초(1000ms) 대기를 거치도록 강제
void Motor_UpdateStateMachine_1ms(void) {
    if (g_motor_state == MOTOR_WAIT_STOP_1S) {
        TIM2->CCR1 = 0; // PWM 출력 차단
        if (++g_wait_tick >= 1000) { // 1초 대기 완료 후 방향 전환
            g_wait_tick = 0;
            Motor_ApplyDirection(g_target_dir);
            g_motor_state = (g_target_dir == DIR_CW) ? MOTOR_RUN_CW : MOTOR_RUN_CCW;
        }
    }
}`,
      },
    ],
    troubleshooting: [
      {
        id: "p4-ts-1",
        title: "[트러블슈팅] 타이머 레지스터 초기값 및 클럭 트리 배수 설정 검증",
        issue:
          "레지스터 직접 설정 시 의도한 PWM 주파수와 실제 오실로스코프 측정 주파수가 일치하지 않거나 초기 구동 시 듀티비가 비정상적으로 출력되는 현상이 있었습니다.",
        rootCause: [
          "시스템 클럭(PLL) 설정과 APB1 타이머 버스 클럭 배수 관계, 그리고 32비트 타이머인 TIM2의 초기 Auto-Reload(ARR) 레지스터 범위에 대한 정밀한 계산 필요.",
        ],
        solution:
          "STM32F4 레퍼런스 매뉴얼의 클럭 트리(PLLN 배수 범위 및 APB 분주비)와 TIM2 레지스터 초기값(`0xFFFF` 등 설정값)을 대조 검증하고, 오실로스코프로 실제 출력 파형의 주기와 듀티비를 측정하며 레지스터 세팅을 보정했습니다.",
        learned:
          "라이브러리가 감춰주던 클럭 트리와 타이머 레지스터의 동작 원리를 완벽히 이해하게 되었으며, 이후 모든 프로젝트에서 레지스터 레벨 디버깅을 수행할 수 있는 탄탄한 기반이 되었습니다.",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. Qt 주차장 관제 시스템 (Smart Parking Tower Management System)
  // --------------------------------------------------------------------------
  {
    id: "project-5-parking",
    title: "실시간 IoT 기반 스마트 주차 관제 시스템",
    subtitle: "STM32 마이크로컨트롤러와 Qt(C++) GUI를 UART 시리얼 프로토콜로 연동한 주차 타워 통합 관리 시스템",
    period: "2026.08",
    teamAndRole: "3인 팀 프로젝트 (STM32 차단기 서보모터 제어, 차량 슬롯 상태 관리, 상태 표시 LED 제어 담당)",
    contribution: "STM32 액추에이터(서보/LED) 제어 및 슬롯 상태 관리 로직 전담",
    thumbnailPrompt: "STM32와 Qt C++ GUI 기반 실시간 스마트 주차 관제 시스템 화면 및 하드웨어",
    // thumbnailUrl: "/smart-parking.png",
    thumbnailTheme: "rose",
    thumbnailBadgeLeft: "STM32 & Qt (C++) GUI",
    thumbnailBadgeRight: "UART Serial Control",
    thumbnailCenterSub: "MCU Actuator Control ↔ Qt Monitoring App",
    thumbnailCenterMain: "실시간 IoT 기반 스마트 주차 관제 시스템",
    thumbnailFooterLeft: "Servo Barrier & Slot Tracking",
    thumbnailFooterRight: "Real-time State Sync",
    githubUrl: "https://github.com/rlagudwls5518",
    reportPdfUrl: "",
    overview: {
      background:
        "차량 입출차 감지부터 차단기(서보모터) 개폐, 주차 슬롯별 점유 상태 추적, 안내 LED 표시까지 하위 하드웨어(STM32)에서 실시간 처리하고, 이를 상위 PC 관제 프로그램(Qt C++ GUI)과 UART 통신으로 양방향 동기화하는 스마트 주차 타워 시스템입니다.",
      goals: [
        "차량 입출차 시 차단기 서보모터의 정확한 각도 제어(PWM) 및 안전 개폐 시퀀스 구현",
        "주차 슬롯별 입차/출차 상태를 실시간으로 추적하고 만차/공차 여부에 따라 현장 LED 및 Qt 화면을 즉각 동기화",
        "STM32 펌웨어와 Qt GUI 간의 신뢰성 있는 커스텀 UART 패킷 송수신",
      ],
      myContributions: [
        "입출차 차단기용 서보모터(Servo Motor) PWM 각도 제어 드라이버 및 자동 닫힘 로직 구현",
        "주차장 내 차량 슬롯(Slot) 점유 상태 배열 관리 및 입출차 시 가용 슬롯 계산 알고리즘 작성",
        "슬롯 상태 및 경고 안내를 위한 현장 다채널 LED 컨트롤 로직 구현 및 Qt 관제 파트와의 시리얼 연동 테스트",
      ],
    },
    techStack: [
      {
        name: "STM32 (C Firmware)",
        reason: "현장 센서 입력 처리와 서보모터(PWM) 및 주차 안내 LED를 실시간으로 제어하는 하위 컨트롤러",
      },
      {
        name: "UART Serial Communication",
        reason: "STM32 보드의 슬롯 변화 이벤트를 PC의 Qt 관제 화면에 지연 없이 전달하고 원격 개폐 명령을 수신",
      },
      {
        name: "Qt (C++ GUI Integration)",
        reason: "관리자가 주차장 전체 슬롯 현황과 입출차 로그를 시각적으로 모니터링하고 제어할 수 있는 대시보드 환경",
      },
    ],
    designDecisions: [
      {
        id: "p5-arch-1",
        title: "차량 슬롯 상태 관리 테이블 설계 및 이벤트 기반 Qt 관제 동기화",
        problem:
          "단순히 입차/출차 센서 신호만 상위 PC로 토스하면 하위 하드웨어(LED, 차단기)와 상위 GUI 간의 주차 가능 대수 상태가 불일치하거나 만차 시에도 차단기가 열리는 문제가 발생할 수 있었습니다.",
        comparison: {
          optionA: {
            name: "센서 Raw 신호만 송신하고 모든 판단을 PC에 의존",
            desc: "통신 지연이나 케이블 연결 문제 발생 시 현장 차단기와 안내 LED가 오작동할 위험이 큼.",
          },
          optionB: {
            name: "STM32 내부 슬롯 상태 배열 관리 + 상태 변경 이벤트 패킷 송신",
            desc: "STM32가 슬롯 점유 상태를 직접 관리하며 만차 시 차단기 개방을 자체 차단(Interlock)하고, 상태 변화 시점에 정형화된 패킷으로 Qt GUI를 갱신.",
            isSelected: true,
          },
          whySelected:
            "하위 제어기가 현장 안전 제어(만차 시 진입 제한, 서보모터 제어, LED 점등)의 주도권을 가지면서도 상위 관제 UI와 정확히 상태를 일치시키기 위해 선택했습니다.",
        },
        impact:
          "입출차 시 현장 LED 점멸, 서보모터 차단기 작동, 그리고 Qt 화면의 슬롯 색상 변화가 오차 없이 실시간으로 연동되었습니다.",
        codeSnippet: `// 주차 슬롯 상태 업데이트 및 차단기/LED/UART 연동 의사 코드
void Parking_UpdateSlot(uint8_t slot_idx, uint8_t is_occupied) {
    parking_slots[slot_idx] = is_occupied;
    LED_UpdateSlotStatus(slot_idx, is_occupied); // 현장 LED 즉시 반영

    if (Parking_GetAvailableCount() == 0) {
        LED_SetFullSign(1); // 만차 경고등 점등 및 진입 차단기 인터락
    }
    UART_SendSlotSyncPacket(slot_idx, is_occupied); // Qt GUI 실시간 동기화
}`,
      },
    ],
    troubleshooting: [
      {
        id: "p5-ts-1",
        title: "[트러블슈팅] 서보모터 구동 시 급격한 전류 소모와 채터링으로 인한 오작동 해결",
        issue:
          "차단기 서보모터가 0도에서 90도로 급격히 회전할 때 순간적인 전류 소모와 신호 흔들림으로 인해 차단기가 떨리거나(Jitter) 연속 입차 시 닫힘 타이밍이 겹치는 문제가 있었습니다.",
        rootCause: [
          "서보모터의 요구 주기(20ms, 50Hz)와 펄스 폭(1ms~2ms) 설정이 정밀하지 않으면 목표 각도에서 헌팅(Hunting)이 발생함.",
          "차량이 완전히 통과하기 전에 타이머가 만료되면 차단기가 조기에 내려올 위험이 있음.",
        ],
        solution:
          "타이머 분주비와 CCR 값을 50Hz 표준 서보 규격에 맞게 정밀 튜닝하고, 차량 통과 상태 확인 후 일정 유지 시간을 거친 뒤 닫히도록 차단기 제어 시퀀스를 안정화했습니다.",
        learned:
          "모터 제어와 상위 GUI 관제를 처음으로 엔드투엔드 연동해 보면서, 이후 진행한 'JOJIMARA' 프로젝트의 테이블 기반 프로토콜 파서와 모듈화 드라이버를 설계하는 데 큰 밑거름이 되었습니다.",
      },
    ],
  },
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

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalStyle;
      clearTimeout(timer);
      previousActiveElement.current?.focus();
    };
  }, [project]);

  // [a11y] 2. ESC 키 닫기 및 Focus Trap
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
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
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
        {/* Backdrop */}
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
          {/* 1. 모달 헤더 */}
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

          {/* 모달 본문 */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-10">
            {/* 2. 개요 및 기술 스택 */}
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
                  👥 팀 구성 및 역할:{" "}
                  <span className="text-slate-900 dark:text-slate-200">{project.teamAndRole}</span>
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
                      🛠️ 내가 기여한 부분 (담당 구현)
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

            {/* 3. 설계 및 아키텍처 고민 */}
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

                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong className="font-semibold text-slate-900 dark:text-white block mb-1">
                        📌 문제 정의 및 구조적 고민:
                      </strong>
                      {decision.problem}
                    </div>

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

                    <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Lightbulb
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            채택 이유:{" "}
                          </strong>
                          {decision.comparison.whySelected}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            결과 및 시사점:{" "}
                          </strong>
                          {decision.impact}
                        </p>
                      </div>
                    </div>

                    {decision.codeSnippet && (
                      <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Architecture Code Snippet</span>
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

            {/* 4. 트러블슈팅 및 문제 해결 */}
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
                              <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                                <div className="font-bold text-rose-800 dark:text-rose-300 mb-1">
                                  🚨 증상 및 문제 발생 (Issue)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.issue}
                                </p>
                              </div>

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

                              {ts.logOrCode && (
                                <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                                    <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Verification Log / Code</span>
                                  </div>
                                  <pre className="text-xs font-mono leading-relaxed">
                                    <code>{ts.logOrCode}</code>
                                  </pre>
                                </div>
                              )}

                              <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                                <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                                  🛠️ 해결 방안 및 적용 (Solution)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.solution}
                                </p>
                              </div>

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

          {/* 5. 모달 푸터 */}
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

const THEME_GRADIENTS: Record<string, string> = {
  indigo: "from-slate-900 via-indigo-950 to-slate-900",
  emerald: "from-slate-900 via-emerald-950 to-slate-900",
  cyan: "from-slate-900 via-cyan-950 to-slate-900",
  amber: "from-slate-900 via-amber-950 to-slate-900",
  rose: "from-slate-900 via-rose-950 to-slate-900",
  violet: "from-slate-900 via-violet-950 to-slate-900",
};

export default function DeveloperPortfolio() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

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
                베어메탈 펌웨어와 FPGA 디지털 로직부터 Linux 디바이스 드라이버까지 보유한 기술 스택입니다.
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
                Featured Projects ({PROJECTS_DATA.length})
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                카드를 클릭하면 아키텍처 설계 고민과 오실로스코프·커널 로그 기반 트러블슈팅 과정을 상세히 확인하실 수 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS_DATA.map((project, index) => {
                const gradientClass =
                  THEME_GRADIENTS[project.thumbnailTheme || "indigo"] || THEME_GRADIENTS.indigo;

                return (
                  <motion.article
                    key={project.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-500/50 transition-all duration-200"
                  >
                    <div>
                      {/* 프로젝트별 맞춤 썸네일 영역 (사진 또는 커스텀 배너) */}
                      <div
                        role="img"
                        aria-label={project.thumbnailPrompt}
                        className={`relative h-52 bg-gradient-to-br ${gradientClass} flex flex-col justify-between overflow-hidden`}
                      >
                        {project.thumbnailUrl ? (
                          <>
                            <img
                              src={project.thumbnailUrl}
                              alt={project.thumbnailPrompt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/30" />
                            {project.thumbnailBadgeLeft && (
                              <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-mono font-semibold rounded bg-slate-900/80 text-white backdrop-blur-xs border border-white/15">
                                {project.thumbnailBadgeLeft}
                              </span>
                            )}
                          </>
                        ) : (
                          <div className="p-6 h-full flex flex-col justify-between">
                            <div className="flex items-center justify-between z-10 gap-2">
                              <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-white/10 text-white border border-white/20 truncate">
                                {project.thumbnailBadgeLeft || project.techStack[0]?.name}
                              </span>
                              <span className="px-2.5 py-1 text-xs font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                                {project.thumbnailBadgeRight || "VERIFIED"}
                              </span>
                            </div>

                            <div className="z-10 my-auto">
                              <div className="text-xs font-mono text-indigo-200/90 mb-1 truncate">
                                {project.thumbnailCenterSub ||
                                  project.techStack.map((t) => t.name).slice(0, 2).join(" • ")}
                              </div>
                              <div className="text-lg font-bold text-white tracking-tight line-clamp-1">
                                {project.thumbnailCenterMain || project.title}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300/80 z-10">
                              <span>{project.thumbnailFooterLeft || project.period}</span>
                              <span>{project.thumbnailFooterRight || "Hardware & Firmware"}</span>
                            </div>
                          </div>
                        )}
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
                );
              })}
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