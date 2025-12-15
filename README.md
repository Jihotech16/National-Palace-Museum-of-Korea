# 국립고궁박물관 전시 해설 활동지 모바일 웹앱

Firebase 기반의 모바일 웹앱으로, 국립고궁박물관 전시 해설 활동지를 디지털화한 프로젝트입니다.

## 주요 기능

- 🔐 학번 기반 로그인/회원가입
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
2. Authentication에서 이메일/비밀번호 인증 활성화
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

1. **회원가입**: 학번과 비밀번호를 입력하여 계정 생성
2. **로그인**: 학번과 비밀번호로 로그인
3. **활동지 작성**: 홈 화면에서 원하는 활동지를 선택하여 작성
4. **자동 저장**: 작성한 내용은 자동으로 Firebase에 저장됩니다
5. **다시 접속**: 로그인하면 이전에 작성한 내용이 자동으로 불러와집니다

## 기술 스택

- React 18
- React Router DOM
- Firebase (Authentication, Firestore)
- Vite
- CSS3

## 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.


