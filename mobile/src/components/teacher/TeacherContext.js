// 로그인한 선생님의 학교/학년/반 정보
// 웹은 localStorage('teacherData')에 저장했지만, 앱은 로그인 이메일 '{학교코드}-{학년}-{반}@teacher.local'에서 바로 꺼냅니다.
// 로그인 상태 자체는 Firebase가 휴대폰에 저장하므로 앱을 다시 켜도 그대로입니다.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../../lib/AuthContext'
import { logout } from '@shared/firebase/auth'
import { getSchoolInfo } from '@shared/firebase/firestore'
import { formatTeacherGroupLabel } from '@shared/utils/teacherGroupLabel'

const REMEMBER_KEY = 'teacherRemember'

export const isTeacher = (user) => !!user?.email?.endsWith('@teacher.local')

// 'SCHOOL-5-3@teacher.local' → { schoolCode: 'SCHOOL', grade: 5, classNum: 3 } (동아리는 grade 0)
export const parseTeacherEmail = (email) => {
  if (!email?.endsWith('@teacher.local')) return null
  const parts = email.replace('@teacher.local', '').split('-')
  if (parts.length < 3) return null
  const classNum = parseInt(parts.pop(), 10)
  const grade = parseInt(parts.pop(), 10)
  const schoolCode = parts.join('-')
  if (!schoolCode || Number.isNaN(grade) || Number.isNaN(classNum)) return null
  return { schoolCode, grade, classNum }
}

// 자동 로그인: 체크하면 앱을 다시 켜도 로그인 유지, 안 하면 다음 실행 때 로그아웃
let signedInThisRun = false
let launchChecked = false

export async function saveTeacherRemember(remember) {
  signedInThisRun = true
  try {
    await AsyncStorage.setItem(REMEMBER_KEY, remember ? '1' : '0')
  } catch {}
}

export async function teacherLogout() {
  try {
    await AsyncStorage.removeItem(REMEMBER_KEY)
  } catch {}
  return logout()
}

const TeacherContext = createContext({ teacher: null, ready: false, user: null })

export function TeacherProvider({ children }) {
  const { user, loading } = useAuth()
  const [checked, setChecked] = useState(launchChecked)
  const [schoolName, setSchoolName] = useState('')

  // 앱을 켠 뒤 처음 한 번: 자동 로그인을 끈 선생님이면 로그아웃
  useEffect(() => {
    if (loading || launchChecked) return
    launchChecked = true
    ;(async () => {
      if (isTeacher(user) && !signedInThisRun) {
        let remember = null
        try {
          remember = await AsyncStorage.getItem(REMEMBER_KEY)
        } catch {}
        if (remember === '0') await teacherLogout()
      }
      setChecked(true)
    })()
  }, [loading, user])

  const teacher = useMemo(() => (isTeacher(user) ? parseTeacherEmail(user.email) : null), [user])

  // 사이드 메뉴에 보여줄 학교 이름
  useEffect(() => {
    if (!teacher?.schoolCode) return
    let alive = true
    getSchoolInfo(teacher.schoolCode)
      .then((r) => alive && r?.success && setSchoolName(r.data?.schoolName || ''))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [teacher?.schoolCode])

  const value = useMemo(
    () => ({
      user,
      ready: !loading && checked,
      teacher: teacher ? { ...teacher, schoolName, label: formatTeacherGroupLabel(teacher) } : null,
    }),
    [user, loading, checked, teacher, schoolName]
  )

  return <TeacherContext.Provider value={value}>{children}</TeacherContext.Provider>
}

export const useTeacher = () => useContext(TeacherContext)
