import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './config'

// 학번을 이메일 형식으로 변환 (예: 2024001 -> 2024001@student.local)
const studentIdToEmail = (studentId) => {
  return `${studentId}@student.local`
}

// 회원가입 (학번)
export const signUpWithStudentId = async (studentId, password) => {
  try {
    const email = studentIdToEmail(studentId)
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 학번 기반 고정 비밀번호 생성
const getDefaultPassword = (studentId) => {
  // 학번을 기반으로 고정 비밀번호 생성 (최소 6자 이상)
  return `student${studentId}`
}

// 로그인 (학번만) - 계정이 없으면 자동으로 생성
export const signInWithStudentId = async (studentId) => {
  const email = studentIdToEmail(studentId)
  const password = getDefaultPassword(studentId)
  
  try {
    // Firebase Auth가 초기화되었는지 확인
    if (!auth) {
      return { 
        success: false, 
        error: 'Firebase Authentication이 설정되지 않았습니다. Firebase Console에서 Authentication을 활성화해주세요.' 
      }
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    // 에러 코드에 따른 처리
    if (error.code === 'auth/configuration-not-found') {
      return { 
        success: false, 
        error: 'Firebase Authentication이 설정되지 않았습니다.\n\nFirebase Console에서:\n1. Authentication 메뉴로 이동\n2. "시작하기" 클릭\n3. "이메일/비밀번호" 인증 방법 활성화' 
      }
    }
    
    // 계정이 없으면 자동으로 회원가입
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        return { success: true, user: userCredential.user }
      } catch (signUpError) {
        if (signUpError.code === 'auth/configuration-not-found') {
          return { 
            success: false, 
            error: 'Firebase Authentication이 설정되지 않았습니다.\n\nFirebase Console에서:\n1. Authentication 메뉴로 이동\n2. "시작하기" 클릭\n3. "이메일/비밀번호" 인증 방법 활성화' 
          }
        }
        return { success: false, error: signUpError.message }
      }
    }
    return { success: false, error: error.message }
  }
}

// 로그아웃
export const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 인증 상태 감지
export const onAuthChange = (callback) => {
  if (!auth) {
    console.warn('Firebase Auth가 초기화되지 않았습니다.')
    // Auth가 없어도 앱이 작동하도록 null을 즉시 호출
    callback(null)
    return () => {} // 빈 unsubscribe 함수 반환
  }
  return onAuthStateChanged(auth, callback)
}

