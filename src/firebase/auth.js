import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './config'
import { registerTeacher, createOrUpdateStudent, parseStudentId } from './firestore'

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
export const signInWithStudentId = async (studentId, schoolName = null, schoolCode = null, grade = null, classNum = null, number = null) => {
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

    // 학번에서 정보 추출 (직접 전달된 값이 있으면 우선 사용)
    let parsed
    if (schoolCode && grade !== null && grade !== '' && classNum !== null && classNum !== '' && number !== null && number !== '') {
      // 직접 전달된 값 사용 (문자열을 숫자로 변환)
      const gradeNum = Number(String(grade).trim())
      const classNumNum = Number(String(classNum).trim())
      const numberNum = Number(String(number).trim())
      
      // 유효성 검사
      if (isNaN(gradeNum) || isNaN(classNumNum) || isNaN(numberNum)) {
        return { 
          success: false, 
          error: '학년, 반, 번호는 숫자여야 합니다.' 
        }
      }
      
      parsed = {
        schoolCode: String(schoolCode).trim(),
        grade: gradeNum,
        classNum: classNumNum,
        number: numberNum
      }
    } else {
      // 학번에서 파싱
      parsed = parseStudentId(studentId)
      if (!parsed) {
        return { 
          success: false, 
          error: '학번 형식이 올바르지 않습니다. 학번은 6자리여야 합니다.' 
        }
      }
    }

    let userCredential

    try {
      // 기존 계정으로 로그인 시도
      userCredential = await signInWithEmailAndPassword(auth, email, password)
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
          userCredential = await createUserWithEmailAndPassword(auth, email, password)
        } catch (signUpError) {
          if (signUpError.code === 'auth/configuration-not-found') {
            return { 
              success: false, 
              error: 'Firebase Authentication이 설정되지 않았습니다.\n\nFirebase Console에서:\n1. Authentication 메뉴로 이동\n2. "시작하기" 클릭\n3. "이메일/비밀번호" 인증 방법 활성화' 
            }
          }
          return { success: false, error: signUpError.message }
        }
      } else {
        return { success: false, error: error.message }
      }
    }

    // 로그인 성공 후 Firestore에 학생 정보 저장/업데이트
    // parsed 값 확인 및 디버깅
    console.log('auth.js - parsed 값:', parsed)
    console.log('auth.js - createOrUpdateStudent 호출:', {
      studentId,
      schoolCode: parsed.schoolCode,
      grade: parsed.grade,
      classNum: parsed.classNum,
      number: parsed.number,
      schoolName
    })
    
    const studentResult = await createOrUpdateStudent(
      studentId,
      parsed.schoolCode,
      parsed.grade,
      parsed.classNum,
      parsed.number,
      schoolName
    )

    if (!studentResult.success) {
      console.error('학생 정보 저장 실패:', studentResult.error)
      // Firestore 저장 실패해도 로그인은 성공한 것으로 처리 (기존 동작 유지)
    }

    return { success: true, user: userCredential.user }
  } catch (error) {
    console.error('학생 로그인 오류:', error)
    return { success: false, error: error.message || '로그인 중 오류가 발생했습니다.' }
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

