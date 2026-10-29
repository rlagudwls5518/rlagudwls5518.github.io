import { ProjectDetail } from "@/types/portfolio";

export const project2Fpga: ProjectDetail = {
  id: "project-2-fpga",
  title: "Verilog 기반 전자레인지 (FPGA)(수정중)",
  subtitle: "Digilent Basys 3 FPGA와 Verilog HDL을 활용한 하드웨어 레벨 전자레인지 시스템",
  period: "2026.10",
  teamAndRole: "개인 설계 프로젝트 (Verilog RTL 모듈 설계, FSM 제어기 및 합성/검증)",
  contribution: "RTL 모듈 설계 및 하드웨어 통합 검증 100%",
  thumbnailPrompt: "Basys 3 FPGA 보드 기반 Verilog HDL 전자렌지 회로 및 동작",
  // thumbnailUrl: "/fpga-hvac.png",
  thumbnailTheme: "cyan",
  thumbnailBadgeLeft: "Verilog HDL / Basys 3",
  thumbnailBadgeRight: "FSM & UART FIFO",
  thumbnailCenterSub: "Xilinx Vivado • Hardware Logic Design",
  thumbnailCenterMain: "RTC 기반 전자레인지 (FPGA)",
  thumbnailFooterLeft: "PWM Motor & Buzzer",
  thumbnailFooterRight: "Zero-CPU Hardware Parallelism",
  githubUrl: "https://github.com/rlagudwls5518/FPGA_verilog",
  reportPdfUrl: "/FPGA1/microwave.pdf",
  overview: {
    background:
      "소프트웨어 개입 없이 순수 디지털 논리 회로만으로 로터리 엔코더, DC 팬 모터 PWM 제어, FND 디스플레이 및 피에조 부저를 병렬 처리하는 하드웨어 간이 전자레인지입니다.",
    goals: [
      "클럭 분주기와 유한 상태 머신을 이용한 정밀한 타이밍 제어 회로 설계",
      "FND 7-Segment 동적 구동, PWM 모터 속도 제어, 피에조 부저 효과음 생성 모듈의 완전 병렬 동작 구현",
    ],
    myContributions: [
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
      name: "Digilent Basys 3",
      reason: "실제 스위치/버튼 디바운싱, 7-Segment FND, 외부 모터/센서 PMOD 인터페이스를 하드웨어 레벨에서 검증",
    },
  ],
  designDecisions: [
    {
      id: "p2-arch-1",
      title: "2-Always 블록 기반 FSM 설계 및 계층적 모듈 분리",
      problem:
        "단일 Always 블록에 상태 천이, 다음 상태 조건, 출력 로직을 모두 혼용하면 합성 시 의도치 않은 래치가 생성되거나 타이밍 분석 및 디버깅이 까다로워지는 문제가 있었습니다.",
      comparison: {
        optionA: {
          name: "단일 블록 내 제어/연산 혼합 설계",
          desc: "코드 길이도 길고 순차 회로와 조합 회로의 경계가 모호해져 글리치 및 래치 발생 위험이 큼.",
        },
        optionB: {
          name: "순차/조합 로직을 분리한 2-Always FSM + Top-down 모듈화",
          desc: "클럭 동기화 상태 레지스터(r_curr_state <= r_next_state)와 다음 상태/출력 조합 로직(always @(*))을 명확히 분리하고, Tick/PWM/FND를 독립 IP처럼 모듈화.",
          isSelected: true,
        },
        whySelected:
          "Vivado가 명확한 상태 머신으로 인식하여 최적의 게이트 회로를 생성하게 하고, 모든 조건 분기에서 default 할당을 강제하여 래치 발생을 원천 차단하기 위해 채택했습니다.",
      },
      impact:
        "각 기능 모듈(FND, PWM, Buzzer, Rotary)을 독립적으로 시뮬레이션 검증한 뒤 Top 모듈에서 배선만으로 깔끔하게 통합할 수 있었습니다.",
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
        imageUrl: "/FPGA1/top_microwave.png", 
        imageCaption: "키캐드 설계도",
    },
  ],
  troubleshooting: [
    {
      id: "p2-ts-1",
      title: "[트러블슈팅] 서보모터 미작동 문제 및 하드웨어 핀 맵핑 오류",
      issue:
        "문열림/닫힘 버튼에서 열릴때는 부저가 울리는데 닫힐때 부저가 안울리는 문제 발생",
      rootCause: [
        "오실로스코프 파형 측정(JB 포트 A15/A14 핀)을 통해 확인한 결과, 하드웨어 핀 할당 오류로 추측",
      ],
      images: [
        {
          url: "/FPGA1/nobuzzer.jpg", // 오실로스코프 파형 사진
          caption: "초기 설정 한 A15 핀 출력 파형 -> 하드웨어 핀설정 다름 파악",
        },
        {
          url: "/FPGA1/buzzer.jpg",
          caption: "엉뚱한 핀에서 파형 발생 -> 핀설정 오류",
        },
      ],
      solution:
        "핀을 설계대로 다시 낌",
      learned:
        "하드웨어 선 하나하나가 모듈 동작하는데 큰 영향을 준다는 것을 알았음",
    },
    {
      id: "p2-ts-2",
      title: "[트러블슈팅] 부저 알림음 누락 현상",
      issue:
        "문 열림 시에는 부저가 울리지만 닫힐 때 소리가 나지 않던 현상",
      rootCause: [
        "door_en 신호가 토글될 때 상승 에지만 검출하도록 설계되어있어서 문이 열고 닫히는 전체 변화를 감지하지 못하지 않을까 하는 추측"
      ],
      images: [
        {
          url: "/FPGA1/servo.jpg", 
          caption: "열었을때 부저 pwm 출력 파형",
        },
        {
          url: "/FPGA1/noservo.jpg",
          caption: "닫았을때 부저 pwm 출력 파형",
        },
      ],
      logOrCode: `wire w_start_door = (door_en && !r_prev_door_en); // 상승에지만 검출
-> wire w_start_door = (door_en != r_prev_door_en); // 하강에지까지 다 검출`,
      solution:
        "이전 상태와 현재 상태의 불일치를 비교하는 조건문(door_en != r_prev_door_en)으로 변경하여 상승 에지와 하강 에지(문 열림/닫힘 양방향) 모두 정상적으로 인터럽트/상태 전이가 일어나도록 수정",
      learned:
        "",
    },
  ],
};