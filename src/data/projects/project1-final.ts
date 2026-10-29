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
      issue: "미정",
      rootCause: ["미정", "미정"],
      solution: "미정",
      learned: "미정",
    },
  ],
};