import { ProjectDetail } from "@/types/portfolio";

export const project2Fpga: ProjectDetail = {
  id: "project-2-fpga",
  title: "RTC 기반 스마트 공조기 제어 시스템 (FPGA)(수정중)",
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
};