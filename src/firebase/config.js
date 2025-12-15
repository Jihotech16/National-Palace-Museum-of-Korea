import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  console.log('Firebase 초기화 성공')
} catch (error) {
  console.error('Firebase 초기화 오류:', error)
  console.warn('Firebase 없이 앱을 계속 실행합니다. (일부 기능이 제한될 수 있습니다)')
}

export { auth, db }
export default app

