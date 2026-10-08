import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './config'
import { registerTeacher, joinClassSession } from './firestore'

// 학생 입장 (수업 코드 + 번호)
// 학생 계정을 만들지 않고 익명 로그인만 사용합니다. 이름·학교명 등 개인정보는 받지 않습니다.
export const signInWithClassCode = async (sessionCode, number) => {
  try {
    if (!auth) {
      return { success: false, error: 'Firebase Authentication이 설정되지 않았습니다.' }
    }

    // 다른 계정(교사 등)으로 로그인돼 있으면 먼저 로그아웃
    if (auth.currentUser && !auth.currentUser.isAnonymous) {
      await signOut(auth)
    }

    let user = auth.currentUser
    if (!user) {
      try {
        const credential = await signInAnonymously(auth)
        user = credential.user
      } catch (error) {
        if (error.code === 'auth/operation-not-allowed' || error.code === 'auth/admin-restricted-operation') {
          return {
            success: false,
            error: '익명 로그인이 꺼져 있습니다.\nFirebase Console > Authentication > 로그인 방법에서 "익명"을 사용 설정해주세요.'
          }
        }
        throw error
      }
    }

    const result = await joinClassSession(user.uid, sessionCode, number)
    if (!result.success) {
      return result
    }
    return { success: true, user }
  } catch (error) {
    console.error('학생 입장 오류:', error)
    return { success: false, error: error.message || '입장 중 오류가 발생했습니다.' }
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

// ========== 교사 관련 함수 ==========

// 교사 ID를 이메일 형식으로 변환 (예: SCHOOL-1-1 -> SCHOOL-1-1@teacher.local)
const teacherIdToEmail = (schoolCode, grade, classNum) => {
  return `${schoolCode}-${grade}-${classNum}@teacher.local`
}

// 교사 로그인 (학교 코드, 학년, 반, 비밀번호)
export const signInAsTeacher = async (schoolCode, grade, classNum, password) => {
  try {
    if (!auth) {
      return { 
        success: false, 
        error: 'Firebase Authentication이 설정되지 않았습니다. Firebase Console에서 Authentication을 활성화해주세요.' 
      }
    }

    // Firebase Auth로 먼저 로그인 시도
    const email = teacherIdToEmail(schoolCode, grade, classNum)
    
    let userCredential
    let createdNow = false
    
    try {
      // 기존 계정으로 로그인 시도
      userCredential = await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      // 계정이 없으면 생성 (권한은 아래 학교 비밀번호 확인을 통과해야 생김)
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, email, password)
          createdNow = true
        } catch (signUpError) {
          if (signUpError.code === 'auth/email-already-in-use') {
            return { success: false, error: '비밀번호가 올바르지 않습니다.' }
          }
          return { 
            success: false, 
            error: signUpError.message || '로그인에 실패했습니다.' 
          }
        }
      } else {
        return { success: false, error: error.message }
      }
    }
    
    // 학교 비밀번호 확인: 보안 규칙이 schoolSecrets의 해시와 비교해 교사 등록을 허용함
    const registerResult = await registerTeacher(schoolCode, grade, classNum, password)
    if (!registerResult.success) {
      // 방금 만든 계정이면 지워서 진짜 교사가 이 반으로 가입할 수 있게 둠
      if (createdNow) {
        await userCredential.user.delete().catch(() => {})
      }
      await signOut(auth).catch(() => {})
      if (registerResult.code === 'permission-denied') {
        return { success: false, error: '학교 코드 또는 학교 비밀번호가 올바르지 않습니다.' }
      }
      return { success: false, error: registerResult.error || '교사 확인에 실패했습니다.' }
    }
    
    return { 
      success: true, 
      user: userCredential.user,
      teacherData: {
        schoolCode,
        grade,
        classNum
      }
    }
  } catch (error) {
    console.error('교사 로그인 오류:', error)
    return { 
      success: false, 
      error: error.message || '로그인 중 오류가 발생했습니다.' 
    }
  }
}

// 관리자 로그인
export const ADMIN_EMAIL = 'admin@admin.local'

export const signInAsAdmin = async (password) => {
  try {
    if (!auth) {
      return { 
        success: false, 
        error: 'Firebase Authentication이 설정되지 않았습니다.' 
      }
    }

    // 관리자 계정은 Firebase Console에서 미리 만들어 둔 admin@admin.local 하나만 사용 (자동 생성 안 함)
    const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password)
    return { 
      success: true, 
      user: userCredential.user 
    }
  } catch (error) {
    console.error('관리자 로그인 오류:', error)
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      return { success: false, error: '관리자 비밀번호가 올바르지 않습니다.' }
    }
    return { 
      success: false, 
      error: error.message || '로그인 중 오류가 발생했습니다.' 
    }
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

