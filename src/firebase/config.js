import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// 테스트 모드(npm run dev:test): 내 컴퓨터의 Firebase 에뮬레이터에 연결하고 실제 데이터는 건드리지 않음
export const USE_EMULATOR = import.meta.env.VITE_USE_EMULATOR === 'true'
export const EMULATOR_PROJECT_ID = 'demo-palace'

// Firebase 설정 - 여기에 실제 Firebase 프로젝트 설정을 추가하세요
const firebaseConfig = {
    apiKey: "AIzaSyBdeZjbjr01z-2M2QOdu-q4L8VsU-p674s",
    authDomain: "nationalpalacemuseum-3eca0.firebaseapp.com",
    projectId: "nationalpalacemuseum-3eca0",
    storageBucket: "nationalpalacemuseum-3eca0.firebasestorage.app",
    messagingSenderId: "1060848680342",
    appId: "1:1060848680342:web:e361166b871b9fe3f4b1b7",
    measurementId: "G-RCJMHSKS0D"
}

// Firebase 초기화 (에러 처리)
let app = null
let auth = null
let db = null

try {
  // demo- 로 시작하는 프로젝트 ID는 실제 Firebase 서버에 접근할 수 없어 안전함
  app = initializeApp(USE_EMULATOR ? { ...firebaseConfig, projectId: EMULATOR_PROJECT_ID } : firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  if (USE_EMULATOR) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    connectFirestoreEmulator(db, '127.0.0.1', 8085)
    console.log('테스트 모드: Firebase 에뮬레이터에 연결됨')
  } else {
    console.log('Firebase 초기화 성공')
  }
} catch (error) {
  console.error('Firebase 초기화 오류:', error)
  console.warn('Firebase 없이 앱을 계속 실행합니다. (일부 기능이 제한될 수 있습니다)')
}

export { auth, db }
export default app

