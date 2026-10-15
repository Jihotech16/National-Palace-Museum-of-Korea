// 테스트 모드용 데이터 채우기 (로컬 Firebase 에뮬레이터 전용, 실제 서버에는 접근하지 않음)
// npm run dev:test 가 에뮬레이터를 띄운 뒤 자동으로 실행합니다.
import { createHash } from 'node:crypto'
import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import { EXHIBITION_HALL_ACTIVITIES } from '../src/utils/activityOrder.js'

const PROJECT_ID = 'demo-palace'
const AUTH_URL = 'http://127.0.0.1:9099'

export const TEST_ACCOUNTS = {
  schoolCode: 'test',
  schoolName: '테스트초등학교',
  schoolPassword: 'test1234',
  grade: 3,
  classNum: 1,
  sessionCode: 'DEMO23',
  adminPassword: 'admin1234'
}

const { schoolCode, schoolName, schoolPassword, grade, classNum, sessionCode, adminPassword } = TEST_ACCOUNTS
const classId = `${schoolCode}-${grade}-${classNum}`
const DAY = 24 * 60 * 60 * 1000
const at = (offsetMs) => Timestamp.fromMillis(Date.now() + offsetMs)
const sha256 = (text) => createHash('sha256').update(String(text)).digest('hex')

const month = (offsetMonths = 0) => {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

// 관리자 계정 (Auth 에뮬레이터)
const createAdmin = async () => {
  const res = await fetch(`${AUTH_URL}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@admin.local', password: adminPassword, returnSecureToken: true })
  })
  if (!res.ok && !(await res.text()).includes('EMAIL_EXISTS')) {
    throw new Error('관리자 계정 생성 실패')
  }
}

const seedFirestore = async () => {
  const testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { host: '127.0.0.1', port: 8085 }
  })

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    const period = { startDate: at(-DAY), endDate: at(60 * DAY) }

    // 학교 + 학교 비밀번호 (교사는 이 비밀번호로 로그인하면 계정이 자동으로 만들어짐)
    await setDoc(doc(db, 'schools', schoolCode), {
      schoolName,
      schoolCode,
      museumPeriods: { palace: period, seoul: period },
      createdAt: at(-30 * DAY),
      updatedAt: at(0)
    })
    await setDoc(doc(db, 'schoolSecrets', schoolCode), { passwordHash: sha256(schoolPassword), updatedAt: at(0) })

    // 열려 있는 수업 코드
    await setDoc(doc(db, 'sessions', sessionCode), {
      code: sessionCode,
      classId,
      schoolCode,
      grade,
      classNum,
      active: true,
      createdAt: at(0),
      expiresAt: at(7 * DAY)
    })

    // 이미 활동 중인 학생들 (5번은 비워 두어 직접 입장해 볼 수 있게 함)
    const allActivities = Object.values(EXHIBITION_HALL_ACTIVITIES).flat()
    const doneCounts = { 1: 107, 2: 64, 3: 40, 4: 22, 6: 12, 7: 5, 8: 0 }
    let completedTotal = 0
    for (const [number, done] of Object.entries(doneCounts)) {
      const studentId = `${classId}-${number}`
      const progress = Object.fromEntries(allActivities.slice(0, done).map((id) => [id, true]))
      completedTotal += done
      await setDoc(doc(db, 'users', studentId), {
        studentId,
        classId,
        schoolCode,
        grade,
        classNum,
        number: Number(number),
        sessionCode,
        members: [],
        progress,
        lastLogin: at(-2 * 60 * 60 * 1000),
        // 1~3번은 방금 활동한 학생 (접속 중으로 표시)
        lastActivityAt: at(Number(number) <= 3 ? -60 * 1000 : -90 * 60 * 1000),
        expiresAt: at(30 * DAY)
      })
    }

    // 반 공지
    await setDoc(doc(db, 'classMessages', classId, 'messages', 'welcome'), {
      classId,
      senderName: '담임 선생님',
      title: '2시까지 로비로 모여주세요',
      content: '1층 로비 안내데스크 앞으로 오후 2시까지 모여주세요.\n늦을 것 같으면 선생님께 꼭 연락하세요!',
      readBy: { [`${classId}-1`]: true, [`${classId}-2`]: true },
      createdAt: at(-30 * 60 * 1000),
      expiresAt: at(30 * DAY)
    })

    // 이용 현황 (이번 달 + 지난달)
    await setDoc(doc(db, 'usageStats', `${month()}_${schoolCode}`), {
      month: month(),
      schoolCode,
      sessionsCreated: 1,
      classes: { [classId]: { students: Object.keys(doneCounts).length, completed: completedTotal, updatedAt: at(0) } },
      updatedAt: at(0)
    })
    await setDoc(doc(db, 'usageStats', `${month(-1)}_${schoolCode}`), {
      month: month(-1),
      schoolCode,
      sessionsCreated: 2,
      classes: {
        [`${schoolCode}-3-2`]: { students: 24, completed: 1830, updatedAt: at(-35 * DAY) },
        [`${schoolCode}-3-3`]: { students: 26, completed: 2104, updatedAt: at(-33 * DAY) }
      },
      updatedAt: at(-33 * DAY)
    })
  })

  await testEnv.cleanup()
}

await createAdmin()
await seedFirestore()

console.log(`
================ 테스트 모드 준비 완료 ================
 (실제 서비스 데이터와 완전히 분리된 로컬 데이터입니다)

 학생   탐험 시작하기 → 수업 코드 ${sessionCode} / 번호 5
        (1~8번 중 5번만 비어 있음, 9번 이상도 입장 가능)
 교사   교사 로그인 → 학교 코드 ${schoolCode} / ${grade}학년 ${classNum}반 / 비밀번호 ${schoolPassword}
 관리자 교사 로그인 → 학교 코드 Admin / 비밀번호 ${adminPassword}

 데이터 확인: http://127.0.0.1:4000/firestore (에뮬레이터 화면)
 종료: Ctrl + C (종료하면 테스트 데이터는 모두 사라짐)
=======================================================
`)
