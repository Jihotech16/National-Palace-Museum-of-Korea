# Firebase Database 구조 설계 문서

## 개요

학생 로그인 시 교사와 자동으로 연동되도록 설계된 Firebase Firestore 데이터베이스 구조입니다.

## 학번 형식

학번은 다음과 같은 형식으로 구성됩니다:
- **형식**: `{schoolCode}{grade}{classNum}{number}`
- **예시**: `132015` = 학교코드 1, 3학년, 20반, 15번
- **길이**: 6자리 (학교코드 1자리 + 학년 1자리 + 반 2자리 + 번호 2자리)

## Firestore 컬렉션 구조

### 1. `users` 컬렉션

학생 개인 정보 및 활동 데이터를 저장합니다.

**경로**: `users/{studentId}`

**문서 ID**: 학번 (예: `132015`)

**필드**:
```javascript
{
  studentId: "132015",              // 학번 (문서 ID와 동일)
  schoolCode: "1",                   // 학교 코드
  grade: 3,                          // 학년 (숫자)
  classNum: 20,                      // 반 (숫자)
  number: 15,                        // 번호 (숫자)
  schoolName: "테스트학교",          // 학교 이름 (선택)
  createdAt: Timestamp,              // 계정 생성 시간
  lastLogin: Timestamp,              // 마지막 로그인 시간
  lastActivity: Timestamp            // 마지막 활동 시간
}
```

**서브컬렉션**: `users/{studentId}/activities/{activityId}`
- 학생의 활동지 및 문제 풀이 결과 저장

**활동지 문서 필드**:
```javascript
{
  activityId: "sealKing",              // 활동지 ID (문서 ID와 동일)
  questionNumber: "01",                 // 문제 번호
  title: "조선의 국왕",                  // 문제 제목
  exhibitionHall: "1관",                 // 전시관 (1관, 2관, 3관 등)
  
  // 문제 풀이 결과
  completed: true,                      // 완료 여부
  isCorrect: true,                       // 정답 여부
  attempts: 1,                          // 시도 횟수
  studentAnswer: "세종",                // 학생이 입력한 답
  correctAnswer: "세종",                // 정답
  answerField: "kingAnswer",            // 답변 필드명
  
  // 다중 답변의 경우 (예: nature 활동지)
  studentAnswers: ["해", "달", "물", "소나무", "산봉우리"], // 학생 답변 배열
  correctAnswers: ["해", "달", "물", "소나무", "산봉우리"], // 정답 배열
  
  // 타임스탬프
  startedAt: Timestamp,                 // 시작 시간
  submittedAt: Timestamp,               // 제출 시간
  completedAt: Timestamp,               // 완료 시간
  updatedAt: Timestamp                  // 최종 업데이트 시간
}
```

**예시**:
```
users/
  └── 132015/
      ├── studentId: "132015"
      ├── schoolCode: "1"
      ├── grade: 3
      ├── classNum: 20
      ├── number: 15
      ├── createdAt: 2024-01-15T10:30:00Z
      ├── lastLogin: 2024-01-20T14:25:00Z
      └── activities/
          ├── sealKing/
          │   ├── activityId: "sealKing"
          │   ├── questionNumber: "01"
          │   ├── title: "조선의 국왕"
          │   ├── exhibitionHall: "1관"
          │   ├── completed: true
          │   ├── isCorrect: true
          │   ├── attempts: 1
          │   ├── studentAnswer: "세종"
          │   ├── correctAnswer: "세종"
          │   ├── submittedAt: 2024-01-20T10:30:00Z
          │   └── completedAt: 2024-01-20T10:30:00Z
          ├── nature/
          │   ├── activityId: "nature"
          │   ├── questionNumber: "02"
          │   ├── completed: true
          │   ├── isCorrect: true
          │   ├── attempts: 2
          │   ├── studentAnswers: ["해", "달", "물", "소나무", "산봉우리"]
          │   ├── correctAnswers: ["해", "달", "물", "소나무", "산봉우리"]
          │   └── ...
          └── seal/
              └── ...
```

---

### 2. `classes` 컬렉션

반별로 학생들을 그룹화하여 관리합니다. 교사가 자신의 반 학생을 효율적으로 조회할 수 있도록 합니다.

**경로**: `classes/{classId}/students/{studentId}`

**클래스 ID 형식**: `{schoolCode}-{grade}-{classNum}` (예: `1-3-20`)

**클래스 문서 필드**:
```javascript
{
  classId: "1-3-20",                 // 클래스 ID (문서 ID와 동일)
  schoolCode: "1",                    // 학교 코드
  grade: 3,                           // 학년
  classNum: 20,                       // 반
  teacherId: "1-3-20",                // 담임 교사 ID (teachers 컬렉션 참조)
  totalStudents: 28,                  // 전체 학생 수
  createdAt: Timestamp,               // 생성 시간
  updatedAt: Timestamp                // 업데이트 시간
}
```

**서브컬렉션**: `classes/{classId}/students/{studentId}`
- 반에 속한 학생들의 참조 정보 저장

**학생 문서 필드**:
```javascript
{
  studentId: "132015",                // 학번
  number: 15,                         // 번호
  joinedAt: Timestamp,                // 반에 추가된 시간
  isActive: true                      // 활성 상태
}
```

