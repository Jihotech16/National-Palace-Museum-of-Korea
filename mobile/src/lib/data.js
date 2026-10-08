// 화면에서 Firestore를 직접 읽던 부분을 모아둔 곳 (웹앱 ChoiceMuseum, StudentClear, StudentMessage에서 하던 일)
import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'
import { getSchoolInfo } from '@shared/firebase/firestore'

// 로그인한 학생의 학번 (이메일 '학번@student.local'에서 꺼냄)
export const studentIdOf = (user) => {
  if (user?.email?.endsWith('@student.local')) return user.email.replace('@student.local', '')
  return user?.uid || null
}

// users/{학번} 문서: 학교, 학년, 반, 번호, 이름
export async function getStudentProfile(user) {
  const studentId = studentIdOf(user)
  try {
    const snap = await getDoc(doc(db, 'users', studentId))
    if (!snap.exists()) return { studentId, schoolCode: null, schoolName: '', grade: 0, classNum: 0, number: 0 }
    const d = snap.data()
    return {
      ...d,
      studentId,
      schoolCode: d.schoolCode || null,
      schoolName: d.schoolName || '',
      grade: d.grade || 0,
      classNum: d.classNum || 0,
      number: d.number || 0,
    }
  } catch (e) {
    console.warn('학생 정보 로드 오류:', e)
    return { studentId, schoolCode: null, schoolName: '', grade: 0, classNum: 0, number: 0 }
  }
}

// 학교에 설정된 박물관별 활동 기간 { palace: {startDate, endDate}, seoul: {...} }
export async function getMuseumPeriods(schoolCode) {
  if (!schoolCode) return null
  const result = await getSchoolInfo(schoolCode)
  if (!result.success || !result.data) return null
  const data = result.data
  let periods = data.museumPeriods || null
  // 예전 방식(museumStartDate/End 하나만 있음)은 고궁 기간으로 봄
  if ((!periods || Object.keys(periods).length === 0) && data.museumStartDate && data.museumEndDate) {
    periods = { palace: { startDate: data.museumStartDate, endDate: data.museumEndDate } }
  }
  return periods
}

export { periodOf, isMuseumOpen, formatKoreanDateTime } from './period'
