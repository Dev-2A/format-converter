# 🔄 Format Converter

JSON, YAML, TOML 사이의 양방향 실시간 변환 도구입니다.  
백엔드 없이 브라우저만으로 동작하며, 에어갭 환경에서도 사용할 수 있습니다.

🔗 **[라이브 데모](https://Dev-2A.github.io/format-converter/)**

## ✨ 주요 기능

- **3방향 실시간 변환** — JSON ↔ YAML ↔ TOML 모든 조합 지원
- **포맷 자동 감지** — Auto 모드에서 입력 내용을 분석하여 포맷 자동 판별
- **문법 검증** — Monaco Editor 에러 마커로 정확한 오류 위치 표시
- **Diff 뷰** — Monaco Diff Editor 기반 입출력 비교
- **다크 / 라이트 테마** — 토글 전환, localStorage 저장
- **파일 열기 / 다운로드** — 로컬 파일 로드 및 변환 결과 저장
- **클립보드 복사** — 입력 / 출력 원클릭 복사
- **키보드 단축키** — Ctrl+E (스왑), Ctrl+D (Diff)
- **100% 클라이언트** — 서버 통신 없음, GitHub Pages 배포

## 🛠️ 기술 스택

- **Framework**: React 19 + Vite
- **에디터**: Monaco Editor (@monaco-editor/react)
- **스타일**: Tailwind CSS 3
- **파서**: js-yaml, smol-toml
- **배포**: GitHub Pages (GitHub Actions)

## 🚀 로컬 실행

```bash
git clone https://github.com/Dev-2A/format-converter.git
cd format-converter
npm install
npm run dev
```

`http://localhost:5173` 에서 확인할 수 있습니다.

## 📁 프로젝트 구조

```text
format-converter/
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Pages 배포
├── src/
│   ├── components/
│   │   ├── EditorPanel.jsx       # Monaco Editor 패널
│   │   ├── DiffPanel.jsx         # Diff 뷰 패널
│   │   └── Toolbar.jsx           # 복사/다운로드/파일 툴바
│   ├── hooks/
│   │   ├── useConverter.js       # 변환 로직 + 상태 관리
│   │   ├── useTheme.js           # 다크/라이트 테마
│   │   └── useKeyboardShortcuts.js # 단축키
│   ├── utils/
│   │   ├── converter.js          # 파싱 + 직렬화 + 포맷 감지
│   │   └── validator.js          # 문법 검증 + 에러 위치
│   ├── constants/
│   │   └── samples.js            # 포맷별 샘플 데이터
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── vite.config.js
└── README.md
```

## ⌨️ 키보드 단축기

| 단축기 | 기능 |
| --- | --- |
| `Ctrl + E` | 입출력 스왑 |
| `Ctrl + D` | Diff 모드 토글 |
| `Ctrl + Delete` | 입력 클리어 |

## 📝 개발 기록

| 단계 | 내용 |
| --- | --- |
| Step 1 | 프로젝트 초기 설정 (Vite + React + Tailwind + Monaco Editor) |
| Step 2 | Monaco Editor 2패널 레이아웃 구성 |
| Step 3 | JSON ↔ YAML 실시간 양방향 변환 |
| Step 4 | TOML 파서 통합 및 3방향 변환 완성 |
| Step 5 | 문법 검증 에러 마커 표시 및 포맷 자동 감지 |
| Step 6 | Monaco Diff Editor 기반 입출력 비교 뷰 |
| Step 7 | 복사, 다운로드, 파일 열기, 클리어 툴바 |
| Step 8 | 다크/라이트 테마 토글 및 키보드 단축키 |
| Step 9 | GitHub Pages 배포 설정 |
| Step 10 | README 작성 및 v0.1.0 릴리즈 |

## 📜 라이선스

MIT License © 2026 [Dev-2A](https://github.com/Dev-2A)