**예시**:
```
classes/
  └── 1-3-20/
      ├── classId: "1-3-20"
      ├── schoolCode: "1"
      ├── grade: 3
      ├── classNum: 20
      ├── teacherId: "1-3-20"
      ├── totalStudents: 28
      └── students/
          ├── 132001/
          │   ├── studentId: "132001"
          │   ├── number: 1
          │   └── isActive: true
          ├── 132002/
          ├── ...
          └── 132015/
              ├── studentId: "132015"
              ├── number: 15
              └── isActive: true
```

---

### 3. `teachers` 컬렉션

교사 계정 정보를 저장합니다. (기존 구조 유지)

**경로**: `teachers/{teacherId}`

**문서 ID 형식**: `{schoolCode}-{grade}-{classNum}` (예: `1-3-20`)

**필드**:
```javascript
{
  teacherId: "1-3-20",                // 교사 ID (문서 ID와 동일)
  schoolCode: "1",                     // 학교 코드
  grade: 3,                            // 학년
  classNum: 20,                        // 반
  password: "teacher123",              // 비밀번호 (평문, 향후 해시화 권장)
  createdAt: Timestamp,                // 계정 생성 시간
  lastLogin: Timestamp                 // 마지막 로그인 시간
}
```

**예시**:
```
teachers/
  └── 1-3-20/
      ├── teacherId: "1-3-20"
      ├── schoolCode: "1"
      ├── grade: 3
      ├── classNum: 20
      ├── password: "teacher123"
      ├── createdAt: 2024-01-01T00:00:00Z
      └── lastLogin: 2024-01-20T09:00:00Z
```

---

### 4. `messages` 컬렉션

교사와 학생 간의 채팅 메시지를 저장합니다.

**경로 구조**:
- 반 전체 채팅: `messages/class/{classId}/messages/{messageId}`
- 개별 채팅: `messages/private/{chatId}/messages/{messageId}`

**채팅 ID 형식**:
- 반 전체: `class-{classId}` (예: `class-1-3-20`)
- 개별 채팅: `{teacherId}-{studentId}` (예: `1-3-20-132015`)

#### 4-1. 반 전체 채팅 (공지사항/격려 메시지)

**경로**: `messages/class/{classId}/messages/{messageId}`

**메시지 문서 필드**:
```javascript
{
  messageId: "msg_1234567890",         // 메시지 ID (자동 생성)
  classId: "1-3-20",                   // 반 ID
  senderId: "1-3-20",                  // 발신자 ID (교사 ID)
  senderType: "teacher",               // 발신자 타입: "teacher" | "student"
  senderName: "김선생님",              // 발신자 이름
  content: "모두 수고하셨습니다!",     // 메시지 내용
  type: "announcement",                // 메시지 타입: "announcement" | "encouragement" | "normal"
  readBy: {                            // 읽음 상태 (맵)
    "132015": true,                    // 학생 ID: 읽음 여부
    "132016": false,
    // ...
  },
  createdAt: Timestamp,                // 발송 시간
  updatedAt: Timestamp                 // 수정 시간
}
```

#### 4-2. 개별 채팅 (교사 ↔ 학생)

**경로**: `messages/private/{chatId}/messages/{messageId}`

**채팅방 메타데이터** (선택사항):
```javascript
// messages/private/{chatId}/metadata
{
  chatId: "1-3-20-132015",             // 채팅 ID
  teacherId: "1-3-20",                 // 교사 ID
  studentId: "132015",                 // 학생 ID
  lastMessage: "안녕하세요",            // 마지막 메시지
  lastMessageAt: Timestamp,            // 마지막 메시지 시간
  unreadCount: {                       // 읽지 않은 메시지 수
    teacher: 0,                        // 교사가 읽지 않은 수
    student: 2                         // 학생이 읽지 않은 수
  },
  createdAt: Timestamp,                // 채팅방 생성 시간
  updatedAt: Timestamp                 // 업데이트 시간
}
```

**메시지 문서 필드**:
```javascript
{
  messageId: "msg_1234567890",         // 메시지 ID (자동 생성)
  chatId: "1-3-20-132015",             // 채팅 ID
  senderId: "1-3-20",                  // 발신자 ID
  senderType: "teacher",               // 발신자 타입: "teacher" | "student"
  senderName: "김선생님",              // 발신자 이름
  content: "진도가 잘 나가고 있네요!",  // 메시지 내용
  read: false,                          // 읽음 여부
  readAt: null,                        // 읽은 시간
  createdAt: Timestamp,                // 발송 시간
  updatedAt: Timestamp                 // 수정 시간
}
```

**예시 구조**:
```
messages/
  ├── class/
  │   └── 1-3-20/
  │       └── messages/
  │           ├── msg_001/
  │           │   ├── senderId: "1-3-20"
  │           │   ├── content: "오늘도 화이팅!"
  │           │   └── readBy: { "132015": true, ... }
  │           └── msg_002/
  │               └── ...
  └── private/
      └── 1-3-20-132015/
          ├── metadata/
          │   ├── lastMessage: "감사합니다"
          │   └── lastMessageAt: 2024-01-20T15:30:00Z
          └── messages/
              ├── msg_001/
              │   ├── senderId: "1-3-20"
              │   ├── content: "잘하고 있어요!"
              │   └── read: false
              └── msg_002/
                  └── ...
```

