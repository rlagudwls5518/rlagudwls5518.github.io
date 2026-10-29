import { ProjectDetail } from "@/types/portfolio";

export const project3LinuxDriver: ProjectDetail = {
  id: "project-3-linux-driver",
  title: "스마트 선풍기 리눅스 디바이스 드라이버 & 멀티스레드 제어 시스템(수정중)",
  subtitle: "Jetson Orin Nano 기반 커널 디바이스 드라이버 연동 및 pthreads 멀티스레드 유저 애플리케이션 구현",
  period: "2026.10.09 ~ 2026.10.12",
  teamAndRole: "4인 팀 프로젝트 (유저 애플리케이션 아키텍처, 3개 워커 스레드, fan_api.h 추상화 및 통합 Makefile 전담)",
  contribution: "멀티스레드 & 드라이버 추상화 API & 빌드 시스템",
  thumbnailPrompt: "Jetson Orin Nano 리눅스 커널 디바이스 드라이버 및 멀티스레드 제어 아키텍처",
  // thumbnailUrl: "/Linux_driver/main.png",
  thumbnailTheme: "emerald",
  thumbnailBadgeLeft: "Linux Device Driver",
  thumbnailBadgeRight: "pthreads & Mutex",
  thumbnailCenterSub: "Kernel Space (/dev) ↔ User Space (fan_api.h)",
  thumbnailCenterMain: "스마트 선풍기 리눅스 드라이버 & 멀티스레드 시스템",
  thumbnailFooterLeft: "Single-Mutex State Snapshot",
  thumbnailFooterRight: "Unified Cross Makefile",
  githubUrl: "https://github.com/rlagudwls5518",
  reportPdfUrl: "/Linux_driver/device_driver.pdf",
  overview: {
    background:
      "Jetson Orin Nano 리눅스 환경에서 하드웨어 제어용 커널 디바이스 드라이버 모듈과 유저 공간 멀티스레드 제어 애플리케이션을 분리 설계하여, 사용자 입력·타이머·센서 데이터를 동시에 처리하는 스마트 선풍기 시스템입니다.",
    goals: [
      "커널 디바이스 드라이버와 유저 애플리케이션 간의 깔끔한 계층 분리(fan_api.h 추상화)",
      "입력, 타이머, 센서 3개의 워커 스레드가 동시에 동작할 때 데드락 및 레이스 컨디션 방지",
      "커널 모듈과 유저 애플리케이션을 단일 명령어로 빌드하는 통합 Makefile 구축",
    ],
    myContributions: [
      "전체 유저 공간 애플리케이션 아키텍처 설계 및 3개 워커 스레드(input, timer, sensor) 제어 로직 구현",
      "저수준 파일 시스템 콜을 캡슐화한 fan_api.h 하드웨어 추상화 인터페이스 정의",
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
      reason: "유저 공간에서 직접 하드웨어 레지스터를 건드리지 않고 커널 드라이버 노드(/dev/...)를 통해 안전하게 제어",
    },
    {
      name: "Single-Mutex SystemContext Pattern",
      reason: "다중 스레드 간 공유 변수 접근 시 락 순서 역전으로 인한 데드락을 차단하기 위한 설계",
    },
    {
      name: "GNU Make (Unified Makefile)",
      reason: "팀원들이 개발한 다수의 드라이버 모듈과 메인 앱의 빌드 과정을 표준화",
    },
  ],
  designDecisions: [
    {
      id: "p3-arch-1",
      title: "SystemContext 단일 뮤텍스(g_state_lock) 스냅샷 아키텍처 및 fan_api.h 계층 분리",
      problem:
        "3개의 워커 스레드(입력, 타이머, 센서)가 풍속, 타이머 잔여 시간, 현재 온도 등의 상태 변수를 동시에 읽고 쓸 때, 변수마다 개별 Mutex를 두면 락 획득 순서가 꼬여 데드락에 빠질 위험이 높았습니다.",
      comparison: {
        optionA: {
          name: "기능/변수별 다중 Mutex + 스레드 내 직접 드라이버 I/O 호출",
          desc: "lock(motor_mutex) 후 lock(timer_mutex)를 호출하는 식의 중첩 락 구조로 데드락 위험이 크고, 락을 잡은 채 느린 디바이스 I/O를 수행해 다른 스레드가 블로킹됨.",
        },
        optionB: {
          name: "SystemContext 단일 Mutex(g_state_lock) + 로컬 스냅샷 패턴",
          desc: "모든 공유 상태를 SystemContext 구조체 하나로 묶고 오직 단일 뮤텍스로만 보호. 임계 구역 안에서는 구조체 메모리 복사만 수행하고, 실제 하드웨어 제어는 락 해제 후 호출.",
          isSelected: true,
        },
        whySelected:
          "타이머 만료 시 timer_sec 변경뿐만 아니라 power -> OFF, fan_level -> 0, swing -> STOP이 상태를 공유한다고 생각했고, 락을 여러개 적용 할 경우 락을 획득하는 순서가 꼬일 가능성이 있기 때문입니다.",
      },
      impact:
        "커널 드라이버 팀원이 내부 구현을 수정하더라도 fan_api.h 인터페이스만 유지되면 애플리케이션 코드는 수정할 필요가 없었으며, 장시간 멀티스레드 스트레스 테스트에서도 경쟁 상태나 데드락 없이 안정적으로 동작했습니다.",
      codeSnippet: `typedef struct {
    PowerMode power;    // 0: OFF, 1: ON
    FanMode mode;   // 0: MAN, 1: AUTO
    int fan_level;   // 1 ~ 4
    SwingMode swing;    // 0: STOP, 1: SWING
    int temp;           // 온도
    int timer_sec;
    int display_visible;
} SystemContext;

static SystemContext g_ctx;
static pthread_mutex_t g_state_lock = PTHREAD_MUTEX_INITIALIZER;

// 임계 구역 최소화: Lock 내부에서는 로컬 스냅샷만 복사하고 I/O는 Lock 밖에서 수행
void* timer_thread_fn(void* arg) {
    SystemContext copy_run_value;

    while (g_running) {
        int hw_flag = 1;
        long now_ms = get_now_ms();

        pthread_mutex_lock(&g_state_lock);
        if (g_ctx.power) {
            int ret = timer_tick(now_ms);

            if (ret == 1) {
                g_ctx.power = 0;
                g_ctx.fan_level = 0;
                g_ctx.swing = 0;
                g_ctx.mode = 0;
                hw_flag = 0;
            }

            timer_get_display(&g_ctx.timer_sec, &g_ctx.display_visible, now_ms);
            if (setting_timer) {
                g_ctx.display_visible = ((now_ms / 500) % 2 == 0);
            }
        }

        copy_run_value = g_ctx;
        pthread_mutex_unlock(&g_state_lock);

        /* 하드웨어 반영 */
        if(hw_flag) apply_to_hardware(&copy_run_value);

        /* 100ms 대기 (CPU 점유 방지) */
        usleep(100000);
    }

    return NULL;
}`,
    },
  ],
  troubleshooting: [
    {
      id: "p3-ts-1",
      title: "Kbuild 문법 미숙지로 인한 다중 소스 커널 모듈 링크 실패",
      issue:
        "Jetson 환경에서 aarch64-linux-gnu-gcc를 이용해 멀티 소스 파일로 구성된 센서 드라이버(fan_bmp180_driver.ko)를 크로스 컴파일하는 과정에서 링커 에러 발생",
      rootCause: [
        "각 워커 스레드가 무한 루프(while(1))로만 돌고 있어 강제 종료 시 모터 정지 및 close(fd) 클린업 루틴이 실행되지 않음.",
        "상태 변경과 하드웨어 반영 사이의 원자성이 보장되지 않으면 이전 상태의 명령이 최신 명령을 덮어씀.",
      ],
      solution:
        "",
      logOrCode:`aarch64-linux-gnu-ld: cannot find .../fan_bmp180_device.o: No such file or directory
aarch64-linux-gnu-ld: cannot find .../fan_bmp180_main.o: No such file or directory
aarch64-linux-gnu-ld: cannot find .../fan_bmp180_sensor.o: No such file or directory
make[2]: *** [scripts/Makefile.build:494: .../fan_bmp180_driver.o] Error 1`,

      learned:
        "리눅스 커널 빌드 시스템(Kbuild)의 동작 원리와 다중 소스 파일로 구성된 커널 모듈 작성 규칙에 대해 이해함",
    },
  ],
};