// 메시지함 화면에서 같이 쓰는 도우미 (웹 StudentMessage의 읽음 처리)
import { markMessageAsRead } from '@shared/firebase/firestore'
import { getStudentProfile } from '../../lib/data'

// 반 메시지를 읽음으로 표시. 반 정보(classId)는 학생 정보에서 만듦
export async function markRead(user, message) {
  if (!message?.unread) return true
  try {
    const profile = await getStudentProfile(user)
    const { schoolCode, grade, classNum, studentId } = profile
    if (!schoolCode || !grade || !classNum) return false
    const result = await markMessageAsRead(message.id, `${schoolCode}-${grade}-${classNum}`, studentId)
    return !!result?.success
  } catch (e) {
    console.warn('메시지 읽음 처리 오류:', e)
    return false
  }
}

// 상세 화면용 날짜 "2026.10.08 14:05"
export function fullDateTime(message) {
  const d = message?.createdAt?.toDate ? message.createdAt.toDate() : message?.createdAt ? new Date(message.createdAt) : null
  if (!d || isNaN(d)) return message?.time || ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}