---

### 5. `schools` 컬렉션 (선택사항)

학교 이름과 코드 매핑을 저장합니다. **학생이 학교 이름을 입력할 때 코드로 변환하기 위한 참조용**으로 사용됩니다.

> **참고**: 모든 데이터(`users`, `classes`, `teachers`)에 이미 `schoolCode`가 포함되어 있으므로, 학교별 통계나 관리가 필요하지 않다면 이 컬렉션은 생략 가능합니다. 대신 클라이언트 측에서 학교 이름 → 코드 변환 로직을 구현할 수 있습니다.

**경로**: `schools/{schoolCode}`

**문서 ID**: 학교 코드 (예: `1`, `SCHOOL001`)

**필드**:
```javascript
{
  schoolCode: "1",                    // 학교 코드 (문서 ID와 동일)
  schoolName: "테스트학교",           // 학교 이름 (학생 입력용)
  createdAt: Timestamp,               // 생성 시간
  updatedAt: Timestamp                 // 업데이트 시간
}
```

**사용 시나리오**:
- 학생이 학교 이름을 입력하면 `schools` 컬렉션에서 해당 이름으로 검색하여 `schoolCode`를 찾습니다.
- 또는 클라이언트 측에서 학교 이름 → 코드 변환 맵을 하드코딩하거나 로컬 스토리지에 저장할 수 있습니다.

**대안 (schools 컬렉션 없이)**:
- 학생 로그인 시 학교 이름을 직접 코드로 변환하는 함수 사용
- 예: `getSchoolCodeFromName(schoolName)` → 간단한 매핑 객체 사용
- 장점: Firestore 읽기 없이 빠른 변환, 구조 단순
- 단점: 학교 추가/변경 시 코드 수정 필요

---

## 데이터 흐름

### 학생 로그인 프로세스

1. **학생이 로그인 정보 입력**
   - 학교 이름, 학년, 반, 번호 입력

2. **학교 이름 → 코드 변환**
   - **방법 A (schools 컬렉션 사용)**: `schools` 컬렉션에서 학교 이름으로 검색하여 `schoolCode` 조회
   - **방법 B (클라이언트 변환)**: 로컬 매핑 객체나 함수로 직접 변환
     ```javascript
     const schoolCodeMap = {
       "테스트학교": "1",
       "서울과학고등학교": "2",
       // ...
     }
     const schoolCode = schoolCodeMap[schoolName] || "1"
     ```

3. **학번 생성**
   - 학번 생성: `{schoolCode}{grade}{classNum}{number}` (예: `132015`)

4. **Firebase Auth 로그인**
   - 이메일: `{studentId}@student.local`
   - 비밀번호: 기본 비밀번호 또는 사용자 입력

5. **Firestore에 학생 정보 저장/업데이트**
   ```javascript
   // users/{studentId} 문서 생성/업데이트
   {
     studentId: "132015",
     schoolCode: "1",
     grade: 3,
     classNum: 20,
     number: 15,
     schoolName: "테스트학교",  // 참고용 (선택)
     lastLogin: serverTimestamp(),
     lastActivity: serverTimestamp()
   }
   ```

6. **반(Class)에 학생 추가/업데이트**
   ```javascript
   // classes/{classId}/students/{studentId} 문서 생성/업데이트
   {
     studentId: "132015",
     number: 15,
     isActive: true,
     joinedAt: serverTimestamp()
   }
   
   // classes/{classId} 문서 생성/업데이트
   {
     classId: "1-3-20",
     schoolCode: "1",
     grade: 3,
     classNum: 20,
     teacherId: "1-3-20",
     totalStudents: 28,  // 학생 수 업데이트
     updatedAt: serverTimestamp()
   }
   ```

### 교사 로그인 프로세스

1. **교사가 로그인 정보 입력**
   - 학교 코드, 학년, 반, 비밀번호 입력

2. **Firestore에서 교사 정보 확인**
   - `teachers/{schoolCode}-{grade}-{classNum}` 문서 조회
   - 비밀번호 일치 확인

3. **Firebase Auth 로그인**
   - 교사 전용 이메일 형식으로 로그인

4. **반 학생 목록 조회**
   - `classes/{schoolCode}-{grade}-{classNum}/students` 컬렉션 조회
   - 각 학생의 `users/{studentId}` 문서에서 상세 정보 및 활동 데이터 조회

---

## 쿼리 예시

### 1. 교사가 자신의 반 학생 목록 조회

```javascript
// classes/{classId}/students 컬렉션 조회
const classId = `${schoolCode}-${grade}-${classNum}`
const studentsRef = collection(db, 'classes', classId, 'students')
const studentsSnapshot = await getDocs(studentsRef)

const students = []
for (const doc of studentsSnapshot.docs) {
  const studentData = doc.data()
  // users 컬렉션에서 상세 정보 조회
  const userRef = doc(db, 'users', studentData.studentId)
  const userDoc = await getDoc(userRef)
  students.push({
    ...userDoc.data(),
    ...studentData
  })
}
```

