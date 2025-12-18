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
  increment
} from 'firebase/firestore'
import { db } from './config'
import { checkAnswer, checkMultipleAnswers, ANSWERS } from '../utils/answerCheck'
import { getExhibitionHallFromActivityId } from '../utils/activityOrder'

// 사용자 활동지 데이터 저장 (구조 문서 기반)
export const saveActivityData = async (userId, activityId, data, questionData = null, userEmail = null) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다. Firebase Console에서 Firestore를 활성화해주세요.' }
    }
    
    if (!userId) {
      return { success: false, error: '사용자 ID가 없습니다.' }
    }
    
    // userId가 Firebase Auth UID인 경우, userEmail에서 학번 추출
    // userEmail 형식: {studentId}@student.local
    let studentId = userId
    
    // userId가 Firebase Auth UID 형식인지 확인 (28자 길이의 랜덤 문자열)
    const isFirebaseUID = userId && userId.length > 20 && !/^\d+$/.test(userId)
    
    if (isFirebaseUID) {
      // Firebase Auth UID인 경우, userEmail 파라미터에서 학번 추출
      // userEmail 형식: {studentId}@student.local
      if (userEmail && typeof userEmail === 'string' && userEmail.includes('@student.local')) {
        // userEmail에서 학번 추출
        studentId = userEmail.replace('@student.local', '')
      } else {
        // userEmail이 없으면 users/{userId} 문서에서 studentId 찾기 시도
        const userRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          studentId = userData.studentId || userId
        } else {
          console.error('학번을 찾을 수 없습니다. user.email을 전달해야 합니다.')
          return { success: false, error: '학번을 찾을 수 없습니다. user.email에서 학번을 추출할 수 없습니다.' }
        }
      }
    } else {
      // userId가 이미 학번 형식인 경우 (6자리 숫자)
      studentId = userId
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
      updatedAt: serverTimestamp()
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
    
    await setDoc(activityRef, saveData, { merge: true })
    
    return { success: true }
  } catch (error) {
    console.error('Firestore 저장 오류:', error)
    return { success: false, error: error.message || '저장 중 오류가 발생했습니다.' }
  }
}

// 활동지 완료 상태 확인
export const checkActivityCompleted = async (userId, activityId) => {
  try {
    const activityRef = doc(db, 'users', userId, 'activities', activityId)
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
    // userId가 Firebase Auth UID인 경우, userEmail에서 학번 추출
    let studentId = userId
    const isFirebaseUID = userId && userId.length > 20 && !/^\d+$/.test(userId)
    
    if (isFirebaseUID) {
      if (userEmail && userEmail.includes('@student.local')) {
        studentId = userEmail.replace('@student.local', '')
      } else {
        // userEmail이 없으면 users/{userId} 문서에서 studentId 찾기 시도
        const userRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          studentId = userData.studentId || userId
        }
      }
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
    
    // userId가 Firebase Auth UID인 경우, userEmail에서 학번 추출
    let studentId = userId
    const isFirebaseUID = userId && userId.length > 20 && !/^\d+$/.test(userId)
    
    if (isFirebaseUID) {
      if (userEmail && typeof userEmail === 'string' && userEmail.includes('@student.local')) {
        // userEmail에서 학번 추출
        studentId = userEmail.replace('@student.local', '')
      } else {
        // userEmail이 없으면 users/{userId} 문서에서 studentId 찾기 시도
        const userRef = doc(db, 'users', userId)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          studentId = userData.studentId || userId
        }
      }
    }
    
    const activitiesRef = collection(db, 'users', studentId, 'activities')
    const querySnapshot = await getDocs(activitiesRef)
    
    const status = {}
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      status[doc.id] = data.completed || false
    })
    
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

