import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  runTransaction,
  increment,
  deleteField,
  arrayUnion,
  writeBatch,
  Timestamp
} from 'firebase/firestore'
import { db, auth } from './config'
import { checkAnswer, checkMultipleAnswers, ANSWERS } from '../utils/answerCheck'
import { getExhibitionHallFromActivityId } from '../utils/activityOrder'
import { sha256Hex } from '../utils/hash'

// ========== 개인정보 최소화 ==========
// 학생은 익명 로그인 + 수업 코드 + 번호로만 입장합니다.
// 학생 문서 ID(studentId)는 `${classId}-${번호}` 형식이며 이름·학교명은 저장하지 않습니다.
// 모든 학생 데이터에는 expiresAt을 넣어 Firestore TTL 정책으로 자동 삭제되게 합니다.
export const RETENTION_DAYS = 30
export const SESSION_VALID_DAYS = 7

const daysFromNow = (days) => Timestamp.fromMillis(Date.now() + days * 24 * 60 * 60 * 1000)

// 로그인한 기기(익명 uid)를 학생 문서 ID로 바꿉니다.
// 교사 화면처럼 이미 studentId를 넘기는 경우에는 그대로 돌려줍니다.
// 기기 → 학생 연결은 세션 중에 바뀌지 않으므로 메모리에 캐시해 읽기를 줄입니다.
const studentIdCache = new Map()

export const resolveStudentId = async (userId) => {
  if (!userId) return null
  if (!auth?.currentUser || auth.currentUser.uid !== userId) return userId
  if (studentIdCache.has(userId)) return studentIdCache.get(userId)
  const memberDoc = await getDoc(doc(db, 'members', userId))
  const studentId = memberDoc.exists() ? memberDoc.data().studentId : null
  if (studentId) studentIdCache.set(userId, studentId)
  return studentId
}

// 학생 문서의 progress 요약({ activityId: true })을 진행 상태로 사용합니다.
// progress가 없는 예전 문서만 activities를 직접 읽습니다.
const readActivitiesStatus = async (studentId) => {
  const snapshot = await getDocs(collection(db, 'users', studentId, 'activities'))
  const status = {}
  snapshot.forEach((d) => {
    status[d.id] = d.data().completed || false
  })
  return status
}

const getStudentStatus = async (student) =>
  student.progress ? { ...student.progress } : readActivitiesStatus(student.studentId)

// 사용자 활동지 데이터 저장 (구조 문서 기반)
export const saveActivityData = async (userId, activityId, data, questionData = null, userEmail = null) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다. Firebase Console에서 Firestore를 활성화해주세요.' }
    }
    
    if (!userId) {
      return { success: false, error: '사용자 ID가 없습니다.' }
    }
    
    const studentId = await resolveStudentId(userId)
    if (!studentId) {
      return { success: false, error: '수업 정보를 찾을 수 없습니다. 다시 입장해주세요.' }
    }
    
    const activityRef = doc(db, 'users', studentId, 'activities', activityId)
    
    // 기존 데이터 조회 (시도 횟수 추적을 위해)
    const existingDoc = await getDoc(activityRef)
    const existingData = existingDoc.exists() ? existingDoc.data() : {}
    
    // 정답 확인
    let isCorrect = false
    const answerField = questionData?.answerField || Object.keys(data)[0]
    const userAnswer = data[answerField]
    
    if (questionData?.inputType === 'multiple') {
      // 다중 답변 문제
      const answerCheck = checkMultipleAnswers(activityId, answerField, userAnswer)
      isCorrect = answerCheck.correct
    } else {
      // 단일 답변 문제
      const answerCheck = checkAnswer(activityId, answerField, userAnswer)
      isCorrect = answerCheck.correct
    }
    
    // 시도 횟수 증가
    const attempts = (existingData.attempts || 0) + 1
    
    // 정답 가져오기
    const correctAnswer = ANSWERS[activityId]?.[answerField]
    
    // 저장할 데이터 구성 (구조 문서 기반)
    const saveData = {
      activityId,
      questionNumber: questionData?.questionNumber || existingData.questionNumber || '',
      title: questionData?.title || existingData.title || '',
      exhibitionHall: questionData?.exhibitionHall || existingData.exhibitionHall || getExhibitionHallFromActivityId(activityId) || '',
      completed: true,
      isCorrect,
      attempts,
      answerField,
      ...data,  // 학생이 입력한 답변
      correctAnswer: correctAnswer || existingData.correctAnswer || '',
      updatedAt: serverTimestamp(),
      expiresAt: daysFromNow(RETENTION_DAYS)
    }
    
    // 단일 답변인 경우 studentAnswer 필드 추가
    if (questionData?.inputType !== 'multiple' && userAnswer) {
      saveData.studentAnswer = userAnswer
    }
    
    // 다중 답변인 경우 studentAnswers 필드 추가
    if (questionData?.inputType === 'multiple' && Array.isArray(userAnswer)) {
      saveData.studentAnswers = userAnswer
      saveData.correctAnswers = Array.isArray(correctAnswer) ? correctAnswer : []
    }
    
    // 시작 시간이 없으면 현재 시간으로 설정
    if (!existingData.startedAt) {
      saveData.startedAt = serverTimestamp()
    } else {
      saveData.startedAt = existingData.startedAt
    }
    
    // 제출 시간 및 완료 시간 설정
    saveData.submittedAt = serverTimestamp()
    saveData.completedAt = serverTimestamp()
    
    // 답안과 학생 진행 요약을 한 번에 저장 (교사 화면은 학생 문서만 읽으면 됨)
    const batch = writeBatch(db)
    batch.set(activityRef, saveData, { merge: true })
    batch.update(doc(db, 'users', studentId), {
      [`progress.${activityId}`]: true,
      lastActivityAt: serverTimestamp(),
      expiresAt: daysFromNow(RETENTION_DAYS)
    })
    await batch.commit()
    
    return { success: true }
  } catch (error) {
    console.error('Firestore 저장 오류:', error)
    return { success: false, error: error.message || '저장 중 오류가 발생했습니다.' }
  }
}

