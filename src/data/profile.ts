import { SkillCategory } from "@/types/portfolio";

export const DEVELOPER_INFO = {
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

export const SKILLS_DATA: SkillCategory[] = [
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