### 2. 학생의 활동 진행률 조회 (문제 풀이 결과 포함)

```javascript
// 특정 학생의 모든 활동 상태 및 문제 풀이 결과 조회
const activitiesRef = collection(db, 'users', studentId, 'activities')
const activitiesSnapshot = await getDocs(activitiesRef)

let completedCount = 0      // 완료한 문제 수
let correctCount = 0         // 정답을 맞춘 문제 수
let totalCount = 0          // 전체 문제 수
const activities = []       // 상세 정보

activitiesSnapshot.forEach((doc) => {
  const data = doc.data()
  totalCount++
  
  if (data.completed) {
    completedCount++
    if (data.isCorrect) {
      correctCount++
    }
  }
  
  activities.push({
    activityId: doc.id,
    ...data
  })
})

// 진행률 계산
const completionProgress = totalCount > 0 
  ? Math.round((completedCount / totalCount) * 100) 
  : 0

const accuracyRate = completedCount > 0
  ? Math.round((correctCount / completedCount) * 100)
  : 0

const correctProgress = totalCount > 0
  ? Math.round((correctCount / totalCount) * 100)
  : 0

console.log('학생 진행률:', {
  totalCount,           // 전체 문제 수
  completedCount,       // 완료한 문제 수
  correctCount,         // 정답을 맞춘 문제 수
  completionProgress,   // 완료율 (%)
  accuracyRate,         // 정답률 (%)
  correctProgress,      // 정답 진도율 (%)
  activities            // 상세 활동 정보
})
```

### 2-1. 전시관별 진행률 조회

```javascript
// 전시관별로 그룹화하여 진행률 계산
const activitiesRef = collection(db, 'users', studentId, 'activities')
const activitiesSnapshot = await getDocs(activitiesRef)

const hallProgress = {}  // { "1관": { total: 5, completed: 3, correct: 2 }, ... }

activitiesSnapshot.forEach((doc) => {
  const data = doc.data()
  const hall = data.exhibitionHall || "기타"
  
  if (!hallProgress[hall]) {
    hallProgress[hall] = {
      total: 0,
      completed: 0,
      correct: 0
    }
  }
  
  hallProgress[hall].total++
  
  if (data.completed) {
    hallProgress[hall].completed++
    if (data.isCorrect) {
      hallProgress[hall].correct++
    }
  }
})

// 각 전시관별 진행률 계산
Object.keys(hallProgress).forEach((hall) => {
  const stats = hallProgress[hall]
  stats.completionRate = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0
  stats.accuracyRate = stats.completed > 0
    ? Math.round((stats.correct / stats.completed) * 100)
    : 0
  stats.correctProgress = stats.total > 0
    ? Math.round((stats.correct / stats.total) * 100)
    : 0
})

console.log('전시관별 진행률:', hallProgress)
// 예시 출력:
// {
//   "1관": {
//     total: 5,
//     completed: 3,
//     correct: 2,
//     completionRate: 60,    // 완료율: 3/5 = 60%
//     accuracyRate: 67,      // 정답률: 2/3 = 67%
//     correctProgress: 40    // 정답 진도율: 2/5 = 40%
//   },
//   "2관": { ... }
// }
```

### 3. 반 전체 평균 진행률 계산 (문제 풀이 결과 포함)

```javascript
// 1. 반 학생 목록 조회
const classId = `${schoolCode}-${grade}-${classNum}`
const studentsRef = collection(db, 'classes', classId, 'students')
const studentsSnapshot = await getDocs(studentsRef)

// 2. 각 학생의 진행률 및 문제 풀이 결과 계산
const studentsProgress = []

for (const studentDoc of studentsSnapshot.docs) {
  const studentData = studentDoc.data()
  const studentId = studentData.studentId
  
  // 학생 정보 조회
  const userRef = doc(db, 'users', studentId)
  const userDoc = await getDoc(userRef)
  const userData = userDoc.data()
  
  // 활동지 조회
  const activitiesRef = collection(db, 'users', studentId, 'activities')
  const activitiesSnapshot = await getDocs(activitiesRef)
  
  let completed = 0
  let correct = 0
  let total = 0
  
  activitiesSnapshot.forEach((doc) => {
    const activityData = doc.data()
    total++
    
    if (activityData.completed) {
      completed++
      if (activityData.isCorrect) {
        correct++
      }
    }
  })
  
  const completionProgress = total > 0 ? Math.round((completed / total) * 100) : 0
  const accuracyRate = completed > 0 ? Math.round((correct / completed) * 100) : 0
  const correctProgress = total > 0 ? Math.round((correct / total) * 100) : 0
  
  studentsProgress.push({
    studentId,
    number: studentData.number,
    name: userData.name || `${userData.grade}학년 ${userData.classNum}반 ${studentData.number}번`,
    total,
    completed,
    correct,
    completionProgress,    // 완료율 (%)
    accuracyRate,          // 정답률 (%)
    correctProgress        // 정답 진도율 (%)
  })
}

// 번호 순으로 정렬
studentsProgress.sort((a, b) => a.number - b.number)

// 3. 반 전체 평균 계산
const totalStudents = studentsProgress.length
const averageCompletionProgress = totalStudents > 0
  ? Math.round(studentsProgress.reduce((sum, s) => sum + s.completionProgress, 0) / totalStudents)
  : 0

const averageAccuracyRate = totalStudents > 0
  ? Math.round(studentsProgress.reduce((sum, s) => sum + s.accuracyRate, 0) / totalStudents)
  : 0

const classTotalCompleted = studentsProgress.reduce((sum, s) => sum + s.completed, 0)
const classTotalCorrect = studentsProgress.reduce((sum, s) => sum + s.correct, 0)

console.log('반 전체 진행률:', {
  totalStudents,
  studentsProgress,              // 학생별 상세 정보
  averageCompletionProgress,      // 평균 완료율 (%)
  averageAccuracyRate,            // 평균 정답률 (%)
  classTotalCompleted,            // 반 전체 완료한 문제 수
  classTotalCorrect               // 반 전체 정답 수
})
```

