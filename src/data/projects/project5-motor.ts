import { ProjectDetail } from "@/types/portfolio";

export const project5Motor: ProjectDetail = {
  id: "project-4-motor",
  title: "STM32 레지스터 직접 제어 기반 양방향 DC 모터 제어 시스템",
  subtitle: "HAL 추상화 의존도를 낮추고 타이머(TIM) 및 GPIO 레지스터 직접 조작으로 구현한 정밀 모터 드라이버",
  period: "2026.07 ~ 2026.08",
  teamAndRole: "개인 프로젝트 (베어메탈 레지스터 제어, 타이머 PWM 설계 및 방향 전환 상태 머신 구현)",
  contribution: "펌웨어 설계 및 하드웨어 구현 100%",
  thumbnailPrompt: "STM32 레지스터 직접 제어를 통한 양방향 DC 모터 PWM 및 상태 머신 제어",
  // thumbnailUrl: "/motor-control.png",
  thumbnailTheme: "amber",
  thumbnailBadgeLeft: "Bare-metal C / STM32",
  thumbnailBadgeRight: "TIM PWM & Dead-time",
  thumbnailCenterSub: "Direct Register Manipulation (RCC/GPIO/TIM)",
  thumbnailCenterMain: "양방향 DC 모터 정밀 제어",
  thumbnailFooterLeft: "1-Sec Stop Interlock",
  thumbnailFooterRight: "32-bit TIM2 / PWM Control",
  githubUrl: "https://github.com/rlagudwls5518/M4_miniProject",
  reportPdfUrl: "/motor/motor.pdf",
  overview: {
    background:
      "고수준 라이브러리(HAL)가 내부적으로 어떻게 하드웨어를 구동하는지 밑바닥부터 파악하기 위해, 데이터시트와 레퍼런스 매뉴얼을 기반으로 클럭(RCC), GPIO, 타이머(TIM) 레지스터를 직접 조작하여 구현한 양방향 DC 모터 제어 시스템입니다.",
    goals: [
      "RCC, GPIO, TIM 레지스터 비트 필드를 직접 제어하여 원하는 주파수와 듀티비의 PWM 파형 생성",
      "정회전(CW) ↔ 역회전(CCW) 급격한 전환 시 역기전력 및 과전류로 인한 모터 드라이버 소손을 방지하는 안전 상태 머신 설계",
      "오실로스코프를 통한 PWM 듀티비 및 방향 전환 시퀀스 타이밍 실측 검증",
    ],
    myContributions: [
      "데이터시트 기반 타이머 PSC, ARR, CCR 계산 및 직접 제어",
      "방향 전환 요청 시 즉시 정지 후 1초간 대기했다가 반대 방향으로 구동하는 하드웨어 보호용 FSM 구현",
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
        "반복적인 정/역회전 전환 테스트에서도 전원 강하나 드라이버 발열 없이 안정적인 모터 제어를 달성했습니다.",
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
    id: "ts-1",
    title: "[트러블슈팅] 모터 상태 제어 변수 기준 모호성에 따른 오작동 문제 해결",
    issue:
      "버튼 입력에 따른 모터 방향 전환 로직 구현 시, 모터 속도 제어 및 UART 통신 입력 처리 로직이 꼬이며 제어 기준이 모호해지는 현상이 발생했습니다.",
    rootCause: [
      "'이전 상태(prev)'를 기준으로 '다음 상태'를 결정하도록 설계하여 과거와 현재의 시점이 혼재되었고, 단순 기록용 변수와 제어 결정용 변수의 역할이 불일치했습니다."
    ],
    solution:
      "제어의 기준을 '현재 사용자가 보고 있는 모터의 동작 상태(curr_state)'를 최우선 기준으로 삼도록 상태 제어 모델을 전면 재정의하여 직관적인 상태 전환을 구현했습니다.",
    learned:
      "하드웨어 동작을 코드로 구현할 때는 변수의 네이밍과 역할이 정확히 일치해야 하며, 머릿속 주먹구구식 코딩이 아닌 명확한 상위 설계와 직관적인 상태 기준점 설정이 필수적임을 깨달았습니다.",
    logOrCode: `// [변경 전] 과거(prev) 기준의 모호한 상태 제어
// (prev == MOTOR_STOP) -> curr = 저장된 값, prev = 저장된 값
// (prev == MOTOR_CW)   -> curr = MOTOR_CCW, prev = MOTOR_CCW

// [변경 후] 현재 동작(curr) 기준의 직관적인 제어 (실제 구현 코드)
if(curr_state == MOTOR_STOP){ // 현재 돌아가는 상태 기준
    if(prev_state == MOTOR_STOP){
        curr_state = MOTOR_CW;
        prev_state = MOTOR_CW;
    }
    else if(prev_state == MOTOR_CW){
        curr_state = MOTOR_CW;
        prev_state = MOTOR_STOP;
    }
    else if(prev_state == MOTOR_CCW){
        curr_state = MOTOR_CCW;
        prev_state = MOTOR_STOP;
    }
}
else if(curr_state == MOTOR_CW){ // 현재 돌아가는 상태 기준
    prev_state = MOTOR_CW;
    curr_state = MOTOR_CCW;
}
else if(curr_state == MOTOR_CCW){ // 현재 돌아가는 상태 기준
    prev_state = MOTOR_CCW;
    curr_state = MOTOR_CW;
}`
  },
  {
    id: "ts-2",
    title: "[트러블슈팅] 스타트업 파일(.s)과 C 코드 ISR 함수명 불일치로 인한 인터럽트 미발생 문제",
    issue:
      "버튼 입력 또는 타이머/UART 동작 시 인터럽트가 아예 발생하지 않거나 시스템이 멈추어 해당 함수로 진입하지 못하는 현상이 발생했습니다.",
    rootCause: [
      "임베디드 MCU(ARM Cortex-M)의 스타트업 파일 벡터 테이블에 약속된 핸들러 이름(예: EXTI0_IRQHandler)이 아닌 임의의 함수명(예: my_key_isr)으로 C 코드를 작성하여 ISR이 매핑되지 않았습니다."
    ],
    solution:
      "C 코드의 인터럽트 핸들러 함수명을 스타트업 파일의 벡터 테이블에 정의된 표준 이름과 동일하게 동기화하여 인터럽트 발생 및 진입을 정상화했습니다.",
    learned:
      "하드웨어와 소프트웨어를 연결하는 인터럽트 벡터 테이블의 동작 원리와 로우레벨(Low-level)에서의 약속된 구조를 이해하게 되었으며, 하드웨어 제어 시 레퍼런스 확인의 중요성을 체감했습니다.",
    logOrCode: `// [문제 발생] 임의로 작성한 인터럽트 함수명 (벡터 테이블과 불일치)
// void my_key_isr(void) { ... }

// [해결] 스타트업 파일(.s)에 정의된 표준 IRQHandler 이름으로 동기화
void EXTI0_IRQHandler(void) {
    if (EXTI->PR & (1 << 0)) {
        EXTI->PR |= (1 << 0); // Pending bit clear
        // 인터럽트 처리 로직
    }
}`
  },
  {
    id: "ts-3",
    title: "[트러블슈팅] UART 속도 입력 시 모터 제어 루프의 오작동 방어 로직 구현",
    issue:
      "모터가 이미 특정 방향으로 정상 회전 중일 때 UART로 속도 변경 명령을 전송하면, 속도만 변경되지 않고 방향 전환 명령으로 인지되어 모터가 정지 후 재시작되는 현상이 발생했습니다.",
    rootCause: [
      "현재 모터가 돌고 있는지를 기록하는 상태 업데이트가 누락되어, 속도 변경 시에도 방향을 바꾸는 상태 전환 루프(Motor_Main)로 불필요하게 진입했습니다."
    ],
    solution:
      "모터의 실제 회전 유무를 기억하는 \`running_state\` 변수를 추가하고, 이미 동일한 방향으로 회전 중일 경우 상단에서 분기하여 단순 PWM 속도값만 즉시 반영되도록 예외 처리했습니다.",
    learned:
      "외부 인터럽트(UART) 입력이 메인 루프에 미치는 영향을 고려할 때, 하드웨어의 현재 동작 상태를 정확히 추적하는 동기화 로직이 필수적이라는 것을 배웠습니다.",
    logOrCode: `// UART 속도 변경 시 오작동 방어 로직 추가
static MotorState running_state = MOTOR_STOP;

void Motor_Main(void) {
    // 이미 같은 방향으로 돌고 있다면 상태 전환 로직 패스 (속도 PWM만 갱신)
    if (running_state == curr_state) {
        Update_Motor_PWM(current_speed);
        return; 
    }
    
    // 이후 방향 전환 로직 수행 및 running_state 갱신
    // ...
    running_state = curr_state;
}`
  },
  {
    id: "ts-4",
    title: "[트러블슈팅] 타이머 레지스터 부작용에 의한 가짜 플래그 및 즉시 타임아웃 문제 해결",
    issue:
      "버튼 입력 시 3초를 측정하기 위해 Timer2를 시작하면, 3초를 세지 않고 즉시 타임아웃 인터럽트로 진입하는 오류가 발생했습니다.",
    rootCause: [
      "타이머 시작 전 카운터를 초기화하기 위해 TIM2->EGR의 UG 비트를 세팅하는 과정에서 갱신 이벤트가 소프트웨어적으로 강제 발생하여, SR의 UIF 비트가 세팅(가짜 플래그)되며 발생한 문제였습니다."
    ],
    solution:
      "인터럽트(DIER)를 끈 상태에서 EGR로 초기화를 진행하고, 이때 발생한 SR 플래그를 확실하게 클리어한 뒤 비로소 타이머 카운터(CR1)와 인터럽트(DIER)를 켜도록 레지스터 제어 순서를 재정렬했습니다.",
    learned:
      "레지스터 비트 연산 시 단순 설정뿐만 아니라 파생되는 하드웨어적 사이드 이펙트(플래그 세팅)를 완벽히 이해해야 하며, 인터럽트를 켜기 전 펜딩된 플래그를 지워야 한다는 타이머 제어의 핵심 원칙을 확립했습니다.",
    logOrCode: `// [문제 발생 코드] EGR 세팅 후 가짜 플래그로 인해 즉시 ISR 진입
// void Timer2_Start() {
//     Macro_Set_Bit(TIM2->EGR,0);
//     Macro_Clear_Bit(TIM2->SR, 0);
//     Macro_Set_Bit(TIM2->CR1, 0);
// }

// [해결 코드] 레지스터 설정 순서 재정렬
void Timer2_Start(void)
{
    // 1. DIER을 먼저 꺼서 EGR에 의한 가짜 인터럽트가 NVIC로 전달되는 것을 방지
    Macro_Clear_Bit(TIM2->DIER, 0); 
    
    // 2. EGR 비트를 세팅하여 CNT 및 프리스케일러 0으로 강제 초기화 (이때 SR의 UIF가 1이 됨)
    Macro_Set_Bit(TIM2->EGR, 0);    
    
    // 3. EGR이 발생시킨 가짜 갱신 플래그(SR)를 반드시 지움!
    Macro_Clear_Bit(TIM2->SR, 0);   
    
    // 4. 깨끗해진 상태에서 타이머 카운터(CR1)와 인터럽트(DIER)를 비로소 시작!
    Macro_Set_Bit(TIM2->CR1, 0);    
    Macro_Set_Bit(TIM2->DIER, 0);   
}`
  }
]
};