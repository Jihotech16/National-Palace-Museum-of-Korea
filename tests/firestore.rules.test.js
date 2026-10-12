// Firestore 보안 규칙 테스트 (Firebase 에뮬레이터 필요)
// 실행: npm run test:rules
import { test, before, after, beforeEach } from 'node:test'
import { readFileSync } from 'node:fs'
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing'
import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  writeBatch,
  arrayUnion,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'

const CLASS_ID = 'S1-3-2'
const OTHER_CLASS_ID = 'S1-3-5'
const CODE = 'ABC234'
const CLOSED_CODE = 'CLS234'
const EXPIRED_CODE = 'EXP234'

const days = (n) => Timestamp.fromMillis(Date.now() + n * 24 * 60 * 60 * 1000)

let testEnv

const anon = (uid) =>
  testEnv.authenticatedContext(uid, { firebase: { sign_in_provider: 'anonymous' } }).firestore()

const teacher = (classId = CLASS_ID) =>
  testEnv
    .authenticatedContext(`teacher-${classId}`, {
      email: `${classId}@teacher.local`,
      firebase: { sign_in_provider: 'password' }
    })
    .firestore()

// 앱의 joinClassSession과 같은 형태의 입장 배치
const joinBatch = (db, uid, { code = CODE, classId = CLASS_ID, number = 5, studentId, extra = {} } = {}) => {
  const id = studentId || `${classId}-${number}`
  const batch = writeBatch(db)
  batch.set(doc(db, 'users', id), {
    studentId: id,
    classId,
    schoolCode: 'S1',
    grade: 3,
    classNum: 2,
    number,
    sessionCode: code,
    members: arrayUnion(uid),
    lastLogin: serverTimestamp(),
    expiresAt: days(30),
    ...extra
  }, { merge: true })
  batch.set(doc(db, 'members', uid), {
    studentId: id,
    classId,
    schoolCode: 'S1',
    expiresAt: days(30)
  })
  batch.set(doc(db, 'classes', classId, 'students', id), {
    studentId: id,
    number,
    isActive: true,
    joinedAt: serverTimestamp(),
    expiresAt: days(30)
  }, { merge: true })
  return batch.commit()
}

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-palace-rules',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') }
  })
})

after(async () => {
  await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore()
    for (const classId of [CLASS_ID, OTHER_CLASS_ID]) {
      await setDoc(doc(db, 'teachers', classId), { teacherId: classId, passwordHash: 'hash' })
    }
    await setDoc(doc(db, 'sessions', CODE), { code: CODE, classId: CLASS_ID, active: true, expiresAt: days(7) })
    await setDoc(doc(db, 'sessions', CLOSED_CODE), { code: CLOSED_CODE, classId: CLASS_ID, active: false, expiresAt: days(7) })
    await setDoc(doc(db, 'sessions', EXPIRED_CODE), { code: EXPIRED_CODE, classId: CLASS_ID, active: true, expiresAt: days(-1) })
  })
})

// ---------- 학생 입장 ----------

test('열린 수업 코드로 입장할 수 있다', async () => {
  await assertSucceeds(joinBatch(anon('dev1'), 'dev1'))
})

test('닫힌 코드나 만료된 코드로는 입장할 수 없다', async () => {
  await assertFails(joinBatch(anon('dev1'), 'dev1', { code: CLOSED_CODE }))
  await assertFails(joinBatch(anon('dev1'), 'dev1', { code: EXPIRED_CODE }))
  await assertFails(joinBatch(anon('dev1'), 'dev1', { code: 'NOPE99' }))
})

test('코드와 다른 반으로는 입장할 수 없다', async () => {
  await assertFails(joinBatch(anon('dev1'), 'dev1', { classId: OTHER_CLASS_ID }))
})

test('이름 같은 다른 필드는 저장할 수 없다', async () => {
  await assertFails(joinBatch(anon('dev1'), 'dev1', { extra: { name: '홍길동' } }))
  await assertFails(joinBatch(anon('dev1'), 'dev1', { extra: { schoolName: '테스트초' } }))
})

test('문서 ID는 반-번호와 일치해야 한다', async () => {
  await assertFails(joinBatch(anon('dev1'), 'dev1', { studentId: `${CLASS_ID}-9`, number: 5 }))
})

test('로그인하지 않았거나 교사 계정이면 학생으로 입장할 수 없다', async () => {
  await assertFails(joinBatch(testEnv.unauthenticatedContext().firestore(), 'nobody'))
  await assertFails(joinBatch(teacher(), `teacher-${CLASS_ID}`))
})

