// 교사 화면에서 쓰는 데이터 모음
import { getTeacherStudents, getAllActivityStatus } from '@shared/firebase/firestore'
import { EXHIBITION_HALL_ACTIVITIES } from '@shared/utils/activityOrder'
import { PALACE_HALLS, SEOUL_ZONES } from './routes'

const pct = (done, total) => (total > 0 ? Math.round((done / total) * 100) : 0)

// 반 학생 목록 + 학생별 전체/박물관별 진행률 (웹 TeacherDetail.jsx loadStudentData)
export async function getClassStudentsWithProgress({ schoolCode, grade, classNum }) {
  const studentsResult = await getTeacherStudents(schoolCode, grade, classNum)
  if (!studentsResult.success) return { success: false, error: studentsResult.error, students: [] }

  const allActivities = Object.values(EXHIBITION_HALL_ACTIVITIES).flat()
  const palaceActivities = PALACE_HALLS.flatMap((h) => EXHIBITION_HALL_ACTIVITIES[h] || [])
  const seoulActivities = SEOUL_ZONES.flatMap((h) => EXHIBITION_HALL_ACTIVITIES[h] || [])

  const students = await Promise.all(
    studentsResult.students.map(async (student) => {
      const r = await getAllActivityStatus(student.studentId)
      const status = r.success ? r.status || {} : {}
      const count = (list) => list.filter((id) => status[id] === true).length
      const completed = count(allActivities)
      const palaceCompleted = count(palaceActivities)
      const seoulCompleted = count(seoulActivities)
      return {
        ...student,
        progress: pct(completed, allActivities.length),
        completed,
        total: allActivities.length,
        palaceProgress: pct(palaceCompleted, palaceActivities.length),
        seoulProgress: pct(seoulCompleted, seoulActivities.length),
        palaceCompleted,
        seoulCompleted,
        isExploring: !!student.currentQuestion, // 탐험 중 여부
      }
    })
  )

  const averageProgress = students.length
    ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
    : 0
  return { success: true, students, averageProgress }
}

// ===== 교사 메시지함 =====
// 웹(TeacherMessage, TeacherMessageDetail, TeacherEditMessage)도 아직 서버와 연결되지 않은 예시 메시지를 보여주고,
// 보내기 버튼은 목록으로 돌아가기만 합니다. 앱도 같은 동작을 하되, 나중에 서버에 연결할 곳을 여기 한 군데로 모았습니다.
const SAMPLE_MESSAGES = [
  {
    id: '1',
    senderName: '담임 선생님',
    senderType: 'teacher',
    title: '근정전 미션 힌트 도착! 🕵️',
    preview: '근정전의 월대에는 사방신이 조각되어 있습니다. 남쪽을 지키는 동물은 무엇일까요? 힌트를 확인하고 정답을 입력하세요.',
    content: `안녕하세요, 3조 학생 여러분! 👋
현재 여러분이 탐험하고 있는 근정전의 월대에는 사방신이 조각되어 있습니다. 동, 서, 남, 북 각 방향을 지키는 동물들이 있는데, 그 중에서 **'남쪽'**을 지키는 동물은 무엇일까요?
힌트를 잘 확인하고 아래 미션 탭에서 정답을 입력해주세요. 친구들과 상의해서 맞춰보세요! 화이팅! 🚀`,
    hint: '이 동물은 붉은 색을 상징하며, 불을 다스리는 상상의 새입니다. 닭과 비슷하게 생겼지만 훨씬 화려해요!',
    time: '14:05',
    date: '오늘',
    fullDateTime: '2023.10.24 14:05',
    unread: true,
  },
  {
    id: '2',
    senderName: '담임 선생님',
    senderType: 'teacher',
    title: '📢 모임 장소 변경 안내',
    content: '현재 근정전 앞이 매우 혼잡합니다. 3조 학생들은 1층 로비가 아닌 경회루 앞 벤치로 14:30까지 모여주세요.',
    time: '13:30',
    date: '오늘',
    fullDateTime: '2023.10.24 13:30',
    unread: false,
  },
  {
    id: '3',
    senderName: '담임 선생님',
    senderType: 'teacher',
    title: '박물관 관람 에티켓 🤫',
    content: '박물관 내에서는 뛰지 않고 조용히 관람해주세요. 사진 촬영 시 플래시는 꺼주시기 바랍니다. 즐거운 관람 되세요!',
    time: '09:00',
    date: '오늘',
    fullDateTime: '2023.10.24 09:00',
    unread: false,
  },
  {
    id: '4',
    senderName: '시스템 알림',
    senderType: 'system',
    title: '앱 업데이트 안내',
    content: '원활한 미션 수행을 위해 최신 버전으로 업데이트 해주세요.',
    time: '18:00',
    date: '어제',
    fullDateTime: '2023.10.23 18:00',
    unread: false,
  },
]

export async function getTeacherMessages() {
  return { success: true, messages: SAMPLE_MESSAGES }
}

export async function getTeacherMessage(messageId) {
  const message = SAMPLE_MESSAGES.find((m) => m.id === String(messageId))
  return message ? { success: true, message } : { success: false, error: '메시지를 찾을 수 없습니다.' }
}

// 웹과 같이 아직 실제 전송은 하지 않음 (추후 구현)
export async function sendTeacherMessage(teacher, { recipient, title, content }) {
  console.log('메시지 전송:', { recipient, title, content })
  return { success: true }
}
