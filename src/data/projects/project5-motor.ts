import { ProjectDetail } from "@/types/portfolio";

export const project5Motor: ProjectDetail = {
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
};