// 활동지 완료 상태 확인
export const checkActivityCompleted = async (userId, activityId) => {
  try {
    const studentId = await resolveStudentId(userId)
    const activityRef = doc(db, 'users', studentId, 'activities', activityId)
    const docSnap = await getDoc(activityRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return { success: true, completed: data.completed || false }
    } else {
      return { success: true, completed: false }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 사용자 활동지 데이터 불러오기
export const getActivityData = async (userId, activityId, userEmail = null) => {
  try {
    const studentId = await resolveStudentId(userId)
    if (!studentId) {
      return { success: false, error: '수업 정보를 찾을 수 없습니다.' }
    }
    
    const activityRef = doc(db, 'users', studentId, 'activities', activityId)
    const docSnap = await getDoc(activityRef)
    
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// 모든 활동지 완료 상태 한 번에 가져오기
export const getAllActivityStatus = async (userId, userEmail = null) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', status: {} }
    }
    
    const studentId = await resolveStudentId(userId)
    if (!studentId) {
      return { success: false, error: '수업 정보를 찾을 수 없습니다.', status: {} }
    }
    
    const userDoc = await getDoc(doc(db, 'users', studentId))
    const progress = userDoc.exists() ? userDoc.data().progress : null
    const status = progress ? { ...progress } : await readActivitiesStatus(studentId)
    
    return { success: true, status }
  } catch (error) {
    return { success: false, error: error.message, status: {} }
  }
}

// 모든 활동지 데이터 불러오기
export const getAllActivityData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)
    
    if (userDoc.exists()) {
      return { success: true, data: userDoc.data() }
    } else {
      return { success: true, data: null }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// ========== 교사 관련 함수 ==========

// 교사 정보 조회 (학교 코드, 학년, 반으로)
export const getTeacherInfo = async (schoolCode, grade, classNum) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const teacherId = `${schoolCode}-${grade}-${classNum}`
    console.log('교사 계정 조회:', { schoolCode, grade, classNum, teacherId })
    
    const teacherRef = doc(db, 'teachers', teacherId)
    const teacherDoc = await getDoc(teacherRef)
    
    if (teacherDoc.exists()) {
      console.log('교사 계정 찾음:', teacherDoc.data())
      return { success: true, data: teacherDoc.data() }
    } else {
      console.warn('교사 계정을 찾을 수 없음:', teacherId)
      return { 
        success: false, 
        error: `등록되지 않은 교사 계정입니다.\n조회한 ID: ${teacherId}\n\nFirebase Console에서 'teachers' 컬렉션에 해당 계정이 있는지 확인해주세요.` 
      }
    }
  } catch (error) {
    console.error('교사 정보 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

// 교사 등록/재확인: 학교 비밀번호 해시가 schoolSecrets와 일치해야 보안 규칙이 허용함
export const registerTeacher = async (schoolCode, grade, classNum, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const teacherId = `${schoolCode}-${grade}-${classNum}`
    const teacherRef = doc(db, 'teachers', teacherId)
    const passwordHash = await sha256Hex(password)
    const existing = await getDoc(teacherRef)
    
    await setDoc(teacherRef, {
      teacherId, // 문서 ID와 동일한 값 저장
      schoolCode: String(schoolCode),
      grade: Number(grade),
      classNum: Number(classNum),
      passwordHash,
      password: deleteField(), // 예전 평문 비밀번호 필드 제거
      lastLogin: serverTimestamp(),
      ...(existing.exists() ? {} : { createdAt: serverTimestamp() })
    }, { merge: true })
    
    return { success: true }
  } catch (error) {
    console.error('교사 등록 오류:', error)
    return { success: false, error: error.message, code: error.code }
  }
}

// 교사 로그인 시간 업데이트
export const updateTeacherLastLogin = async (schoolCode, grade, classNum) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const teacherId = `${schoolCode}-${grade}-${classNum}`
    const teacherRef = doc(db, 'teachers', teacherId)
    
    await updateDoc(teacherRef, {
      lastLogin: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('교사 로그인 시간 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// ========== 학교 관리 함수 ==========

// 모든 학교 목록 조회
export const getAllSchools = async () => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', schools: [] }
    }
    
    const schoolsRef = collection(db, 'schools')
    const querySnapshot = await getDocs(schoolsRef)
    
    const schools = []
    querySnapshot.forEach((doc) => {
      schools.push({
        id: doc.id,
        ...doc.data()
      })
    })
    
    return { success: true, schools }
  } catch (error) {
    console.error('학교 목록 조회 오류:', error)
    return { success: false, error: error.message, schools: [] }
  }
}

// 학교 정보 조회
export const getSchoolInfo = async (schoolCode) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const schoolRef = doc(db, 'schools', schoolCode)
    const schoolDoc = await getDoc(schoolRef)
    
    if (schoolDoc.exists()) {
      return { success: true, data: { id: schoolDoc.id, ...schoolDoc.data() } }
    } else {
      return { success: false, error: '등록되지 않은 학교입니다.' }
    }
  } catch (error) {
    console.error('학교 정보 조회 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학교 등록
export const createSchool = async (schoolName, schoolCode, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    // 학교 코드 중복 확인
    const existingSchool = await getSchoolInfo(schoolCode)
    if (existingSchool.success) {
      return { success: false, error: '이미 등록된 학교 코드입니다.' }
    }
    
    const schoolRef = doc(db, 'schools', schoolCode)
    
    await setDoc(schoolRef, {
      schoolName,
      schoolCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    await setSchoolPasswordHash(schoolCode, password)
    
    return { success: true }
  } catch (error) {
    console.error('학교 등록 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학교 정보 업데이트
export const updateSchool = async (schoolCode, updates) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const schoolRef = doc(db, 'schools', schoolCode)
    
    await updateDoc(schoolRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('학교 정보 업데이트 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학교 비밀번호 해시 저장 (schoolSecrets는 공개 읽기가 막힌 별도 컬렉션)
const setSchoolPasswordHash = async (schoolCode, password) => {
  const passwordHash = await sha256Hex(password)
  await setDoc(doc(db, 'schoolSecrets', schoolCode), {
    passwordHash,
    updatedAt: serverTimestamp()
  })
}

// 학교 비밀번호 확인 (관리자, 또는 해당 학교 교사만 읽을 수 있음)
export const verifySchoolPassword = async (schoolCode, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    const secretDoc = await getDoc(doc(db, 'schoolSecrets', schoolCode))
    if (!secretDoc.exists()) {
      return { success: false, error: '학교 비밀번호 정보를 찾을 수 없습니다.' }
    }
    const passwordHash = await sha256Hex(password)
    return { success: true, match: secretDoc.data().passwordHash === passwordHash }
  } catch (error) {
    console.error('학교 비밀번호 확인 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학교 비밀번호 변경
export const updateSchoolPassword = async (schoolCode, newPassword) => {
  try {
    await setSchoolPasswordHash(schoolCode, newPassword)
    return await updateSchool(schoolCode, { password: deleteField() })
  } catch (error) {
    console.error('학교 비밀번호 변경 오류:', error)
    return { success: false, error: error.message }
  }
}

// 예전 평문 비밀번호를 schoolSecrets 해시로 옮기고, 교사 문서의 평문 비밀번호도 제거 (관리자 화면에서 실행)
export const migratePlaintextPasswords = async () => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    let migrated = 0
    const schoolsSnapshot = await getDocs(collection(db, 'schools'))
    for (const schoolDoc of schoolsSnapshot.docs) {
      const data = schoolDoc.data()
      if (typeof data.password === 'string' && data.password) {
        await setSchoolPasswordHash(schoolDoc.id, data.password)
        await updateDoc(schoolDoc.ref, { password: deleteField() })
        migrated++
      }
    }
    const teachersSnapshot = await getDocs(collection(db, 'teachers'))
    for (const teacherDoc of teachersSnapshot.docs) {
      if (teacherDoc.data().password !== undefined) {
        await updateDoc(teacherDoc.ref, { password: deleteField() })
        migrated++
      }
    }
    return { success: true, migrated }
  } catch (error) {
    console.error('비밀번호 이전 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학교 삭제
export const deleteSchool = async (schoolCode) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const schoolRef = doc(db, 'schools', schoolCode)
    await deleteDoc(schoolRef)
    
    // 해당 학교의 모든 교사 계정도 삭제
    const teachersRef = collection(db, 'teachers')
    const teachersSnapshot = await getDocs(teachersRef)
    
    const deletePromises = []
    teachersSnapshot.forEach((teacherDoc) => {
      const teacherData = teacherDoc.data()
      if (teacherData.schoolCode === schoolCode) {
        deletePromises.push(deleteDoc(teacherDoc.ref))
      }
    })
    
    await Promise.all(deletePromises)
    
    return { success: true }
  } catch (error) {
    console.error('학교 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// 교사 활동 종료: 우리 반 학생 기록·수업 코드·공지만 삭제 (다른 반·학교 정보·교사 계정은 유지)
export const deleteClassData = async (schoolCode, grade, classNum, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }

    const verifyResult = await verifySchoolPassword(schoolCode, password)
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error }
    }
    if (!verifyResult.match) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' }
    }

    const classId = `${schoolCode}-${grade}-${classNum}`
    const byClass = (name) => query(collection(db, name), where('classId', '==', classId))

    // 1. 학생 기록: activities를 먼저 지운 뒤 학생 문서 삭제 (규칙이 학생 문서의 classId를 확인하므로 순서 중요)
    const usersSnapshot = await getDocs(byClass('users'))
    for (const userDoc of usersSnapshot.docs) {
      const activitiesSnapshot = await getDocs(collection(db, 'users', userDoc.id, 'activities'))
      await Promise.all(activitiesSnapshot.docs.map((d) => deleteDoc(d.ref)))
      await deleteDoc(userDoc.ref)
    }

    // 2. 기기 연결, 반 명단, 수업 코드, 공지
    const [membersSnapshot, studentsSnapshot, sessionsSnapshot, messagesSnapshot] = await Promise.all([
      getDocs(byClass('members')),
      getDocs(collection(db, 'classes', classId, 'students')),
      getDocs(byClass('sessions')),
      getDocs(classMessagesRef(classId))
    ])
    await Promise.all([
      ...messagesSnapshot.docs.map((d) => deleteDoc(d.ref)),
      ...membersSnapshot.docs.map((d) => deleteDoc(d.ref)),
      ...studentsSnapshot.docs.map((d) => deleteDoc(d.ref)),
      ...sessionsSnapshot.docs.map((d) => deleteDoc(d.ref))
    ])
    await deleteDoc(doc(db, 'classes', classId))

    return { success: true, deletedStudents: usersSnapshot.size }
  } catch (error) {
    console.error('반 기록 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// ========== 교사 대시보드 관련 함수 ==========


// 교사의 반 학생 목록 가져오기: users에서 우리 반만 한 번에 조회 (학생 수만큼만 읽음)
// 같은 화면에서 여러 함수가 동시에 부르면 결과를 공유합니다.
const CLASS_STUDENTS_CACHE_MS = 5000
let classStudentsCache = null

export const getTeacherStudents = async (schoolCode, grade, classNum) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', students: [] }
    }
    if (!auth?.currentUser) {
      return { success: false, error: '인증되지 않은 사용자입니다. 다시 로그인해주세요.', students: [] }
    }

    const classId = `${schoolCode}-${grade}-${classNum}`
    const now = Date.now()
    if (classStudentsCache?.classId === classId && now - classStudentsCache.at < CLASS_STUDENTS_CACHE_MS) {
      return await classStudentsCache.promise
    }

    const promise = getDocs(query(collection(db, 'users'), where('classId', '==', classId))).then((snapshot) => {
      const students = snapshot.docs
        .map((d) => ({ studentId: d.id, isActive: true, ...d.data() }))
        .sort((a, b) => (a.number || 0) - (b.number || 0))
      return { success: true, students }
    })
    classStudentsCache = { classId, at: now, promise }
    promise.catch(() => { classStudentsCache = null })
    return await promise
  } catch (error) {
    console.error('학생 목록 조회 오류:', error)
    return { success: false, error: error.message, students: [] }
  }
}

// 학생 한 명의 진행 상태 ({ activityId: true }), 교사 화면용
export const getStudentProgressStatus = getStudentStatus

// 학생들의 활동 진행률 계산
export const getStudentsProgress = async (schoolCode, grade, classNum) => {
  try {
    const studentsResult = await getTeacherStudents(schoolCode, grade, classNum)
    
    if (!studentsResult.success) {
      return { success: false, error: studentsResult.error, progress: {} }
    }
    
    // 전체 활동 수를 동적으로 계산
    const { EXHIBITION_HALL_ACTIVITIES } = await import('../utils/activityOrder')
    const totalActivities = Object.values(EXHIBITION_HALL_ACTIVITIES).reduce(
      (sum, activities) => sum + activities.length, 
      0
    )
    
    const students = studentsResult.students
    const progressData = {}
    
    // 모든 학생의 활동 상태를 병렬로 가져오기 (성능 최적화)
    // 학생 문서의 progress 요약으로 계산 (예전 문서만 추가로 읽음)
    await Promise.all(students.map(async (student) => {
      const status = await getStudentStatus(student)
      const completedCount = Object.values(status).filter(Boolean).length
      const progress = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
      progressData[student.studentId] = {
        completed: completedCount,
        total: totalActivities,
        progress
      }
    }))
    
    // 이용 현황 기록 (실패해도 화면에는 영향 없음)
    const completedTotal = Object.values(progressData).reduce((sum, p) => sum + p.completed, 0)
    recordClassUsage(schoolCode, grade, classNum, students.length, completedTotal)
      .catch((error) => console.error('이용 현황 기록 오류:', error))
    
    // 평균 진행률 계산
    const progressValues = Object.values(progressData).map(p => p.progress)
    const averageProgress = progressValues.length > 0
      ? Math.round(progressValues.reduce((a, b) => a + b, 0) / progressValues.length)
      : 0
    
    return { 
      success: true, 
      progress: progressData,
      averageProgress,
      totalStudents: students.length
    }
  } catch (error) {
    console.error('진행률 계산 오류:', error)
    return { success: false, error: error.message, progress: {}, averageProgress: 0, totalStudents: 0 }
  }
}

// 전시관별 완료 현황 계산
export const getHallProgress = async (schoolCode, grade, classNum) => {
  try {
    const studentsResult = await getTeacherStudents(schoolCode, grade, classNum)
    
    if (!studentsResult.success) {
      return { success: false, error: studentsResult.error, halls: [] }
    }
    
    const students = studentsResult.students
    
    // 전시관 정보 (EXHIBITION_HALL_ACTIVITIES를 동적으로 import)
    const { EXHIBITION_HALL_ACTIVITIES } = await import('../utils/activityOrder')
    
    const hallInfo = {
      '1_King_of_Joseon': { name: '1관: 조선의 국왕', color: 'orange', icon: 'crown', museum: 'palace' },
      '2_Royal_Life': { name: '2관: 왕실생활', color: 'blue', icon: 'home', museum: 'palace' },
      '3_Empire_of_Korea': { name: '3관: 대한제국', color: 'emerald', icon: 'flag', museum: 'palace' },
      '4_Palace_Painting': { name: '4관: 궁중서화', color: 'emerald', icon: 'palette', museum: 'palace' },
      '5_Royal_Ritual': { name: '5관: 왕실의례', color: 'orange', icon: 'celebration', museum: 'palace' },
      '6_Science_Culture': { name: '6관: 과학문화', color: 'blue', icon: 'science', museum: 'palace' },
      '1_Seoul_Joseon': { name: '1관: 조선의 서울', color: 'orange', icon: 'castle', museum: 'seoul' },
      '2_Seoul_Empire': { name: '2관: 대한제국의 서울', color: 'blue', icon: 'flag', museum: 'seoul' },
      '3_Seoul_Colonial': { name: '3관: 일제강점기의 서울', color: 'emerald', icon: 'history', museum: 'seoul' },
      '4_Seoul_Growth': { name: '4관: 성장하는 서울', color: 'orange', icon: 'trending_up', museum: 'seoul' }
    }
    
    // 학생 문서의 progress 요약 사용 (예전 문서만 추가로 읽음)
    const studentStatusMap = {}
    const statusPromises = students.map(async (student) => {
      studentStatusMap[student.studentId] = await getStudentStatus(student)
    })
    
    // 모든 학생의 상태를 병렬로 로드
    await Promise.all(statusPromises)
    
    const hallProgressData = {}
    
    // 각 전시관별로 진행률 계산 (이미 로드된 데이터 사용)
    for (const [hallId, activities] of Object.entries(EXHIBITION_HALL_ACTIVITIES)) {
      const totalActivities = activities.length
      let totalCompleted = 0
      let completedStudents = 0
      let inProgressStudents = 0
      
      // 각 학생의 해당 전시관 완료 상태 확인 (메모리에서 계산)
      for (const student of students) {
        const status = studentStatusMap[student.studentId] || {}
        const completedCount = activities.filter(activityId => status[activityId] === true).length
        const studentProgress = totalActivities > 0 ? (completedCount / totalActivities) * 100 : 0
        
        totalCompleted += completedCount
        
        if (studentProgress === 100) {
          completedStudents++
        } else if (studentProgress > 0) {
          inProgressStudents++
        }
      }
      
      // 평균 진행률 계산
      const averageProgress = students.length > 0 && totalActivities > 0
        ? Math.round((totalCompleted / (students.length * totalActivities)) * 100)
        : 0
      
      hallProgressData[hallId] = {
        id: hallId,
        name: hallInfo[hallId]?.name || hallId,
        missions: totalActivities,
        progress: averageProgress,
        inProgress: inProgressStudents,
        completed: completedStudents,
        color: hallInfo[hallId]?.color || 'orange',
        icon: hallInfo[hallId]?.icon || 'crown',
        museum: hallInfo[hallId]?.museum || 'palace'
      }
    }
    
    // 전시관 순서대로 정렬
    const hallOrder = [
      '1_King_of_Joseon', '2_Royal_Life', '3_Empire_of_Korea', '4_Palace_Painting', '5_Royal_Ritual', '6_Science_Culture',
      '1_Seoul_Joseon', '2_Seoul_Empire', '3_Seoul_Colonial', '4_Seoul_Growth'
    ]
    const halls = hallOrder
      .filter(hallId => hallProgressData[hallId])
      .map((hallId) => ({
        ...hallProgressData[hallId],
        museum: hallInfo[hallId]?.museum || 'palace'
      }))
    
    return { success: true, halls }
  } catch (error) {
    console.error('전시관별 진행률 계산 오류:', error)
    return { success: false, error: error.message, halls: [] }
  }
}

// 현재 접속 중인 학생 수 (마지막 활동 시간 기준)
export const getActiveStudentsCount = async (schoolCode, grade, classNum) => {
  try {
    const studentsResult = await getTeacherStudents(schoolCode, grade, classNum)
    
    if (!studentsResult.success) {
      return { success: false, error: studentsResult.error, count: 0 }
    }
    
    const now = Date.now()
    const activeThreshold = 5 * 60 * 1000 // 5분 이내 활동한 학생을 접속 중으로 간주
    let activeCount = 0
    
    // 학생 문서의 마지막 활동 시각으로 판단 (추가 읽기 없음)
    for (const student of studentsResult.students) {
      const lastActivity = student.lastActivityAt?.toMillis?.() || student.lastLogin?.toMillis?.() || 0
      if (now - lastActivity < activeThreshold) {
        activeCount++
      }
    }
    
    return { success: true, count: activeCount, total: studentsResult.students.length }
  } catch (error) {
    console.error('접속 학생 수 조회 오류:', error)
    return { success: false, error: error.message, count: 0, total: 0 }
  }
}

// ========== 이용 현황 집계 (개인정보 없음, 자동 삭제 대상 아님) ==========
// usageStats/{YYYY-MM}_{schoolCode}: { month, schoolCode, sessionsCreated, classes: { classId: { students, completed } } }

const currentMonth = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const usageStatsRef = (schoolCode) => {
  const month = currentMonth()
  return { ref: doc(db, 'usageStats', `${month}_${schoolCode}`), month }
}

// 교사가 수업 코드를 만들 때 +1
const recordSessionCreated = async (schoolCode) => {
  const { ref, month } = usageStatsRef(schoolCode)
  await setDoc(ref, {
    month,
    schoolCode: String(schoolCode),
    sessionsCreated: increment(1),
    updatedAt: serverTimestamp()
  }, { merge: true })
}

// 교사 화면을 열 때 우리 반 참여 학생 수·푼 문제 수를 기록 (같은 값이면 다시 쓰지 않음)
let lastClassUsage = ''
const recordClassUsage = async (schoolCode, grade, classNum, students, completed) => {
  if (!students) return // 활동 종료로 기록을 지운 뒤에는 덮어쓰지 않음
  const classId = `${schoolCode}-${grade}-${classNum}`
  const { ref, month } = usageStatsRef(schoolCode)
  const key = `${month}|${classId}|${students}|${completed}`
  if (key === lastClassUsage) return
  lastClassUsage = key
  await setDoc(ref, {
    month,
    schoolCode: String(schoolCode),
    classes: { [classId]: { students, completed, updatedAt: serverTimestamp() } },
    updatedAt: serverTimestamp()
  }, { merge: true })
}

// 관리자: 전체 이용 현황
export const getUsageStats = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'usageStats'))
    const stats = snapshot.docs.map((d) => {
      const data = d.data()
      const classes = Object.values(data.classes || {})
      return {
        id: d.id,
        month: data.month,
        schoolCode: data.schoolCode,
        sessionsCreated: data.sessionsCreated || 0,
        classCount: classes.length,
        students: classes.reduce((sum, c) => sum + (c.students || 0), 0),
        completed: classes.reduce((sum, c) => sum + (c.completed || 0), 0)
      }
    })
    stats.sort((a, b) => (a.month < b.month ? 1 : a.month > b.month ? -1 : 0))
    return { success: true, stats, currentMonth: currentMonth() }
  } catch (error) {
    console.error('이용 현황 조회 오류:', error)
    return { success: false, error: error.message, stats: [], currentMonth: currentMonth() }
  }
}

// ========== 수업 코드 (교사가 만들고 학생이 입력) ==========

// 헷갈리기 쉬운 글자(0/O, 1/I/L)는 뺀 6자리 코드
const SESSION_CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

const generateSessionCode = () => {
  const values = crypto.getRandomValues(new Uint32Array(6))
  return Array.from(values, (v) => SESSION_CODE_CHARS[v % SESSION_CODE_CHARS.length]).join('')
}

const normalizeSessionCode = (code) => String(code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '')

const isSessionOpen = (session) =>
  session && session.active === true && session.expiresAt?.toMillis?.() > Date.now()

// 교사: 우리 반의 사용 중인 수업 코드 조회
export const getActiveClassSession = async (schoolCode, grade, classNum) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('classId', '==', classId),
      where('active', '==', true)
    )
    const snapshot = await getDocs(sessionsQuery)
    const open = snapshot.docs
      .map((d) => d.data())
      .filter(isSessionOpen)
      .sort((a, b) => b.expiresAt.toMillis() - a.expiresAt.toMillis())
    return { success: true, session: open[0] || null }
  } catch (error) {
    console.error('수업 코드 조회 오류:', error)
    return { success: false, error: error.message, session: null }
  }
}

// 교사: 새 수업 코드 만들기 (기존 코드는 닫음)
export const createClassSession = async (schoolCode, grade, classNum) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    const current = await getActiveClassSession(schoolCode, grade, classNum)
    if (current.session) {
      await updateDoc(doc(db, 'sessions', current.session.code), { active: false })
    }

    // 코드가 겹치면 다시 만듭니다
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateSessionCode()
      const sessionRef = doc(db, 'sessions', code)
      const created = await runTransaction(db, async (transaction) => {
        const existing = await transaction.get(sessionRef)
        if (existing.exists()) return false
        transaction.set(sessionRef, {
          code,
          classId,
          schoolCode: String(schoolCode),
          grade: Number(grade),
          classNum: Number(classNum),
          active: true,
          createdAt: serverTimestamp(),
          expiresAt: daysFromNow(SESSION_VALID_DAYS)
        })
        return true
      })
      if (created) {
        recordSessionCreated(schoolCode).catch((error) => console.error('이용 현황 기록 오류:', error))
        const snap = await getDoc(sessionRef)
        return { success: true, session: snap.data() }
      }
    }
    return { success: false, error: '수업 코드를 만들지 못했습니다. 다시 시도해주세요.' }
  } catch (error) {
    console.error('수업 코드 생성 오류:', error)
    return { success: false, error: error.message }
  }
}

