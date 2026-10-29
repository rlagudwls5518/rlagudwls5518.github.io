"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  Layers,
  Terminal,
  FileDown,
  ChevronDown,
  FileText,
} from "lucide-react";
import { ProjectDetail } from "@/types/portfolio";

interface ProjectModalProps {
  project: ProjectDetail | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ProjectDetailModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const [openTroubleshootingIds, setOpenTroubleshootingIds] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setOpenTroubleshootingIds(project.troubleshooting.map((t) => t.id));
    }
  }, [project]);

  const toggleTroubleshooting = (id: string) => {
    setOpenTroubleshootingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (!project) return;

    previousActiveElement.current = document.activeElement as HTMLElement;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = originalStyle;
      clearTimeout(timer);
      previousActiveElement.current?.focus();
    };
  }, [project]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  if (!project) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-project-title"
        aria-describedby="modal-project-subtitle"
        onKeyDown={handleKeyDown}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* 1. 모달 헤더 */}
          <header className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-5 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {project.period}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {project.contribution}
                </span>
              </div>
              <h2
                id="modal-project-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {project.title}
              </h2>
              <p
                id="modal-project-subtitle"
                className="text-sm text-slate-600 dark:text-slate-400"
              >
                {project.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} GitHub 저장소 새 창에서 열기`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <Github className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${project.title} 라이브 데모 새 창에서 열기`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Live Demo</span>
                </a>
              )}
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* 모달 본문 */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-10">
            {/* 2. 개요 및 기술 스택 */}
            <section aria-labelledby="section-overview">
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h3 id="section-overview" className="text-lg font-bold">
                  1. 프로젝트 개요 및 핵심 기여 (Overview & Tech Stack)
                </h3>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {project.overview.background}
                </p>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  👥 팀 구성 및 역할:{" "}
                  <span className="text-slate-900 dark:text-slate-200">{project.teamAndRole}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                      🎯 핵심 목표
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {project.overview.goals.map((g, i) => (
                        <li key={i} className="leading-relaxed">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      🛠️ 내가 기여한 부분 (담당 구현)
                    </h4>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                      {project.overview.myContributions.map((c, i) => (
                        <li key={i} className="leading-relaxed">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                  사용 기술 및 선정 이유
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.techStack.map((tech, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {tech.name}
                      </span>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-normal">
                        {tech.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 3. 설계 및 아키텍처 고민 */}
            <section aria-labelledby="section-architecture">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
                <h3 id="section-architecture" className="text-lg font-bold">
                  2. 설계 및 아키텍처 고민 (Design Decisions)
                </h3>
              </div>

              <div className="space-y-6">
                {project.designDecisions.map((decision, idx) => (
                  <article
                    key={decision.id}
                    className="p-5 rounded-xl bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-950/80 shadow-sm space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-indigo-600 text-white">
                        설계 포인트 {idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {decision.title}
                      </h4>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <strong className="font-semibold text-slate-900 dark:text-white block mb-1">
                        📌 문제 정의 및 구조적 고민:
                      </strong>
                      {decision.problem}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 opacity-80">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                          Option A (기존/일반적 방식)
                        </div>
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                          {decision.comparison.optionA.name}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {decision.comparison.optionA.desc}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-lg border-2 border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-950/20">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            Option B (채택한 아키텍처)
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-600 text-white">
                            Selected
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                          {decision.comparison.optionB.name}
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          {decision.comparison.optionB.desc}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs sm:text-sm space-y-1.5">
                      <div className="flex items-start gap-2">
                        <Lightbulb
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            채택 이유:{" "}
                          </strong>
                          {decision.comparison.whySelected}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-slate-700 dark:text-slate-300">
                          <strong className="font-semibold text-emerald-900 dark:text-emerald-300">
                            결과 및 시사점:{" "}
                          </strong>
                          {decision.impact}
                        </p>
                      </div>
                    </div>

                    {decision.codeSnippet && (
                      <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                          <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Architecture Code Snippet</span>
                        </div>
                        <pre className="text-xs font-mono leading-relaxed">
                          <code>{decision.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>

            {/* 4. 트러블슈팅 및 문제 해결 */}
            <section aria-labelledby="section-troubleshooting">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                <h3 id="section-troubleshooting" className="text-lg font-bold">
                  3. 트러블슈팅 및 기술적 문제 해결 (Troubleshooting)
                </h3>
              </div>

              <div className="space-y-4">
                {project.troubleshooting.map((ts) => {
                  const isOpen = openTroubleshootingIds.includes(ts.id);
                  return (
                    <div
                      key={ts.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleTroubleshooting(ts.id)}
                        aria-expanded={isOpen}
                        aria-controls={`ts-content-${ts.id}`}
                        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 text-xs font-bold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shrink-0">
                            Troubleshooting
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                            {ts.title}
                          </h4>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`ts-content-${ts.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-200 dark:border-slate-800"
                          >
                            <div className="p-5 space-y-4 text-xs sm:text-sm">
                              <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                                <div className="font-bold text-rose-800 dark:text-rose-300 mb-1">
                                  🚨 증상 및 문제 발생 (Issue)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.issue}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
                                <div className="font-bold text-amber-900 dark:text-amber-300 mb-1.5">
                                  🔍 원인 분석 및 가설 검증 (Root Cause Analysis)
                                </div>
                                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                                  {ts.rootCause.map((cause, idx) => (
                                    <li key={idx} className="leading-relaxed">
                                      {cause}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {ts.logOrCode && (
                                <div className="rounded-lg bg-slate-950 text-slate-100 p-4 overflow-x-auto border border-slate-800">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-mono">
                                    <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Verification Log / Code</span>
                                  </div>
                                  <pre className="text-xs font-mono leading-relaxed">
                                    <code>{ts.logOrCode}</code>
                                  </pre>
                                </div>
                              )}

                              <div className="p-3.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                                <div className="font-bold text-indigo-900 dark:text-indigo-300 mb-1">
                                  🛠️ 해결 방안 및 적용 (Solution)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.solution}
                                </p>
                              </div>

                              <div className="p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-900/60">
                                <div className="font-bold text-emerald-900 dark:text-emerald-300 mb-1">
                                  ✅ 결과 및 인사이트 (Result & Learned)
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {ts.learned}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 5. 프로젝트 최종 보고서 PDF 내장 뷰어 */}
            {project.reportPdfUrl && (
              <section aria-labelledby="section-pdf-report">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText
                      className="w-5 h-5 text-indigo-600 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    <h3 id="section-pdf-report" className="text-lg font-bold">
                      4. 프로젝트 최종 보고서 / 발표 자료 (PDF)
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={project.reportPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>새 창으로 크게 보기</span>
                    </a>
                    <a
                      href={project.reportPdfUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                    >
                      <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>PDF 다운로드</span>
                    </a>
                  </div>
                </div>

                <div className="w-full h-[600px] rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 shadow-inner">
                  <iframe
                    src={`${project.reportPdfUrl}#view=FitH`}
                    title={`${project.title} 최종 보고서 PDF 뷰어`}
                    className="w-full h-full border-0"
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 text-right">
                  * 모바일 환경 등 브라우저에 따라 내장 뷰어가 보이지 않을 경우 우측 상단의 &lsquo;새 창으로 크게 보기&rsquo;를 눌러주세요.
                </p>
              </section>
            )}
          </div>

          {/* 모달 푸터 */}
          <footer className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev}
                aria-label="이전 프로젝트 보기"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>이전 프로젝트</span>
              </button>

              <button
                type="button"
                onClick={onNext}
                disabled={!hasNext}
                aria-label="다음 프로젝트 보기"
                className="inline-flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <span>다음 프로젝트</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              닫기
            </button>
          </footer>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};