test('같은 번호로 다른 기기에서 다시 입장하면 기록을 이어 쓴다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  await assertSucceeds(joinBatch(anon('dev2'), 'dev2'))
  const snap = await getDoc(doc(anon('dev2'), 'users', `${CLASS_ID}-5`))
  const members = snap.data().members
  if (!members.includes('dev1') || !members.includes('dev2')) {
    throw new Error(`members가 이상함: ${members}`)
  }
})

test('다른 기기를 members에서 빼거나 다른 필드를 바꿀 수 없다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  const db = anon('dev2')
  await assertFails(updateDoc(doc(db, 'users', `${CLASS_ID}-5`), { members: ['dev2'], sessionCode: CODE }))
  await assertFails(updateDoc(doc(anon('dev1'), 'users', `${CLASS_ID}-5`), { number: 7 }))
})

// ---------- 읽기 / 활동 기록 ----------

test('학생은 자기 기록만 읽고 쓸 수 있다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  await joinBatch(anon('dev9'), 'dev9', { number: 9 })
  const me = anon('dev1')

  await assertSucceeds(getDoc(doc(me, 'users', `${CLASS_ID}-5`)))
  await assertSucceeds(setDoc(doc(me, 'users', `${CLASS_ID}-5`, 'activities', 'seal'), { completed: true }))
  await assertSucceeds(getDoc(doc(me, 'users', `${CLASS_ID}-5`, 'activities', 'seal')))

  await assertFails(getDoc(doc(me, 'users', `${CLASS_ID}-9`)))
  await assertFails(setDoc(doc(me, 'users', `${CLASS_ID}-9`, 'activities', 'seal'), { completed: true }))
  await assertFails(getDoc(doc(me, 'members', 'dev9')))
})

test('입장하지 않은 익명 기기는 활동 기록을 쓸 수 없다', async () => {
  await assertFails(setDoc(doc(anon('stranger'), 'users', `${CLASS_ID}-5`, 'activities', 'seal'), { completed: true }))
})

test('남의 학생 문서에 자기 기기를 몰래 연결할 수 없다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  await assertFails(setDoc(doc(anon('evil'), 'members', 'evil'), {
    studentId: `${CLASS_ID}-5`, classId: CLASS_ID, schoolCode: 'S1', expiresAt: days(30)
  }))
})

test('교사는 학생 기록과 활동을 읽을 수 있다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  await setDoc(doc(anon('dev1'), 'users', `${CLASS_ID}-5`, 'activities', 'seal'), { completed: true })
  const t = teacher()
  await assertSucceeds(getDoc(doc(t, 'users', `${CLASS_ID}-5`)))
  await assertSucceeds(getDocs(collection(t, 'users', `${CLASS_ID}-5`, 'activities')))
  await assertSucceeds(getDocs(collection(t, 'classes', CLASS_ID, 'students')))
})

// ---------- 수업 코드 ----------

test('교사는 자기 반 수업 코드만 만들고 닫을 수 있다', async () => {
  const t = teacher()
  await assertSucceeds(setDoc(doc(t, 'sessions', 'NEW234'), {
    code: 'NEW234', classId: CLASS_ID, active: true, expiresAt: days(7)
  }))
  await assertFails(setDoc(doc(t, 'sessions', 'BAD234'), {
    code: 'BAD234', classId: OTHER_CLASS_ID, active: true, expiresAt: days(7)
  }))
  await assertSucceeds(updateDoc(doc(t, 'sessions', CODE), { active: false }))
  await assertFails(updateDoc(doc(teacher(OTHER_CLASS_ID), 'sessions', 'NEW234'), { active: false }))
  await assertFails(updateDoc(doc(t, 'sessions', 'NEW234'), { expiresAt: days(365) }))
})

test('학생은 수업 코드를 만들거나 목록을 볼 수 없고, 코드로 조회만 할 수 있다', async () => {
  const db = anon('dev1')
  await assertFails(setDoc(doc(db, 'sessions', 'STU234'), {
    code: 'STU234', classId: CLASS_ID, active: true, expiresAt: days(7)
  }))
  await assertSucceeds(getDoc(doc(db, 'sessions', CODE)))
  await assertFails(getDocs(collection(db, 'sessions')))
})

test('교사는 자기 반 수업 코드 목록을 조회할 수 있다', async () => {
  const q = query(collection(teacher(), 'sessions'), where('classId', '==', CLASS_ID), where('active', '==', true))
  await assertSucceeds(getDocs(q))
})

// ---------- 활동 종료 (우리 반 기록 삭제) ----------