// 교사: 수업 코드 닫기 (더 이상 새로 입장할 수 없음)
export const closeClassSession = async (code) => {
  try {
    await updateDoc(doc(db, 'sessions', normalizeSessionCode(code)), { active: false })
    return { success: true }
  } catch (error) {
    console.error('수업 코드 닫기 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학생: 수업 코드 + 번호로 입장
// 익명 로그인된 상태(uid)에서 호출합니다. 같은 번호로 다른 기기에서 들어와도 같은 기록을 이어 씁니다.
export const joinClassSession = async (uid, sessionCode, number) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }

    const code = normalizeSessionCode(sessionCode)
    const numberNum = Number(number)
    if (!code || !Number.isInteger(numberNum) || numberNum < 1 || numberNum > 99) {
      return { success: false, error: '수업 코드와 번호를 확인해주세요.' }
    }

    const sessionDoc = await getDoc(doc(db, 'sessions', code))
    const session = sessionDoc.exists() ? sessionDoc.data() : null
    if (!isSessionOpen(session)) {
      return { success: false, error: '사용할 수 없는 수업 코드입니다.\n선생님께 코드를 다시 확인해주세요.' }
    }

    const { classId, schoolCode, grade, classNum } = session
    const studentId = `${classId}-${numberNum}`
    const expiresAt = daysFromNow(RETENTION_DAYS)

    // 학생 문서와 기기 연결 문서를 한 번에 씁니다 (보안 규칙이 두 문서를 함께 검사)
    // 교사 화면은 users를 classId로 조회하므로 별도 반 명단은 만들지 않습니다.
    const batch = writeBatch(db)
    batch.set(doc(db, 'users', studentId), {
      studentId,
      classId,
      schoolCode,
      grade,
      classNum,
      number: numberNum,
      sessionCode: code,
      members: arrayUnion(uid),
      lastLogin: serverTimestamp(),
      expiresAt
    }, { merge: true })
    batch.set(doc(db, 'members', uid), {
      studentId,
      classId,
      schoolCode,
      expiresAt
    })
    await batch.commit()
    studentIdCache.set(uid, studentId)

    return { success: true, studentId }
  } catch (error) {
    console.error('수업 입장 오류:', error)
    return { success: false, error: error.message }
  }
}

