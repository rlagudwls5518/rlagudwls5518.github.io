"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  ChevronRight,
  Cpu,
  Code2,
  Wrench,
  FileDown,
} from "lucide-react";

import { DEVELOPER_INFO, SKILLS_DATA } from "@/data/profile";
import { PROJECTS_DATA } from "@/data/projects";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

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