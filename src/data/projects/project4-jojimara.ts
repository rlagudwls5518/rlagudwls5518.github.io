import { ProjectDetail } from "@/types/portfolio";

export const project4Jojimara: ProjectDetail = {
  id: "jojimara-v1",
  title: "JOJIMARA (졸지마라)",
  subtitle: "Jetson Orin Nano와 STM32를 이용한 AI 졸음운전 자동차 관제 및 실시간 제어 시스템",
  period: "2026.09.08 ~ 2026.09.14",
  teamAndRole: "3인 팀 프로젝트 (임베디드 펌웨어 및 하드웨어 회로 설계 전담)",
  contribution: "펌웨어 & 회로 설계 100% (전체 시스템 기여도 40%)",
  thumbnailPrompt: "STM32 하드웨어 설계도 및 도로주행/졸음감지 AI 실시간 카메라 관제 화면",
  thumbnailUrl: "",
  thumbnailTheme: "indigo",
  thumbnailBadgeLeft: "DROWSINESS ALERT! WAKE UP!",
  thumbnailBadgeRight: "UART 115200bps ACK_OK",
  thumbnailCenterSub: "Jetson Orin Nano ↔ STM32F4",
  thumbnailCenterMain: "AI 졸음운전 관제 & 임베디드 제어 시스템",
  thumbnailFooterLeft: "TIM2/TIM3 PWM Control",
  thumbnailFooterRight: "1ms Non-blocking ISR",
  githubUrl: "https://github.com/rlagudwls5518/jojimara",
  reportPdfUrl: "/jojimara/jojimara.pdf",
  overview: {
    background:
      "대한상공회의소 서울기술교육센터에서 진행한 프로젝트로, 주행 중 운전자의 졸음 상태 및 도로 상황(터널 진입/탈출, 차선/차량 인식)을 Edge AI(Jetson Orin Nano)로 실시간 분석하고, 즉각적으로 차량 내 액추에이터(경고 부저, 환기용 에어컨/공기청정기 모터, 다채널 경고 LED)를 정밀 제어하는 통합 관제 시스템입니다.",
    goals: [
      "Jetson Orin Nano(상위 제어기)와 STM32(하위 제어기) 간의 실시간 양방향 UART 통신 규격 확립",
      "다수의 액추에이터(DC 모터 2개, 피에조 부저, 다채널 LED)가 동시에 동작하더라도 명령 수신이 지연되지 않는 1ms 논블로킹 펌웨어 아키텍처 구현",
      "하드웨어 회로 설계부터 레지스터 레벨 PWM 제어, 리눅스 커널 레벨 통신 엔드투엔드 신뢰성 확보",
    ],
    myContributions: [
      "STM32 MCU 주변 회로 및 DC 모터 드라이버, 피에조 부저, 다채널 LED 하드웨어 회로도 설계 및 브레드보드 구성",
      "Jetson Orin Nano - STM32 간 텍스트 기반 UART 프로토콜 정의 및 인터럽트/테이블 파싱 함수 개발",
      "TIM2/TIM3 레지스터 직접 조작을 통한 모터 속도 PWM 및 피에조 부저 드라이버 개발",
      "비트마스크 연산 기반 다중 상태 LED 점멸 제어 및 1ms 시스템 틱 기반 비동기 태스크 스케줄링 구현",
    ],
  },
  techStack: [
    {
      name: "STM32 (C / Firmware)",
      reason: "실시간성이 중요한 차량 액추에이터 제어를 위해 TIM, UART 직접 접근 및 인터럽트 제어에 최적화된 MCU 채택",
    },
    {
      name: "UART Interrupt & Custom Protocol",
      reason: "Jetson-STM32 간 명확한 명령 전달과 ACK/NACK 기반의 상태 동기화 및 디버깅 가시성 확보",
    },
    {
      name: "TIM Register PWM (TIM2, TIM3)",
      reason: "HAL 기본 함수의 오버헤드를 줄이고 모터 속도 제어 및 부저 주파수/듀티비를 정밀하게 가변하기 위해 ARR/CCR 직접 조작",
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
      title: "테이블 기반 커맨드 아키텍처",
      problem:
        "Jetson으로부터 수신하는 제어 명령(졸음 경고, 터널 진입/탈출, 좌/우측 위험, 에어컨 제어 등)이 늘어남에 따라, 단순 분기문으로 처리할 경우 코드 가독성이 떨어지고 명령 추가 시 유지보수가 어려워지는 구조적 한계가 있었습니다.",
      comparison: {
        optionA: {
          name: "다중 if-else / switch 분기문",
          desc: "구현은 단순하나 문자열 비교가 중첩되어 파싱 루틴이 비대해지고, 새로운 센서/액추에이터 명령 추가 시 파서 코어 로직을 매번 수정해야 함.",
        },
        optionB: {
          name: "CommandEntry 구조체 배열 & 함수 포인터 매핑",
          desc: "명령어 문자열과 실행할 콜백 함수 포인터를 구조체 테이블(cmd_table)로 분리 정의하고, 인터럽트에서 파싱 완료 시 테이블을 순회하며 매핑된 함수를 즉각 호출.",
          isSelected: true,
        },
        whySelected:
          "파싱 엔진과 실제 제어 비즈니스 로직을 완벽히 분리하여, 신규 명령이 추가되더라도 cmd_table에 엔트리 한 줄만 추가하면 되도록 확장성을 생각했고 정의되지 않은 명령 수신 시 일관되게 NACK_INVALID_CMD 피드백을 반환하도록 표준화했습니다.",
      },
      impact:
        "애플리케이션 담당 팀원과의 협업 시 사전 합의된 인터페이스 정의서와 1:1로 매핑되는 클린 코드를 유지했으며, 만약 명령어 추가 및 수정이 필요한 경우 간편하게 수정이나 추가가 가능하도록 설계함.",
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
        title: "DCMotor_t 구조체 캡슐화를 통한 멀티 액추에이터 드라이버 재사용",
        problem:
          "에어컨과 공기청정기를 대체하는 2개의 DC 모터를 제어할 때, 하드웨어 핀과 타이머 채널마다 중복 코드를 작성하면 펌웨어 결합도가 높아지는 문제가 있었습니다.",
        comparison: {
          optionA: {
            name: "액추에이터별 개별 함수 및 전역 변수 나열",
            desc: "aircon_On(), airpurifier_On() 등 하드웨어 채널별로 함수를 중복 작성하여 상태 동기화가 복잡해짐.",
          },
          optionB: {
            name: "DCMotor_t 구조체 캡슐화 & 레지스터 포인터 직행",
            desc: "제어 핀과 TIM2 채널 정보를 DCMotor_t 구조체로 추상화하여 단일 드라이버 코드로 다중 모터를 제어함.",
            isSelected: true,
          },
          whySelected:
            "하드웨어 의존성을 구조체 내부로 숨겨 재사용성을 높이고, 레지스터 포인터 직접 조작 방식을 선택하여 PWM 속도 변경 시 오버헤드 최소화 및 실시간성 확보함",
        },
        impact:
          "단일 드라이버 로직으로 2개의 모터를 완벽히 제어하고, 코드 중복을 50% 이상 줄이고, 확장성이 높은 모듈형 드라이버 계층 구축함.",
        codeSnippet: `// DCMotor_t 구조체 기반 경량 캡슐화 및 레지스터 포인터 직접 조작 구현
void dcmotor_init(DCMotor_t *motor, GPIO_TypeDef *port, uint8_t in1, uint8_t in2, volatile uint32_t *ccr) {
    motor->dir_port = port;
    motor->pin_in1  = in1;
    motor->pin_in2  = in2;
    motor->ccr      = ccr;
    dcmotor_stop(motor);
}

void dcmotor_start(DCMotor_t *motor, uint32_t speed) {
    Macro_Clear_Bit(motor->dir_port->ODR, motor->pin_in1);
    Macro_Set_Bit(motor->dir_port->ODR, motor->pin_in2);
    *(motor->ccr) = speed; // HAL 함수 없이 CCR 레지스터에 직접 값 대입
}`,
      },
  ],
  troubleshooting: [
    {
      id: "ts-1",
      title: "[트러블슈팅 1] 블로킹 지연으로 인한 Jetson 수신 타임아웃 해결",
      issue:
        "Jetson Orin Nano에서 졸음 감지 등의 명령을 송신한 후 STM32의 응답을 대기할 때 간헐적으로 수신 타임아웃이 발생하여, 상위 관제 시스템의 상태 동기화가 실패하고 차량 안전 경보 시퀀스가 지연되는 현상이 발생했습니다.",
      rootCause: [
        "초기 STM32 펌웨어 내 액추에이터(모터 10초 구동 유지함수 내에) 제어 로직에 블로킹 방식의 지연 함수가 사용됨.",
        "지연 함수가 수행되는 동안 CPU 점유가 독점되면서, 그 사이에 들어오는 Jetson의 상태 질의 및 연속 명령에 대해 즉각적인 패킷 파싱과 ACKOK 전송 타이밍을 충족하지 못함.",
      ],
      images: [
        {
          url: "/jojimara/time_out.png", // 타임 아웃발생사진
          caption: "Jetson -> stm32 로 데이터를 보내고 수신이 안되는 상황",
        },
        {
          url: "/jojimara/ack_ok.png", // 수신완료 사진
          caption: "응답 지연 수정후 올바르게 수신하는 상황",
        },
      ],
      logOrCode: `// [Before] 블로킹 제어로 인해 CPU가 독점되어 UART 응답 지연 발생
void Buzzer_Alert_Blocking(void) {
    Buzzer_On();
    HAL_Delay(250); // 250ms 동안 다른 명령 처리 및 ACK 송신 불가!
    Buzzer_Off();
    HAL_Delay(250);
}

// [After] 1ms 타이머 인터럽트(TIM1/SysTick) 기반 논블로킹 상태 머신
void TIM1_UP_TIM10_IRQHandler()
{
    // TIM1 인터럽트 플래그 확인 및 클리어
    if (Macro_Check_Bit_Set(TIM1->SR, 0))
    {
        Macro_Clear_Bit(TIM1->SR, 0); // 플래그를 지워야 무한 루프에 안 빠짐

        app_motor_1ms_ISR(); -> 모터 10초 구동 인터럽트
        app_buzzer_interrupt(); ->  부저 250ms 삐삐삐 소리 껏다가 키는 인터럽트
        led_interrupt(); -> 전방 위험 led 인터럽트
    }
}
}`,
      solution:
        "모든 `Delay` 함수를 제거하고 1ms 타이머 인터럽트(app_motor_1ms_ISR 등) 기반의 논블로킹 아키텍처로 전면 재설계했습니다. 1ms 인터럽트 내부에서는 단순히 상태 플래그와 틱 카운트만 증가시켜 인터럽트 지연을 최소화하고, 실제 모터(10초 자동 OFF)와 부저(250ms 단속음) 제어는 각 드라이버 모듈에서 비동기로 분기 처리하도록 구현했습니다.",
      learned:
        "Jetson 측 명령 송신 즉시 지연 없이 `ACKOK\\r\\n` 응답을 100% 실시간 수신 완료했습니다. 임베디드 시스템에서 다중 액추에이터를 제어할 때 시간 지연을 이벤트/틱 기반으로 분리하는 비동기 설계가 시스템 전체의 실시간 응답성을 결정짓는다는 점을 체득했습니다.",
    },
    {
      id: "ts-2",
      title: "[트러블슈팅 2] JetPack 6.x 내부 UART DMA 결함 규명 및 통신 무결성 확보",
      issue:
        "Jetson의 40-pin GPIO UART(/dev/ttyTHS1)를 통해 STM32와 통신할 때, 7바이트 이하의 짧은 패킷은 정상 수신되나 8바이트 이상의 패킷 수신 시 데이터가 0x00으로 덮어써지는 현상이 발생했습니다.",
      rootCause: [
        "가설 검증을 통한 3단계 디버깅(SW → HW → OS Kernel) 수행:",
        "1단계 [SW 로직 검증]: STM32 내부 함수 흐름 및 UART2 레지스터 레벨 전송 버퍼 확인 → 정상 송출 확인.",
        "2단계 [HW 전기적 신호 검증]: 오실로스코프로 STM32 Tx 라인 파형을 직접 측정 → (ACKOKK\\r\\n) 정상 출력 확인.",
        "3단계 [Jetson 커널 로그 분석]: 리눅스 `dmesg` 로그를 분석하여 8바이트 수신 시점의 SMMU 메모리 보호장치 위반 에러 포착.",
        "근본 원인 규명: 7바이트 이하는 FIFO로 동작하나 8바이트부터 활성화되는 내부 UART DMA 컨트롤러가 JetPack 6.x 버전의 디바이스 트리 매핑 결함으로 인해 메모리 쓰기가 차단되는 NVIDIA 공식 보고 이슈임을 확인.",
      ],
      images: [
        {
          url: "/jojimara/jojimara_osil.jpg", // 오실로스코프 파형 사진
          caption: "2단계 HW 검증: STM32 Tx 라인 오실로스코프 파형 실측 (ACKOKK\\r\\n)",
        },
        {
          url: "/jojimara/jojimara_cmd.png", // 커널 로그 캡처 사진
          caption: "3단계 커널 로그: JetPack 6.x SMMU Unhandled context fault 발생",
        },
      ],
      solution:
        "커널 드라이버의 DMA 결함이 존재하는 온보드 GPIO ttyTHS1 인터페이스를 대체하여, 검증된 USB-to-UART 컨트롤러 기반의 통신 경로(/dev/ttyACM0 ↔ STM32 USART2)로 하드웨어/소프트웨어 인터페이스를 신속히 우회 설계하고, 종단 문자(\\r\\n)를 포함한 8바이트 초과 장문 ASCII 패킷 파싱 테스트를 재수행했습니다.",
      learned:
        "0x00 덮어쓰기 및 패킷 깨짐 현상을 100% 해결하고, 115200 bps 환경에서 장문 패킷의 완벽한 데이터 무결성을 확보했습니다. 특히 문제가 발생했을 때 막연한 추측이 아닌 SW 코드 → 오실로스코프 파형 측정 → OS 커널 로그 분석으로 이어지는 계층적 디버깅 방법론의 강력한 위력을 입증한 경험이었습니다.",
    },
  ],
};