// ========== 메시지 (반 전체 공지) ==========
// 교사가 반 전체에 공지를 보내고 학생은 읽기만 합니다.
// 경로: classMessages/{classId}/messages/{messageId}, 30일 뒤 TTL로 자동 삭제

const classMessagesRef = (classId) => collection(db, 'classMessages', classId, 'messages')

const formatMessage = (id, data, studentId = null) => {
  const createdAt = data.createdAt?.toDate?.() || new Date()
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const messageDay = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()).getTime()

  let dateLabel = `${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`
  if (messageDay === today) dateLabel = '오늘'
  else if (messageDay === today - 86400000) dateLabel = '어제'

  const readBy = data.readBy || {}
  return {
    id,
    senderName: data.senderName || '담임 선생님',
    senderType: 'teacher',
    title: data.title || '공지',
    content: data.content || '',
    time: `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`,
    date: dateLabel,
    fullDate: createdAt.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
    createdAt,
    readCount: Object.keys(readBy).length,
    unread: studentId ? readBy[studentId] !== true : false
  }
}

// 학생이 속한 반 찾기 (현재 기기 기준)
const getStudentClass = async () => {
  const studentId = await resolveStudentId(auth?.currentUser?.uid)
  if (!studentId) return null
  const userDoc = await getDoc(doc(db, 'users', studentId))
  if (!userDoc.exists()) return null
  return { studentId, classId: userDoc.data().classId }
}

