import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "김형진 | Embedded & Edge System Developer Portfolio",
  description: "STM32 펌웨어 및 Jetson Orin Nano 기반 Edge AI 관제 시스템 개발자 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}