// 웹앱의 경로(activityOrder.js)를 앱 화면 경로로 바꿔주는 도우미
import {
  ACTIVITY_ORDER,
  ACTIVITY_PATHS,
  EXHIBITION_HALL_ACTIVITIES,
  getActivityIdFromPath,
  getExhibitionHallFromActivityId,
} from '@shared/utils/activityOrder'
import { QUESTION_DATA } from '@shared/data/questions'

export const PALACE_HALLS = [
  '1_King_of_Joseon',
  '2_Royal_Life',
  '3_Empire_of_Korea',
  '4_Palace_Painting',
  '5_Royal_Ritual',
  '6_Science_Culture',
]
export const SEOUL_ZONES = ['1_Seoul_Joseon', '2_Seoul_Empire', '3_Seoul_Colonial', '4_Seoul_Growth']

export const isSeoulHall = (hallId) => SEOUL_ZONES.includes(hallId)

// activityId → 문제 데이터 (QUESTION_DATA의 키와 activityId가 다른 항목이 있어서 따로 만듦)
export const QUESTIONS_BY_ACTIVITY = Object.fromEntries(
  Object.values(QUESTION_DATA).map((q) => [q.activityId, q])
)

export const questionRoute = (activityId) => `/question/${activityId}`
export const hallRoute = (hallId) => (isSeoulHall(hallId) ? `/seoul/zone/${hallId}` : `/palace/hall/${hallId}`)
export const hallListRoute = (museum) => (museum === 'seoul' ? '/seoul/halls' : '/palace/halls')

export const hallActivities = (hallId) => EXHIBITION_HALL_ACTIVITIES[hallId] || []
export const hallOfActivity = (activityId) => getExhibitionHallFromActivityId(activityId)
export const museumOfActivity = (activityId) => (isSeoulHall(hallOfActivity(activityId)) ? 'seoul' : 'palace')

// 같은 전시관 안에서 다음 문제 (마지막 문제면 null)
export const nextActivityInHall = (activityId) => {
  const list = hallActivities(hallOfActivity(activityId))
  const i = list.indexOf(activityId)
  return i >= 0 && i < list.length - 1 ? list[i + 1] : null
}

// 같은 전시관 안에서 이전 문제 (첫 문제면 null → 전시관 시작 화면으로)
export const previousActivityInHall = (activityId) => {
  const list = hallActivities(hallOfActivity(activityId))
  const i = list.indexOf(activityId)
  return i > 0 ? list[i - 1] : null
}

// 웹 경로 문자열을 앱 경로로 (예: '/1_King_of_Joseon/Question01_King' → '/question/sealKing')
export const webPathToRoute = (webPath) => {
  if (!webPath) return null
  const startMatch = webPath.match(/^\/(?:SeoulHistoryMuseum\/)?([^/]+)\/1_Start$/)
  if (startMatch) return hallRoute(startMatch[1])
  const id = getActivityIdFromPath(webPath)
  return id ? questionRoute(id) : null
}

export { ACTIVITY_ORDER, ACTIVITY_PATHS, EXHIBITION_HALL_ACTIVITIES }