// 교사: 반 전체 공지 보내기
export const sendClassMessage = async (schoolCode, grade, classNum, title, content) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    const ref = doc(classMessagesRef(classId))
    await setDoc(ref, {
      classId,
      senderName: '담임 선생님',
      title: String(title).trim(),
      content: String(content).trim(),
      readBy: {},
      createdAt: serverTimestamp(),
      expiresAt: daysFromNow(RETENTION_DAYS)
    })
    return { success: true, id: ref.id }
  } catch (error) {
    console.error('공지 전송 오류:', error)
    return { success: false, error: error.message }
  }
}

// 교사: 보낸 공지 목록
export const getClassMessagesForTeacher = async (schoolCode, grade, classNum) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    const snapshot = await getDocs(query(classMessagesRef(classId), orderBy('createdAt', 'desc')))
    return { success: true, messages: snapshot.docs.map((d) => formatMessage(d.id, d.data())) }
  } catch (error) {
    console.error('공지 목록 조회 오류:', error)
    return { success: false, error: error.message, messages: [] }
  }
}

// 교사: 공지 하나 조회
export const getClassMessageForTeacher = async (schoolCode, grade, classNum, messageId) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    const snap = await getDoc(doc(classMessagesRef(classId), messageId))
    return { success: true, message: snap.exists() ? formatMessage(snap.id, snap.data()) : null }
  } catch (error) {
    console.error('공지 조회 오류:', error)
    return { success: false, error: error.message, message: null }
  }
}

