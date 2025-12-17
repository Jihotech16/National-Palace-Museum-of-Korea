# 교사 로그인 시스템 설정 가이드

## Firebase 구조

### Firestore 컬렉션: `teachers`

각 교사 계정은 다음과 같은 문서 구조를 가집니다:

**문서 ID**: `{schoolCode}-{grade}-{classNum}`

예: `SCHOOL001-1-3` (학교코드: SCHOOL001, 1학년 3반)

**문서 필드**:
```javascript
{
  schoolCode: "SCHOOL001",      // 학교 코드 (문자열)
  grade: 1,                     // 학년 (숫자, 1-6)
  classNum: 3,                  // 반 (숫자, 1-20)
  password: "teacher123",       // 비밀번호 (평문, 관리자가 발급)
  createdAt: Timestamp,         // 계정 생성 시간
  lastLogin: Timestamp          // 마지막 로그인 시간 (null 가능)
}
```

## 교사 계정 생성 방법

### 방법 1: Firebase Console에서 직접 생성

1. Firebase Console → Firestore Database로 이동
2. `teachers` 컬렉션 생성 (없는 경우)
3. 문서 추가:
   - 문서 ID: `{schoolCode}-{grade}-{classNum}` (예: `SCHOOL001-1-3`)
   - 필드 추가:
     - `schoolCode` (string): 학교 코드
     - `grade` (number): 학년
     - `classNum` (number): 반
     - `password` (string): 비밀번호
     - `createdAt` (timestamp): 현재 시간

### 방법 2: JavaScript 코드로 생성

```javascript
import { createTeacherAccount } from './firebase/firestore'

// 교사 계정 생성
const result = await createTeacherAccount(
  'SCHOOL001',  // 학교 코드
  1,            // 학년
  3,            // 반
  'teacher123'  // 비밀번호
)

if (result.success) {
  console.log('교사 계정이 생성되었습니다.')
} else {
  console.error('오류:', result.error)
}
```

## 로그인 프로세스

1. 교사가 학교 코드, 학년, 반, 비밀번호 입력
2. Firestore에서 해당 정보 확인
3. 비밀번호 일치 확인
4. Firebase Auth로 로그인 (계정이 없으면 자동 생성)
5. 로그인 시간 업데이트

## 보안 고려사항

현재 비밀번호는 평문으로 저장됩니다. 프로덕션 환경에서는 다음을 고려하세요:

1. **비밀번호 해싱**: bcrypt 등으로 해싱하여 저장
2. **Firestore 보안 규칙**: 교사 정보는 읽기 전용으로 제한
3. **관리자 권한**: 교사 계정 생성은 관리자만 가능하도록 제한

### Firestore 보안 규칙 예시

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 교사 정보는 읽기만 가능 (인증된 사용자)
    match /teachers/{teacherId} {
      allow read: if request.auth != null;
      allow write: if false; // 관리자만 직접 생성
    }
    
    // 사용자 활동 데이터
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 사용 예시

### 교사 로그인

```javascript
import { signInAsTeacher } from './firebase/auth'

const result = await signInAsTeacher(
  'SCHOOL001',  // 학교 코드
  1,            // 학년
  3,            // 반
  'teacher123'  // 비밀번호
)

if (result.success) {
  console.log('로그인 성공:', result.user)
  console.log('교사 정보:', result.teacherData)
} else {
  console.error('로그인 실패:', result.error)
}
```

## 테스트 계정 생성 예시

```javascript
// 여러 교사 계정 한 번에 생성
const teachers = [
  { schoolCode: 'SCHOOL001', grade: 1, classNum: 1, password: 'teacher001' },
  { schoolCode: 'SCHOOL001', grade: 1, classNum: 2, password: 'teacher002' },
  { schoolCode: 'SCHOOL001', grade: 2, classNum: 1, password: 'teacher003' },
]

for (const teacher of teachers) {
  const result = await createTeacherAccount(
    teacher.schoolCode,
    teacher.grade,
    teacher.classNum,
    teacher.password
  )
  console.log(`${teacher.schoolCode}-${teacher.grade}-${teacher.classNum}:`, result.success ? '생성됨' : result.error)
}
```

## 주의사항

1. **학교 코드 형식**: 일관된 형식 사용 권장 (예: 대문자, 숫자 조합)
2. **비밀번호 정책**: 관리자가 발급한 안전한 비밀번호 사용
3. **계정 관리**: 정기적으로 사용하지 않는 계정 정리
4. **로그 모니터링**: `lastLogin` 필드를 통해 활동 모니터링 가능