// 교사 정보 저장 (관리자가 사용)
export const createTeacherAccount = async (schoolCode, grade, classNum, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    const teacherId = `${schoolCode}-${grade}-${classNum}`
    const teacherRef = doc(db, 'teachers', teacherId)
    
    await setDoc(teacherRef, {
      teacherId, // 문서 ID와 동일한 값 저장
      schoolCode: String(schoolCode),
      grade: Number(grade),
      classNum: Number(classNum),
      password, // 평문 저장 (보안을 위해 나중에 해시로 변경 가능)
      createdAt: serverTimestamp(),
      lastLogin: null
    })
    
    return { success: true }
  } catch (error) {
    console.error('교사 계정 생성 오류:', error)
    return { success: false, error: error.message }
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
      password, // 평문 저장 (보안을 위해 나중에 해시로 변경 가능)
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
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

// 학교 비밀번호 변경
export const updateSchoolPassword = async (schoolCode, newPassword) => {
  try {
    return await updateSchool(schoolCode, { password: newPassword })
  } catch (error) {
    console.error('학교 비밀번호 변경 오류:', error)
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

// 학교의 모든 데이터 삭제 (활동 종료용)
export const deleteAllSchoolData = async (schoolCode, password) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    // 1. 학교 정보 확인 및 비밀번호 검증
    const schoolRef = doc(db, 'schools', schoolCode)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return { success: false, error: '학교 정보를 찾을 수 없습니다.' }
    }
    
    const schoolData = schoolDoc.data()
    if (schoolData.password !== password) {
      return { success: false, error: '비밀번호가 일치하지 않습니다.' }
    }
    
    // 2. 해당 학교의 모든 users 문서 삭제
    const usersRef = collection(db, 'users')
    const usersQuery = query(usersRef, where('schoolCode', '==', schoolCode))
    const usersSnapshot = await getDocs(usersQuery)
    
    const deletePromises = []
    
    // 각 user의 activities 서브컬렉션 삭제
    for (const userDoc of usersSnapshot.docs) {
      const activitiesRef = collection(db, 'users', userDoc.id, 'activities')
      const activitiesSnapshot = await getDocs(activitiesRef)
      activitiesSnapshot.forEach((activityDoc) => {
        deletePromises.push(deleteDoc(activityDoc.ref))
      })
      
      // user 문서 삭제
      deletePromises.push(deleteDoc(userDoc.ref))
    }
    
    // 3. 해당 학교의 모든 classes 문서 및 서브컬렉션 삭제
    const classesRef = collection(db, 'classes')
    const classesQuery = query(classesRef, where('schoolCode', '==', schoolCode))
    const classesSnapshot = await getDocs(classesQuery)
    
    for (const classDoc of classesSnapshot.docs) {
      // students 서브컬렉션 삭제
      const studentsRef = collection(db, 'classes', classDoc.id, 'students')
      const studentsSnapshot = await getDocs(studentsRef)
      studentsSnapshot.forEach((studentDoc) => {
        deletePromises.push(deleteDoc(studentDoc.ref))
      })
      
      // class 문서 삭제
      deletePromises.push(deleteDoc(classDoc.ref))
    }
    
    // 4. 해당 학교의 모든 teachers 문서 삭제
    const teachersRef = collection(db, 'teachers')
    const teachersQuery = query(teachersRef, where('schoolCode', '==', schoolCode))
    const teachersSnapshot = await getDocs(teachersQuery)
    teachersSnapshot.forEach((teacherDoc) => {
      deletePromises.push(deleteDoc(teacherDoc.ref))
    })
    
    // 5. 해당 학교의 모든 messages 문서 삭제 (senderId나 receiverId가 해당 학교 학생인 경우)
    // messages 컬렉션이 있다면 삭제 (구조에 따라 조정 필요)
    try {
      const messagesRef = collection(db, 'messages')
      const messagesSnapshot = await getDocs(messagesRef)
      messagesSnapshot.forEach((messageDoc) => {
        const messageData = messageDoc.data()
        // senderId나 receiverId가 해당 학교 학생인지 확인
        if (messageData.senderId && messageData.senderId.startsWith(schoolCode)) {
          deletePromises.push(deleteDoc(messageDoc.ref))
        } else if (messageData.receiverId && messageData.receiverId.startsWith(schoolCode)) {
          deletePromises.push(deleteDoc(messageDoc.ref))
        }
      })
    } catch (error) {
      // messages 컬렉션이 없을 수 있으므로 에러 무시
      console.log('messages 컬렉션 삭제 중 오류 (무시됨):', error)
    }
    
    // 6. schools 문서 삭제
    deletePromises.push(deleteDoc(schoolRef))
    
    // 모든 삭제 작업 실행
    await Promise.all(deletePromises)
    
    return { success: true }
  } catch (error) {
    console.error('학교 데이터 삭제 오류:', error)
    return { success: false, error: error.message }
  }
}

