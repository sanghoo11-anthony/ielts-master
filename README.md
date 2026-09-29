# IELTS Master GT - General Training Band 7.0+ 실전 훈련 플랫폼

IELTS General 모듈에서 **Band 5.0부터 단계별로 발전하여 최종 Band 7.0 이상**을 달성할 수 있도록 설계된 전용 실전 훈련 웹 애플리케이션입니다.

---

## 🌟 주요 핵심 기능

### 1. 실전 Writing 트레이닝 & AI 정밀 첨삭
- **Task 1 & Task 2 기출 토픽**:
  - Task 1: 실용 서신(Formal / Semi-formal / Informal) 기출 및 3대 요구 조건(Bullet Points)
  - Task 2: 주제별 에세이(Opinion, Discussion, Problem-Solution) 기출 및 모범 답안
- **실전 시험 환경 에디터**:
  - 20분 / 40분 카운트다운 타이머 (5분/1분 잔여 경고)
  - IELTS 공식 기준 실시간 단어 수 카운터 및 최소 기준 충족 게이지
  - 브라우저 자동 저장 (작성 도중 이탈 방지)
- **공식 4대 기준 Gemini AI 자동 채점**:
  - 1. Task Achievement / Task Response (과제 달성도)
  - 2. Coherence & Cohesion (결속성과 일관성)
  - 3. Lexical Resource (어휘의 다양성)
  - 4. Grammatical Range & Accuracy (문법 범위와 정확성)
- **문장 단위 Before / After 1:1 비교 리포트**:
  - 원문 문장 → Band 7.5+ 세련된 문장 재작성
  - 구체적인 한글 교정 이유 및 Band 7+ 추천 연어(Collocation) 제공

### 2. 실전 Reading 스플릿 모의고사 & 단락 근거 매칭
- **좌우 분할(Split Screen) 인터페이스**:
  - **좌측 (지문 뷰어)**: Section 1(생활), Section 2(직무), Section 3(심층 기사), 문단 번호(A, B, C / P1~Pn), 4색 형광펜 하이라이트 및 폰트 크기 조절
  - **우측 (문제 패널)**: True/False/Not Given, Matching Headings, Multiple Choice, Summary Completion
- **단락 근거(Evidence) 자동 매칭 & 펄스 애니메이션**:
  - 문제 또는 오답 클릭 시, 지문 내 정답의 결정적 근거 문단으로 자동 스크롤 및 노란색 펄스 애니메이션 강조
  - 문항별 정답/오답 상세 해설 및 패러프레이징 분석

### 3. 목표 관리 & 데이터 영속성
- **Band 5.0 → 7.0 성장 로드맵**: 단계별 핵심 감점 요소 극복 가이드
- **IndexedDB (Dexie.js) 로컬 우선 저장소**: 모든 작성 글과 채점 기록이 안전하게 브라우저에 영구 보존
- **API Key 커스텀 설정**: 본인의 Google Gemini API Key를 UI에서 직접 입력/관리 가능

---

## 🚀 빠른 시작 가이드

### 1. 패키지 설치 및 개발 서버 실행
```bash
# 개발 서버 시작 (포트 3000)
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 2. Gemini API Key 설정 (선택 사항)
1. 프로젝트 루트의 `.env.local` 파일에 다음과 같이 추가:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. 또는 웹 화면 우측 상단의 ⚙️ **설정 버튼**을 눌러 UI에서 직접 API Key를 입력할 수도 있습니다.
*(키가 설정되지 않은 경우에도 완벽한 지능형 모의 채점 시뮬레이터가 작동하여 앱의 모든 기능을 끊김 없이 체험할 수 있습니다.)*

---

## 🛠️ 기술 스택
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Local Storage**: Dexie.js (IndexedDB)
- **AI Evaluation**: Google Generative AI (Gemini 1.5 Flash)
- **Effects**: Canvas Confetti
