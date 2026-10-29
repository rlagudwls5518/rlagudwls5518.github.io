import { ProjectDetail } from "@/types/portfolio";

export const project6Parking: ProjectDetail = {
  id: "project-5-parking",
  title: "실시간 IoT 기반 스마트 주차 관제 시스템(수정중)",
  subtitle: "STM32 마이크로컨트롤러와 Qt(C++) GUI를 UART 시리얼 프로토콜로 연동한 주차 타워 통합 관리 시스템",
  period: "2026.08",
  teamAndRole: "3인 팀 프로젝트 (STM32 차단기 서보모터 제어, 차량 슬롯 상태 관리, 상태 표시 LED 제어 담당)",
  contribution: "STM32 액추에이터(서보/LED) 제어 및 슬롯 상태 관리 로직 전담",
  thumbnailPrompt: "STM32와 Qt C++ GUI 기반 실시간 스마트 주차 관제 시스템 화면 및 하드웨어",
  // thumbnailUrl: "/Qt/main.png",
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
};