test('교사는 자기 반 학생 기록만 삭제할 수 있다', async () => {
  await joinBatch(anon('dev1'), 'dev1')
  await setDoc(doc(anon('dev1'), 'users', `${CLASS_ID}-5`, 'activities', 'seal'), { completed: true })
  const studentPath = ['users', `${CLASS_ID}-5`]

  // 다른 반 교사는 못 지움
  const other = teacher(OTHER_CLASS_ID)
  await assertFails(deleteDoc(doc(other, ...studentPath, 'activities', 'seal')))
  await assertFails(deleteDoc(doc(other, ...studentPath)))
  await assertFails(deleteDoc(doc(other, 'members', 'dev1')))

  // 학생은 남의 기록을 못 지움
  await joinBatch(anon('dev9'), 'dev9', { number: 9 })
  await assertFails(deleteDoc(doc(anon('dev9'), ...studentPath)))

  // 우리 반 교사: 활동 → 학생 문서 → 기기 연결 → 명단 → 수업 코드 순서로 삭제
  const t = teacher()
  const members = await assertSucceeds(getDocs(query(collection(t, 'members'), where('classId', '==', CLASS_ID))))
  if (members.size !== 2) throw new Error(`members 조회 결과가 이상함: ${members.size}`)
  await assertSucceeds(deleteDoc(doc(t, ...studentPath, 'activities', 'seal')))
  await assertSucceeds(deleteDoc(doc(t, ...studentPath)))
  await assertSucceeds(deleteDoc(doc(t, 'members', 'dev1')))
  await assertSucceeds(deleteDoc(doc(t, 'classes', CLASS_ID, 'students', `${CLASS_ID}-5`)))
  await assertSucceeds(deleteDoc(doc(t, 'sessions', CODE)))
})

test('교사는 다른 반 기기 연결 목록을 볼 수 없다', async () => {
  await assertFails(getDocs(query(collection(teacher(), 'members'), where('classId', '==', OTHER_CLASS_ID))))
})

// ---------- 반 공지 ----------

const announcement = (classId = CLASS_ID, extra = {}) => ({
  classId,
  senderName: '담임 선생님',
  title: '집합 안내',
  content: '2시까지 로비로 모여주세요.',
  readBy: {},
  createdAt: serverTimestamp(),
  expiresAt: days(30),
  ...extra
})

test('교사는 자기 반에만 공지를 보내고 지울 수 있다', async () => {
  const t = teacher()
  await assertSucceeds(setDoc(doc(t, 'classMessages', CLASS_ID, 'messages', 'n1'), announcement()))
  await assertFails(setDoc(doc(t, 'classMessages', OTHER_CLASS_ID, 'messages', 'n2'), announcement(OTHER_CLASS_ID)))
  await assertFails(setDoc(doc(t, 'classMessages', CLASS_ID, 'messages', 'n3'), announcement(CLASS_ID, { studentName: '홍길동' })))
  await assertSucceeds(getDocs(query(collection(t, 'classMessages', CLASS_ID, 'messages'), orderBy('createdAt', 'desc'))))
  await assertFails(deleteDoc(doc(teacher(OTHER_CLASS_ID), 'classMessages', CLASS_ID, 'messages', 'n1')))
  await assertSucceeds(deleteDoc(doc(t, 'classMessages', CLASS_ID, 'messages', 'n1')))
})

test('학생은 자기 반 공지만 읽고, 자기 읽음 표시만 할 수 있다', async () => {
  await setDoc(doc(teacher(), 'classMessages', CLASS_ID, 'messages', 'n1'), announcement())
  await setDoc(doc(teacher(OTHER_CLASS_ID), 'classMessages', OTHER_CLASS_ID, 'messages', 'n2'), announcement(OTHER_CLASS_ID))
  await joinBatch(anon('dev1'), 'dev1')
  const db = anon('dev1')
  const me = `${CLASS_ID}-5`

  await assertSucceeds(getDocs(query(collection(db, 'classMessages', CLASS_ID, 'messages'), orderBy('createdAt', 'desc'))))
  await assertFails(getDocs(collection(db, 'classMessages', OTHER_CLASS_ID, 'messages')))
  await assertFails(setDoc(doc(db, 'classMessages', CLASS_ID, 'messages', 'fake'), announcement()))

  const ref = doc(db, 'classMessages', CLASS_ID, 'messages', 'n1')
  await assertSucceeds(updateDoc(ref, { [`readBy.${me}`]: true }))
  await assertFails(updateDoc(ref, { [`readBy.${CLASS_ID}-9`]: true }))
  await assertFails(updateDoc(ref, { content: '바꿈' }))
  await assertFails(deleteDoc(ref))
})