### 4. 최근 활동한 학생 조회

```javascript
// users 컬렉션에서 lastActivity 기준으로 정렬
const usersRef = collection(db, 'users')
const q = query(
  usersRef,
  where('schoolCode', '==', schoolCode),
  where('grade', '==', grade),
  where('classNum', '==', classNum),
  orderBy('lastActivity', 'desc'),
  limit(10)
)
const snapshot = await getDocs(q)
```

### 5. 교사가 반 학생들의 진도를 실시간으로 모니터링

```javascript
import { onSnapshot, collection, query, where } from 'firebase/firestore'

// 반 학생 목록 실시간 구독
const classId = `${schoolCode}-${grade}-${classNum}`
const studentsRef = collection(db, 'classes', classId, 'students')

const unsubscribe = onSnapshot(studentsRef, async (snapshot) => {
  const students = []
  
  for (const doc of snapshot.docs) {
    const studentData = doc.data()
    const studentId = studentData.studentId
    
    // 각 학생의 활동 진행률 조회
    const activitiesRef = collection(db, 'users', studentId, 'activities')
    const activitiesSnapshot = await getDocs(activitiesRef)
    
    let completed = 0
    let total = 0
    activitiesSnapshot.forEach((activityDoc) => {
      total++
      if (activityDoc.data().completed) completed++
    })
    
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    
    students.push({
      ...studentData,
      progress,
      completed,
      total
    })
  }
  
  // 번호 순으로 정렬
  students.sort((a, b) => a.number - b.number)
  
  // 평균 진행률 계산
  const averageProgress = students.length > 0
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0
  
  console.log('실시간 학생 진도:', {
    students,
    averageProgress,
    totalStudents: students.length
  })
})

// 컴포넌트 언마운트 시 구독 해제
// return () => unsubscribe()
```

### 6. 반 전체 채팅 메시지 조회 및 실시간 구독

```javascript
import { onSnapshot, collection, query, orderBy, limit } from 'firebase/firestore'

// 반 전체 채팅 메시지 실시간 구독
const classId = `${schoolCode}-${grade}-${classNum}`
const messagesRef = collection(db, 'messages', 'class', classId, 'messages')
const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(50))

const unsubscribe = onSnapshot(q, (snapshot) => {
  const messages = []
  snapshot.forEach((doc) => {
    messages.push({
      id: doc.id,
      ...doc.data()
    })
  })
  
  // 시간 순으로 정렬 (오래된 것부터)
  messages.reverse()
  
  console.log('실시간 채팅 메시지:', messages)
})

// 메시지 전송
const sendClassMessage = async (classId, senderId, content, type = 'normal') => {
  const messagesRef = collection(db, 'messages', 'class', classId, 'messages')
  const newMessageRef = doc(messagesRef)
  
  await setDoc(newMessageRef, {
    messageId: newMessageRef.id,
    classId,
    senderId,
    senderType: 'teacher',
    senderName: '김선생님', // 실제 교사 이름
    content,
    type,
    readBy: {}, // 초기값은 빈 객체
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}
```

### 7. 개별 채팅 메시지 조회 및 전송

```javascript
// 개별 채팅 메시지 실시간 구독
const chatId = `${teacherId}-${studentId}`
const messagesRef = collection(db, 'messages', 'private', chatId, 'messages')
const q = query(messagesRef, orderBy('createdAt', 'asc'))

const unsubscribe = onSnapshot(q, (snapshot) => {
  const messages = []
  snapshot.forEach((doc) => {
    messages.push({
      id: doc.id,
      ...doc.data()
    })
  })
  
  console.log('개별 채팅 메시지:', messages)
})

// 개별 메시지 전송
const sendPrivateMessage = async (teacherId, studentId, senderId, content, senderType) => {
  const chatId = `${teacherId}-${studentId}`
  const messagesRef = collection(db, 'messages', 'private', chatId, 'messages')
  const newMessageRef = doc(messagesRef)
  
  // 메시지 저장
  await setDoc(newMessageRef, {
    messageId: newMessageRef.id,
    chatId,
    senderId,
    senderType, // "teacher" | "student"
    senderName: senderType === 'teacher' ? '김선생님' : '학생',
    content,
    read: false,
    readAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  // 채팅방 메타데이터 업데이트
  const metadataRef = doc(db, 'messages', 'private', chatId, 'metadata', 'info')
  await setDoc(metadataRef, {
    chatId,
    teacherId,
    studentId,
    lastMessage: content,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true })
}
```

