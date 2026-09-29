import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/common/Navbar';

export const metadata: Metadata = {
  title: 'IELTS Master GT - Band 7.0+ 실전 훈련 플랫폼',
  description:
    'IELTS General 모듈 Reading & Writing 실전 타이머, 단락 근거 매칭, Gemini AI 공식 4대 기준 정밀 채점 시스템',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
      </body>
    </html>
  );
}
