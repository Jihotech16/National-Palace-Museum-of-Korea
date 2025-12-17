import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from './config'
import { getTeacherInfo, updateTeacherLastLogin, createTeacherAccount, createOrUpdateStudent, parseStudentId } from './firestore'

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
    console.log('교사 로그인 시도:', { schoolCode, grade, classNum, email })
    
    let userCredential
    
    try {
      // 기존 계정으로 로그인 시도
      userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('기존 계정으로 로그인 성공')
    } catch (error) {
      // 계정이 없으면 생성 후 로그인
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          console.log('계정이 없습니다. Firebase Authentication에 계정 생성 중...')
          userCredential = await createUserWithEmailAndPassword(auth, email, password)
          console.log('Firebase Authentication 계정 생성 완료')
        } catch (signUpError) {
          return { 
            success: false, 
            error: signUpError.message || '로그인에 실패했습니다.' 
          }
        }
      } else {
        return { success: false, error: error.message }
      }
    }
    
    // 인증 후 Firestore에서 교사 정보 확인
    let teacherInfoResult = await getTeacherInfo(schoolCode, grade, classNum)
    
    // 계정이 없으면 자동으로 생성
    if (!teacherInfoResult.success) {
      console.log('Firestore에 교사 계정이 없습니다. 자동 생성합니다...')
      const createResult = await createTeacherAccount(schoolCode, grade, classNum, password)
      
      if (!createResult.success) {
        console.error('계정 생성 실패:', createResult.error)
        // Firestore 계정 생성 실패해도 Firebase Authentication 로그인은 성공했으므로 계속 진행
        console.warn('Firestore 계정 생성 실패했지만 로그인은 성공했습니다.')
      } else {
        console.log('Firestore 교사 계정 자동 생성 완료')
      }
    } else {
      const teacherData = teacherInfoResult.data
      console.log('교사 데이터 조회 성공:', { 
        schoolCode: teacherData.schoolCode, 
        grade: teacherData.grade, 
        classNum: teacherData.classNum,
        hasPassword: !!teacherData.password 
      })
      
      // 비밀번호 확인 (기존 계정인 경우, Firestore에 비밀번호가 저장되어 있다면)
      if (teacherData.password && teacherData.password !== password) {
        console.warn('비밀번호 불일치')
        // Firebase Authentication은 성공했지만 Firestore 비밀번호와 불일치
        // 이 경우에도 로그인은 허용하되 경고만 표시
        console.warn('Firestore 비밀번호와 불일치하지만 Firebase Authentication 로그인은 성공했습니다.')
      }
    }
    
    // 로그인 시간 업데이트
    await updateTeacherLastLogin(schoolCode, grade, classNum)
    
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
export const signInAsAdmin = async (password = 'Admin') => {
  try {
    if (!auth) {
      return { 
        success: false, 
        error: 'Firebase Authentication이 설정되지 않았습니다.' 
      }
    }

    const email = 'admin@admin.local'
    
    try {
      // 기존 계정으로 로그인 시도
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return { 
        success: true, 
        user: userCredential.user 
      }
    } catch (error) {
      // 계정이 없으면 생성 후 로그인
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          return { 
            success: true, 
            user: userCredential.user 
          }
        } catch (signUpError) {
          return { 
            success: false, 
            error: signUpError.message || '로그인에 실패했습니다.' 
          }
        }
      }
      return { success: false, error: error.message }
    }
  } catch (error) {
    console.error('관리자 로그인 오류:', error)
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

