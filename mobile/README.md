# 박물관 탐험 (iOS 앱)

React Native(Expo) 앱이에요. 웹 앱의 `../src`(Firebase 함수, 문제 데이터, 이미지)를 그대로 가져다 써요.
`metro.config.js`가 `@shared/...` 경로를 `../src`로 연결하고, 웹의 `firebase/config.js`와 `utils/hash.js`만 앱용 파일(`src/lib/`)로 바꿔 끼워요.

## 실행

```bash
cd mobile
npm install
npx expo run:ios        # Xcode 시뮬레이터
```

## TestFlight

```bash
npx eas-cli login
npx eas-cli build -p ios --profile production
npx eas-cli submit -p ios
```

관리자 페이지는 웹에서만 써요.