// 교사: 공지 삭제
export const deleteClassMessage = async (schoolCode, grade, classNum, messageId) => {
  try {
    const classId = `${schoolCode}-${grade}-${classNum}`
    await deleteDoc(doc(classMessagesRef(classId), messageId))
    return { success: true }
  } catch (error) {
    console.error('공지 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// 학생: 우리 반 공지 목록
export const getClassMessagesForStudent = async () => {
  try {
    const student = await getStudentClass()
    if (!student) {
      return { success: false, error: '수업 정보를 찾을 수 없습니다. 다시 입장해주세요.', messages: [] }
    }
    const snapshot = await getDocs(query(classMessagesRef(student.classId), orderBy('createdAt', 'desc')))
    return {
      success: true,
      messages: snapshot.docs.map((d) => formatMessage(d.id, d.data(), student.studentId))
    }
  } catch (error) {
    console.error('반 공지 조회 오류:', error)
    return { success: false, error: error.message, messages: [] }
  }
}

// 학생: 공지 하나 조회 + 읽음 표시
export const openClassMessageForStudent = async (messageId) => {
  try {
    const student = await getStudentClass()
    if (!student) {
      return { success: false, error: '수업 정보를 찾을 수 없습니다.', message: null }
    }
    const ref = doc(classMessagesRef(student.classId), messageId)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      return { success: true, message: null }
    }
    if (snap.data().readBy?.[student.studentId] !== true) {
      // 읽음 표시는 실패해도 메시지는 보여줌
      updateDoc(ref, { [`readBy.${student.studentId}`]: true }).catch((error) => {
        console.error('읽음 처리 오류:', error)
      })
    }
    return { success: true, message: formatMessage(snap.id, snap.data()) }
  } catch (error) {
    console.error('공지 조회 오류:', error)
    return { success: false, error: error.message, message: null }
  }
}