// ========== 교사 대시보드 관련 함수 ==========


// 교사의 반 학생 목록 가져오기
// 문서 구조에 따라 classes 컬렉션을 우선 사용하고, 없으면 users 컬렉션에서 조회
export const getTeacherStudents = async (schoolCode, grade, classNum) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', students: [] }
    }
    
    // 인증 상태 확인
    const { auth } = await import('./config')
    if (!auth || !auth.currentUser) {
      console.error('인증되지 않은 사용자입니다. Firebase Authentication에 로그인되어 있지 않습니다.')
      return { success: false, error: '인증되지 않은 사용자입니다. 다시 로그인해주세요.', students: [] }
    }
    
    console.log('현재 인증된 사용자:', {
      email: auth.currentUser.email,
      uid: auth.currentUser.uid
    })
    
    const classId = `${schoolCode}-${grade}-${classNum}`
    console.log('조회할 classId:', classId)
    
    // 방법 1: classes 컬렉션에서 조회 (문서 구조 권장 방식)
    try {
      const studentsRef = collection(db, 'classes', classId, 'students')
      console.log('classes 컬렉션 조회 시도:', `classes/${classId}/students`)
      const studentsSnapshot = await getDocs(studentsRef)
      
      if (studentsSnapshot.size > 0) {
        const students = []
        
        // 각 학생의 상세 정보를 users 컬렉션에서 가져오기
        for (const studentDoc of studentsSnapshot.docs) {
          const studentData = studentDoc.data()
          const studentId = studentData.studentId
          
          // users 컬렉션에서 상세 정보 조회
          const userRef = doc(db, 'users', studentId)
          const userDoc = await getDoc(userRef)
          
          if (userDoc.exists()) {
            students.push({
              studentId,
              number: studentData.number || 0,
              isActive: studentData.isActive !== false,
              ...userDoc.data()
            })
          } else {
            // users에 없어도 classes에 있으면 기본 정보만 포함
            students.push({
              studentId,
              number: studentData.number || 0,
              isActive: studentData.isActive !== false,
              ...studentData
            })
          }
        }
        
        // 번호 순으로 정렬
        students.sort((a, b) => a.number - b.number)
        
        return { success: true, students }
      }
    } catch (classesError) {
      console.warn('classes 컬렉션 조회 실패, users 컬렉션에서 조회합니다:', classesError)
    }
    
    // 방법 2: classes 컬렉션이 없거나 비어있으면 users 컬렉션에서 직접 조회 (하위 호환성)
    const usersRef = collection(db, 'users')
    const usersSnapshot = await getDocs(usersRef)
    
    const students = []
    usersSnapshot.forEach((userDoc) => {
      const userId = userDoc.id
      const parsed = parseStudentId(userId)
      
      if (parsed && 
          parsed.schoolCode === String(schoolCode) && 
          parsed.grade === grade && 
          parsed.classNum === classNum) {
        students.push({
          studentId: userId,
          number: parsed.number,
          isActive: true,
          ...userDoc.data()
        })
      }
    })
    
    // 번호 순으로 정렬
    students.sort((a, b) => a.number - b.number)
    
    return { success: true, students }
  } catch (error) {
    console.error('학생 목록 조회 오류:', error)
    return { success: false, error: error.message, students: [] }
  }
}

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
    const statusPromises = students.map(async (student) => {
      const activitiesResult = await getAllActivityStatus(student.studentId)
      if (activitiesResult.success) {
        const completedCount = Object.values(activitiesResult.status).filter(Boolean).length
        const progress = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
        progressData[student.studentId] = {
          completed: completedCount,
          total: totalActivities,
          progress
        }
      }
    })
    
    // 모든 학생의 상태를 병렬로 로드
    await Promise.all(statusPromises)
    
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
      '1_King_of_Joseon': { name: '1관: 조선의 국왕', color: 'orange', icon: 'crown' },
      '2_Royal_Life': { name: '2관: 왕실생활', color: 'blue', icon: 'home' },
      '3_Empire_of_Korea': { name: '3관: 대한제국', color: 'emerald', icon: 'flag' },
      '4_Palace_Painting': { name: '4관: 궁중서화', color: 'emerald', icon: 'palette' },
      '5_Royal_Ritual': { name: '5관: 왕실의례', color: 'orange', icon: 'celebration' },
      '6_Science_Culture': { name: '6관: 과학문화', color: 'blue', icon: 'science' }
    }
    
    // 모든 학생의 활동 상태를 한 번에 병렬로 가져오기 (성능 최적화)
    const studentStatusMap = {}
    const statusPromises = students.map(async (student) => {
      const activitiesResult = await getAllActivityStatus(student.studentId)
      if (activitiesResult.success) {
        studentStatusMap[student.studentId] = activitiesResult.status || {}
      } else {
        studentStatusMap[student.studentId] = {}
      }
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
        icon: hallInfo[hallId]?.icon || 'crown'
      }
    }
    
    // 전시관 순서대로 정렬
    const hallOrder = ['1_King_of_Joseon', '2_Royal_Life', '3_Empire_of_Korea', '4_Palace_Painting', '5_Royal_Ritual', '6_Science_Culture']
    const halls = hallOrder
      .filter(hallId => hallProgressData[hallId])
      .map((hallId, index) => ({
        ...hallProgressData[hallId],
        id: index + 1 // 1부터 시작하는 ID
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
    
    // Firebase Auth에서 현재 접속 중인 사용자 확인
    // 모든 students를 확인하되, activities가 최근에 업데이트된 경우 접속 중으로 간주
    for (const student of studentsResult.students) {
      try {
        // 학생의 activities 컬렉션에서 최근 활동 확인
        const activitiesRef = collection(db, 'users', student.studentId, 'activities')
        const activitiesSnapshot = await getDocs(activitiesRef)
        
        let isActive = false
        activitiesSnapshot.forEach((activityDoc) => {
          const activityData = activityDoc.data()
          const updatedAt = activityData.updatedAt?.toMillis?.() || 0
          
          if (now - updatedAt < activeThreshold) {
            isActive = true
          }
        })
        
        if (isActive) {
          activeCount++
        }
      } catch (err) {
        // 활동 데이터가 없어도 계속 진행
        console.warn(`학생 ${student.studentId}의 활동 데이터 확인 실패:`, err)
      }
    }
    
    return { success: true, count: activeCount, total: studentsResult.students.length }
  } catch (error) {
    console.error('접속 학생 수 조회 오류:', error)
    return { success: false, error: error.message, count: 0, total: 0 }
  }
}

// ========== 학생 로그인 관련 함수 ==========

// 학번에서 학교 코드, 학년, 반, 번호 추출
export const parseStudentId = (studentId) => {
  // 학번 형식: {schoolCode}{grade}{classNum}{number}
  // 예: 132015 = 학교1, 3학년, 20반, 15번
  const idStr = String(studentId)
  if (idStr.length < 6) return null
  
  // 학교 코드는 첫 1자리, 학년은 2번째, 반은 3-4번째, 번호는 5-6번째
  const schoolCode = idStr.substring(0, 1)
  const grade = parseInt(idStr.substring(1, 2))
  const classNum = parseInt(idStr.substring(2, 4))
  const number = parseInt(idStr.substring(4, 6))
  
  return { schoolCode, grade, classNum, number }
}

// 학생 정보 저장/업데이트 (로그인 시 호출)
export const createOrUpdateStudent = async (studentId, schoolCode, grade, classNum, number, schoolName) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    // 숫자 변환 및 유효성 검사
    // grade, classNum, number가 이미 숫자인지 확인
    let gradeNum, classNumNum, numberNum
    
    if (typeof grade === 'number') {
      gradeNum = isNaN(grade) ? 0 : grade
    } else {
      const gradeStr = String(grade || '').trim()
      gradeNum = gradeStr === '' || isNaN(Number(gradeStr)) ? 0 : Number(gradeStr)
    }
    
    if (typeof classNum === 'number') {
      classNumNum = isNaN(classNum) ? 0 : classNum
    } else {
      const classNumStr = String(classNum || '').trim()
      classNumNum = classNumStr === '' || isNaN(Number(classNumStr)) ? 0 : Number(classNumStr)
    }
    
    if (typeof number === 'number') {
      numberNum = isNaN(number) ? 0 : number
    } else {
      const numberStr = String(number || '').trim()
      numberNum = numberStr === '' || isNaN(Number(numberStr)) ? 0 : Number(numberStr)
    }
    
    const schoolCodeStr = String(schoolCode || '1').trim()
    
    // 디버깅: 값 확인
    console.log('createOrUpdateStudent - 입력값:', { 
      studentId, 
      schoolCode, 
      grade, 
      classNum, 
      number, 
      schoolName,
      gradeType: typeof grade,
      classNumType: typeof classNum,
      numberType: typeof number
    })
    console.log('createOrUpdateStudent - 변환된 값:', { 
      gradeNum, 
      classNumNum, 
      numberNum, 
      schoolCodeStr,
      gradeNumType: typeof gradeNum,
      classNumNumType: typeof classNumNum,
      numberNumType: typeof numberNum
    })
    
    const classId = `${schoolCodeStr}-${gradeNum}-${classNumNum}`
    
    // 트랜잭션으로 여러 문서를 원자적으로 업데이트
    await runTransaction(db, async (transaction) => {
      // 모든 읽기를 먼저 수행
      const userRef = doc(db, 'users', studentId)
      const studentInClassRef = doc(db, 'classes', classId, 'students', studentId)
      const classRef = doc(db, 'classes', classId)
      
      const userDoc = await transaction.get(userRef)
      const studentInClassDoc = await transaction.get(studentInClassRef)
      const classDoc = await transaction.get(classRef)
      
      // 모든 쓰기 작업 수행
      // 1. users/{studentId} 문서 생성/업데이트
      if (userDoc.exists()) {
        // 기존 문서 업데이트 (값이 잘못 저장된 경우를 대비해 모든 필드 업데이트)
        transaction.update(userRef, {
          schoolCode: schoolCodeStr,
          grade: gradeNum,
          classNum: classNumNum,
          number: numberNum,
          schoolName: schoolName || userDoc.data()?.schoolName || null,
          lastLogin: serverTimestamp(),
          lastActivity: serverTimestamp()
        })
      } else {
        // 새 문서 생성
        transaction.set(userRef, {
          studentId,
          schoolCode: schoolCodeStr,
          grade: gradeNum,
          classNum: classNumNum,
          number: numberNum,
          schoolName: schoolName || null,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          lastActivity: serverTimestamp()
        })
      }
      
      // 2. classes/{classId}/students/{studentId} 문서 생성/업데이트
      const isNewStudent = !studentInClassDoc.exists()
      
      if (studentInClassDoc.exists()) {
        // 기존 문서 업데이트
        transaction.update(studentInClassRef, {
          isActive: true
        })
      } else {
        // 새 문서 생성
        transaction.set(studentInClassRef, {
          studentId,
          number: numberNum,
          joinedAt: serverTimestamp(),
          isActive: true
        })
      }
      
      // 3. classes/{classId} 문서 생성/업데이트
      if (classDoc.exists()) {
        // 기존 문서 업데이트 (totalStudents는 학생이 새로 추가된 경우에만 증가)
        if (isNewStudent) {
          transaction.update(classRef, {
            totalStudents: increment(1),
            updatedAt: serverTimestamp()
          })
        } else {
          transaction.update(classRef, {
            updatedAt: serverTimestamp()
          })
        }
      } else {
        // 새 문서 생성
        // teacherId는 교사가 로그인할 때 설정되므로 여기서는 null로 설정
        transaction.set(classRef, {
          classId,
          schoolCode: schoolCodeStr,
          grade: gradeNum,
          classNum: classNumNum,
          teacherId: null, // 교사가 로그인할 때 설정됨
          totalStudents: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    })
    
    return { success: true }
  } catch (error) {
    console.error('학생 정보 저장 오류:', error)
    return { success: false, error: error.message }
  }
}

// ========== 메시지 관련 함수 ==========

// 학생의 반 메시지 조회
export const getClassMessagesForStudent = async (userEmail = null) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.', messages: [] }
    }

    // userEmail에서 학번 추출
    let studentId = null
    let email = userEmail
    
    // userEmail이 없으면 Firebase Authentication에서 현재 사용자 이메일 가져오기
    if (!email) {
      const { auth } = await import('./config')
      if (auth && auth.currentUser && auth.currentUser.email) {
        email = auth.currentUser.email
      }
    }
    
    // 이메일에서 학번 추출
    if (email && typeof email === 'string' && email.includes('@student.local')) {
      studentId = email.replace('@student.local', '')
    } else {
      console.error('학번을 찾을 수 없습니다. userEmail:', userEmail, 'email:', email)
      return { success: false, error: '학번을 찾을 수 없습니다. 로그인 상태를 확인해주세요.', messages: [] }
    }

    // 학생 정보 조회 (classId 계산을 위해)
    const userRef = doc(db, 'users', studentId)
    const userDoc = await getDoc(userRef)
    
    if (!userDoc.exists()) {
      return { success: false, error: '학생 정보를 찾을 수 없습니다.', messages: [] }
    }

    const userData = userDoc.data()
    const { schoolCode, grade, classNum } = userData
    
    if (!schoolCode || grade === undefined || classNum === undefined) {
      return { success: false, error: '학생 정보가 불완전합니다.', messages: [] }
    }

    const classId = `${schoolCode}-${grade}-${classNum}`
    
    // 반 전체 메시지 조회
    // messages/class/{classId}/messages 구조이므로
    // 먼저 messages/class/{classId} 문서를 참조한 후 messages 서브컬렉션에 접근
    const classDocRef = doc(db, 'messages', 'class', classId)
    const messagesRef = collection(classDocRef, 'messages')
    const messagesQuery = query(messagesRef, orderBy('createdAt', 'desc'))
    const messagesSnapshot = await getDocs(messagesQuery)
    
    const messages = []
    messagesSnapshot.forEach((doc) => {
      const data = doc.data()
      const readBy = data.readBy || {}
      const isRead = readBy[studentId] === true
      
      // 날짜 포맷팅
      const createdAt = data.createdAt?.toDate() || new Date()
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const messageDate = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())
      
      let dateLabel = ''
      if (messageDate.getTime() === today.getTime()) {
        dateLabel = '오늘'
      } else if (messageDate.getTime() === today.getTime() - 86400000) {
        dateLabel = '어제'
      } else {
        dateLabel = `${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`
      }
      
      const timeLabel = `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')}`
      
      messages.push({
        id: doc.id,
        messageId: data.messageId || doc.id,
        senderName: data.senderName || '담임 선생님',
        senderType: data.senderType || 'teacher',
        title: data.title || data.content?.substring(0, 30) || '메시지',
        content: data.content || '',
        time: timeLabel,
        date: dateLabel,
        unread: !isRead,
        createdAt: createdAt,
        type: data.type || 'normal',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdMahZwk3CKqk_U4LTnQjEW9g0Ny_C3zbIMZrpZRtM7EMABGf6afEQ8hz3VkX7fgE8Qs66kgjFLw9bpl0PQzmFnSPU92YWkkspsGPFbrdFKAXct2oHc_ZSX8uhc24-3Yepj525DdT3HSI8A7k9nUiN01COPM24tbkv4XuOE90smcjTh2LS1LU7RXQfDb5HwB-d6b4uCS8-a1BHj0k1dTYW_m3wb3vncRdnczH7UTKMd5IbEdpdZmvkmfQLDQXXwISCRv_rhdrFzeJX'
      })
    })
    
    return { success: true, messages }
  } catch (error) {
    console.error('반 메시지 조회 오류:', error)
    return { success: false, error: error.message, messages: [] }
  }
}

// 메시지 읽음 처리
export const markMessageAsRead = async (messageId, classId, studentId) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }

    const messageRef = doc(db, 'messages', 'class', classId, 'messages', messageId)
    const messageDoc = await getDoc(messageRef)
    
    if (!messageDoc.exists()) {
      return { success: false, error: '메시지를 찾을 수 없습니다.' }
    }

    const messageData = messageDoc.data()
    const readBy = messageData.readBy || {}
    
    // 이미 읽음 처리되어 있으면 스킵
    if (readBy[studentId] === true) {
      return { success: true }
    }

    // 읽음 처리
    readBy[studentId] = true
    
    await updateDoc(messageRef, {
      readBy,
      updatedAt: serverTimestamp()
    })
    
    return { success: true }
  } catch (error) {
    console.error('메시지 읽음 처리 오류:', error)
    return { success: false, error: error.message }
  }
}

