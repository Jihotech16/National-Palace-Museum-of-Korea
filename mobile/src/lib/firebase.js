// 앱용 Firebase 설정. 웹앱(src/firebase/config.js)과 같은 Firebase 프로젝트를 씁니다.
// 로그인 상태는 휴대폰에 저장해서 앱을 다시 켜도 유지됩니다.
import { Platform } from 'react-native'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBdeZjbjr01z-2M2QOdu-q4L8VsU-p674s',
  authDomain: 'nationalpalacemuseum-3eca0.firebaseapp.com',
  projectId: 'nationalpalacemuseum-3eca0',
  storageBucket: 'nationalpalacemuseum-3eca0.firebasestorage.app',
  messagingSenderId: '1060848680342',
  appId: '1:1060848680342:web:e361166b871b9fe3f4b1b7',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

let auth
if (Platform.OS === 'web') {
  auth = getAuth(app)
} else {
  try {
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  } catch {
    // 빠른 새로고침으로 두 번 초기화될 때
    auth = getAuth(app)
  }
}

const db = getFirestore(app)

export { auth, db }
export default app
