# 국립고궁박물관 전시 해설 활동지 모바일 웹앱

Firebase 기반의 모바일 웹앱으로, 국립고궁박물관 전시 해설 활동지를 디지털화한 프로젝트입니다.

## 주요 기능

- 🔐 수업 코드 + 번호로 입장 (학생 개인정보 미수집, 익명 로그인)
- 📝 7가지 활동지 페이지
  - 마인드 맵
  - 다섯 가지 자연물
  - 어보
  - 동물 유물
  - 어진 비교
  - 과학문화실
  - 유물 그리기
- 💾 Firebase Firestore를 통한 활동지 데이터 자동 저장
- 📱 모바일 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Authentication에서 이메일/비밀번호(교사·관리자용)와 익명(학생용) 로그인 활성화
3. Firestore Database 생성
4. `src/firebase/config.js` 파일에 Firebase 설정 정보 입력:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 보안 규칙 테스트

Firestore 에뮬레이터로 `firestore.rules`를 검사합니다 (Java 필요).

```bash
npm run test:rules
```

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

## 프로젝트 구조

```
├── src/
│   ├── components/          # 공통 컴포넌트
│   │   ├── ActivityLayout.jsx
│   │   └── ActivityLayout.css
│   ├── firebase/            # Firebase 설정 및 함수
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── firestore.js
│   ├── pages/               # 페이지 컴포넌트
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   └── activities/      # 활동지 페이지들
│   │       ├── ActivityMindMap.jsx
│   │       ├── ActivityNature.jsx
│   │       ├── ActivitySeal.jsx
│   │       ├── ActivityAnimal.jsx
│   │       ├── ActivityPortrait.jsx
│   │       ├── ActivityScience.jsx
│   │       ├── ActivityDraw.jsx
│   │       └── ActivityCommon.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

## 사용 방법

1. **수업 코드 만들기**: 교사가 대시보드에서 6자리 수업 코드를 만듭니다 (7일간 유효)
2. **입장**: 학생은 수업 코드와 번호만 입력합니다. 같은 번호로 다른 기기에서 들어와도 기록이 이어집니다
3. **활동지 작성**: 홈 화면에서 원하는 활동지를 선택하여 작성
4. **자동 저장**: 작성한 내용은 자동으로 Firebase에 저장됩니다
5. **자동 삭제**: 학생 기록은 마지막 활동 후 30일이 지나면 Firestore TTL로 자동 삭제됩니다

## 기술 스택

- React 18
- React Router DOM
- Firebase (Authentication, Firestore)
- Vite
- CSS3

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.