### 8. 문제 풀이 결과 저장 함수 예시

```javascript
import { doc, setDoc, getDoc, serverTimestamp, increment } from 'firebase/firestore'
import { checkAnswer, checkMultipleAnswers } from '../utils/answerCheck'

// 문제 풀이 결과 저장 (개선된 버전)
export const saveActivityData = async (userId, activityId, data, questionData) => {
  try {
    if (!db) {
      return { success: false, error: 'Firestore가 초기화되지 않았습니다.' }
    }
    
    if (!userId) {
      return { success: false, error: '사용자 ID가 없습니다.' }
    }
    
    const activityRef = doc(db, 'users', userId, 'activities', activityId)
    
    // 기존 데이터 조회 (시도 횟수 추적을 위해)
    const existingDoc = await getDoc(activityRef)
    const existingData = existingDoc.exists() ? existingDoc.data() : {}
    
    // 정답 확인
    let isCorrect = false
    const answerField = questionData.answerField
    
    if (questionData.inputType === 'multiple') {
      // 다중 답변 문제
      const answerCheck = checkMultipleAnswers(activityId, answerField, data[answerField])
      isCorrect = answerCheck.correct
    } else {
      // 단일 답변 문제
      const answerCheck = checkAnswer(activityId, answerField, data[answerField])
      isCorrect = answerCheck.correct
    }
    
    // 시도 횟수 증가
    const attempts = (existingData.attempts || 0) + 1
    
    // 저장할 데이터 구성
    const saveData = {
      activityId,
      questionNumber: questionData.questionNumber,
      title: questionData.title,
      exhibitionHall: questionData.exhibitionHall || getExhibitionHallFromActivityId(activityId),
      completed: true,
      isCorrect,
      attempts,
      answerField,
      ...data,  // 학생이 입력한 답변
      correctAnswer: questionData.inputType === 'multiple' 
        ? ANSWERS[activityId]?.[answerField] 
        : ANSWERS[activityId]?.[answerField],
      updatedAt: serverTimestamp()
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
    
    // 다중 답변의 경우 배열로 저장
    if (questionData.inputType === 'multiple') {
      saveData.studentAnswers = data[answerField]
      saveData.correctAnswers = ANSWERS[activityId]?.[answerField] || []
    }
    
    await setDoc(activityRef, saveData, { merge: true })
    
    // 사용자의 lastActivity 업데이트
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, {
      lastActivity: serverTimestamp()
    }, { merge: true })
    
    return { 
      success: true, 
      isCorrect,
      attempts
    }
  } catch (error) {
    console.error('Firestore 저장 오류:', error)
    return { success: false, error: error.message || '저장 중 오류가 발생했습니다.' }
  }
}
```

### 9. 학생이 읽지 않은 메시지 수 조회

```javascript
// 반 전체 메시지 중 읽지 않은 수
const getUnreadClassMessages = async (classId, studentId) => {
  const messagesRef = collection(db, 'messages', 'class', classId, 'messages')
  const snapshot = await getDocs(messagesRef)
  
  let unreadCount = 0
  snapshot.forEach((doc) => {
    const data = doc.data()
    const readBy = data.readBy || {}
    if (!readBy[studentId]) {
      unreadCount++
    }
  })
  
  return unreadCount
}

// 개별 채팅 읽지 않은 메시지 수
const getUnreadPrivateMessages = async (chatId, userId) => {
  const messagesRef = collection(db, 'messages', 'private', chatId, 'messages')
  const q = query(
    messagesRef,
    where('read', '==', false),
    where('senderId', '!=', userId) // 자신이 보낸 메시지는 제외
  )
  const snapshot = await getDocs(q)
  
  return snapshot.size
}
```

---

## 보안 규칙 (Firestore Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // users 컬렉션: 학생은 자신의 데이터만 읽기/쓰기 가능
    match /users/{studentId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == studentId;
      
      // 교사는 자신의 반 학생 데이터 읽기 가능
      allow read: if request.auth != null && 
        isTeacherOfStudent(studentId);
      
      match /activities/{activityId} {
        allow read, write: if request.auth != null && 
          request.auth.uid == studentId;
      }
    }
    
    // classes 컬렉션: 교사는 자신의 반 데이터 읽기/쓰기 가능
    match /classes/{classId} {
      allow read, write: if request.auth != null && 
        isTeacherOfClass(classId);
      
      match /students/{studentId} {
        allow read: if request.auth != null && 
          isTeacherOfClass(classId);
        allow write: if request.auth != null && 
          (request.auth.uid == studentId || isTeacherOfClass(classId));
      }
    }
    
    // teachers 컬렉션: 교사는 자신의 정보만 읽기 가능
    match /teachers/{teacherId} {
      allow read: if request.auth != null && 
        request.auth.uid == teacherId;
      allow write: if false; // 관리자만 수정 가능
    }
    
    // messages 컬렉션: 교사와 학생만 읽기/쓰기 가능
    match /messages/class/{classId}/messages/{messageId} {
      // 교사는 자신의 반 메시지만 읽기/쓰기 가능
      allow read, write: if request.auth != null && 
        isTeacherOfClass(classId);
      
      // 학생은 자신의 반 메시지만 읽기 가능 (쓰기는 교사만)
      allow read: if request.auth != null && 
        isStudentOfClass(classId);
    }
    
    match /messages/private/{chatId}/messages/{messageId} {
      // 교사와 학생 모두 자신의 채팅방 메시지 읽기/쓰기 가능
      allow read, write: if request.auth != null && 
        (isParticipantInChat(chatId));
    }
    
    // schools 컬렉션: 인증된 사용자만 읽기 가능 (선택사항)
    match /schools/{schoolCode} {
      allow read: if request.auth != null;
      allow write: if false; // 관리자만 수정 가능
    }
    
    // 헬퍼 함수: 교사가 해당 학생의 담임인지 확인
    function isTeacherOfStudent(studentId) {
      let studentData = get(/databases/$(database)/documents/users/$(studentId)).data;
      let teacherId = studentData.schoolCode + '-' + 
                      studentData.grade + '-' + 
                      studentData.classNum;
      return request.auth.uid == teacherId;
    }
    
    // 헬퍼 함수: 교사가 해당 반의 담임인지 확인
    function isTeacherOfClass(classId) {
      return request.auth.uid == classId;
    }
    
    // 헬퍼 함수: 학생이 해당 반에 속하는지 확인
    function isStudentOfClass(classId) {
      let studentData = get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
      let studentClassId = studentData.schoolCode + '-' + 
                           studentData.grade + '-' + 
                           studentData.classNum;
      return studentClassId == classId;
    }
    
    // 헬퍼 함수: 채팅방 참여자인지 확인
    function isParticipantInChat(chatId) {
      // chatId 형식: {teacherId}-{studentId}
      let parts = chatId.split('-');
      let teacherId = parts.slice(0, -1).join('-'); // 마지막 부분 제외
      let studentId = parts[parts.length - 1];
      
      // 교사인 경우
      if (request.auth.uid == teacherId) {
        return true;
      }
      
      // 학생인 경우
      if (request.auth.uid == studentId) {
        return true;
      }
      
      return false;
    }
  }
}
```

---

## 구현 체크리스트

### 학생 로그인 시 구현 사항

- [ ] `users/{studentId}` 문서 생성/업데이트
  - [ ] 학생 기본 정보 저장 (schoolCode, grade, classNum, number)
  - [ ] lastLogin, lastActivity 타임스탬프 업데이트
- [ ] `classes/{classId}/students/{studentId}` 문서 생성/업데이트
  - [ ] 반에 학생 추가 (없는 경우)
  - [ ] isActive 상태 업데이트
- [ ] `classes/{classId}` 문서 업데이트
  - [ ] totalStudents 카운트 업데이트

### 문제 풀이 결과 저장 구현 사항

- [ ] `saveActivityData` 함수 수정
  - [ ] 정답 여부 (`isCorrect`) 저장
  - [ ] 시도 횟수 (`attempts`) 추적 및 저장
  - [ ] 학생 답변 (`studentAnswer` 또는 `studentAnswers`) 저장
  - [ ] 정답 (`correctAnswer` 또는 `correctAnswers`) 저장
  - [ ] 문제 정보 (`questionNumber`, `title`, `exhibitionHall`) 저장
  - [ ] 타임스탬프 (`startedAt`, `submittedAt`, `completedAt`) 저장
- [ ] 문제 풀이 시작 시 `startedAt` 기록
- [ ] 정답 제출 시 `submittedAt`, `completedAt` 기록
- [ ] 오답 시 `attempts` 증가 및 재시도 가능하도록 구현

### 교사 대시보드 구현 사항

- [ ] 반 학생 목록 조회 함수
- [ ] 학생별 진행률 조회 함수 (완료율, 정답률, 정답 진도율)
- [ ] 전시관별 진행률 조회 함수
- [ ] 반 전체 평균 진행률 계산 함수
- [ ] 실시간 업데이트 (onSnapshot 사용)
- [ ] 학생 진도 실시간 모니터링 (onSnapshot으로 activities 구독)
- [ ] 문제별 정답률 통계 (어떤 문제가 어려운지 파악)
- [ ] 학생별 상세 문제 풀이 결과 조회

### 채팅 기능 구현 사항

- [ ] 반 전체 채팅 메시지 전송/조회
- [ ] 개별 채팅 메시지 전송/조회
- [ ] 실시간 메시지 구독 (onSnapshot)
- [ ] 읽지 않은 메시지 수 표시
- [ ] 메시지 읽음 처리
- [ ] 채팅방 목록 조회 (교사용)

### 데이터 마이그레이션 (기존 데이터가 있는 경우)

- [ ] 기존 `users` 컬렉션의 모든 문서에 학생 정보 필드 추가
- [ ] `classes` 컬렉션 생성 및 기존 학생들을 반별로 그룹화
- [ ] 데이터 일관성 검증 스크립트 작성

---

## 주의사항

1. **학번 파싱**: 학번에서 학교코드, 학년, 반, 번호를 정확히 추출해야 합니다.
2. **데이터 일관성**: `users`와 `classes/students` 간 데이터 일관성 유지 필요
3. **인덱스 설정**: Firestore Console에서 다음 필드 조합에 대한 인덱스 생성 필요:
   - `users`: `schoolCode`, `grade`, `classNum`, `lastActivity`
   - `classes`: `schoolCode`, `grade`, `classNum`
   - `messages/class/{classId}/messages`: `createdAt` (desc)
   - `messages/private/{chatId}/messages`: `createdAt` (asc), `read`, `senderId`
4. **비밀번호 보안**: 현재 평문 저장이지만, 프로덕션 환경에서는 해시화 필요
5. **트랜잭션 사용**: 학생 추가/업데이트 시 여러 문서를 수정하는 경우 트랜잭션 사용 권장
6. **학교 이름 → 코드 변환**: 
   - `schools` 컬렉션을 사용하지 않는다면, 클라이언트 측에서 변환 로직 구현 필요
   - 학교가 많지 않다면 하드코딩된 매핑 객체 사용 권장 (Firestore 읽기 비용 절감)
   - 학교가 많거나 자주 변경된다면 `schools` 컬렉션 사용 권장
7. **채팅 메시지 최적화**:
   - 메시지가 많아지면 페이지네이션 구현 권장 (limit 사용)
   - 오래된 메시지는 주기적으로 아카이빙 고려
   - 읽지 않은 메시지 수는 클라이언트에서 캐싱하여 불필요한 쿼리 방지
8. **실시간 구독 관리**:
   - 컴포넌트 언마운트 시 `onSnapshot` 구독 해제 필수 (메모리 누수 방지)
   - 여러 구독이 있을 경우 `useEffect` cleanup 함수에서 모두 해제
9. **문제 풀이 결과 저장**:
   - 정답 여부를 반드시 저장하여 진도 계산 가능하도록 구현
   - 시도 횟수 추적으로 학습 패턴 분석 가능
   - 전시관별 그룹화를 위해 `exhibitionHall` 필드 저장 필수
   - 다중 답변 문제의 경우 배열 형태로 저장 (`studentAnswers`, `correctAnswers`)

---

## 참고사항

- Firebase Realtime Database가 아닌 **Firestore**를 사용합니다.
- 모든 타임스탬프는 `serverTimestamp()`를 사용하여 서버 시간으로 저장합니다.
- 문서 ID는 가능한 한 의미 있는 값(학번, 클래스 ID 등)을 사용하여 쿼리 효율성을 높입니다.

## 구조 선택 가이드

### `schools` 컬렉션을 사용하는 경우
- ✅ 학교가 많고 자주 추가/변경됨
- ✅ 학교별 통계나 관리 기능 필요
- ✅ 관리자 페이지에서 학교 목록 조회 필요
- ❌ 단점: Firestore 읽기 비용 발생

### `schools` 컬렉션 없이 클라이언트 변환 사용
- ✅ 학교가 적고 거의 변경되지 않음
- ✅ 빠른 변환 속도 필요 (Firestore 읽기 없음)
- ✅ 구조 단순화 선호
- ❌ 단점: 학교 추가/변경 시 코드 수정 필요

**권장**: 학교가 10개 미만이고 자주 변경되지 않는다면 **클라이언트 변환 방식**을 권장합니다.

---

## Firestore 보안 규칙 설정

### 규칙 파일 위치

프로젝트 루트에 `firestore.rules` 파일을 생성하고, Firebase Console에서 배포하거나 `firebase deploy --only firestore:rules` 명령어로 배포합니다.

### 두 가지 버전 제공

1. **`firestore.rules`** (상세 버전)
   - 반별 접근 제어 포함
   - 학생의 반 확인을 위해 users 문서를 읽어야 함 (성능 비용 발생)
   - 더 엄격한 보안

2. **`firestore.rules.simple`** (간단 버전) - **권장**
   - 더 간단하고 빠름
   - 교사는 모든 학생 데이터 읽기 가능 (실제 운영 시 반별 제한 권장)
   - 성능 최적화

### 사용 방법

1. **간단 버전 사용 (권장)**:
   ```bash
   # firestore.rules.simple 파일을 firestore.rules로 복사
   cp firestore.rules.simple firestore.rules
   
   # Firebase에 배포
   firebase deploy --only firestore:rules
   ```

2. **상세 버전 사용**:
   - `firestore.rules` 파일을 그대로 사용
   - Firebase Console에서 Rules 탭으로 이동하여 복사/붙여넣기
   - 또는 `firebase deploy --only firestore:rules` 명령어 사용

### 보안 규칙 테스트

Firebase Console → Firestore Database → Rules 탭에서 "Rules Playground"를 사용하여 규칙을 테스트할 수 있습니다.

### 주의사항

1. **성능 최적화**: 
   - `users` 문서에 `classId` 필드를 추가하면 보안 규칙에서 반 확인이 더 빠릅니다
   - 예: `classId: "1-3-20"` 필드 추가

2. **실제 운영 시**:
   - 간단 버전을 사용하되, 교사가 자신의 반 학생만 조회하도록 클라이언트 측에서 필터링
   - 또는 상세 버전을 사용하여 서버 측에서 제어

3. **규칙 배포 후 테스트**:
   - 학생 로그인 후 자신의 데이터만 접근 가능한지 확인
   - 교사 로그인 후 자신의 반 학생 데이터만 접근 가능한지 확인
