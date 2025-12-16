// 활동지 순서 정의
export const ACTIVITY_ORDER = {
  mindmap: 1,
  seal: 2,
  nature: 3,
  animal: 4,
  portrait: 5,
  science: 6,
  draw: 7
}

export const ACTIVITY_PATHS = {
  mindmap: '/activity/mindmap',
  nature: '/activity/nature',
  seal: '/activity/seal',
  animal: '/activity/animal',
  portrait: '/activity/portrait',
  science: '/activity/science',
  draw: '/activity/draw'
}

// 현재 활동지의 다음 활동지 경로 반환
export const getNextActivityPath = (currentActivityId) => {
  const order = ACTIVITY_ORDER[currentActivityId]
  if (!order) return '/activity/mindmap'
  
  const nextOrder = order + 1
  const nextActivityId = Object.keys(ACTIVITY_ORDER).find(
    id => ACTIVITY_ORDER[id] === nextOrder
  )
  
  return nextActivityId ? ACTIVITY_PATHS[nextActivityId] : '/activity/mindmap'
}

// 현재 활동지의 이전 활동지 경로 반환
export const getPreviousActivityPath = (currentActivityId) => {
  const order = ACTIVITY_ORDER[currentActivityId]
  if (!order || order === 1) return null // 첫 번째 활동지는 이전이 없음
  
  const previousOrder = order - 1
  const previousActivityId = Object.keys(ACTIVITY_ORDER).find(
    id => ACTIVITY_ORDER[id] === previousOrder
  )
  
  return previousActivityId ? ACTIVITY_PATHS[previousActivityId] : null
}

// 경로에서 활동지 ID 추출
export const getActivityIdFromPath = (pathname) => {
  const match = pathname.match(/\/activity\/(\w+)/)
  return match ? match[1] : null
}

// 완료되지 않은 첫 번째 활동지 경로 반환
export const getFirstIncompleteActivity = async (userId, getAllActivityStatus) => {
  const result = await getAllActivityStatus(userId)
  if (!result.success) return '/activity/mindmap'
  
  const status = result.status || {}
  
  // 순서대로 확인하여 완료되지 않은 첫 번째 활동지 찾기
  for (const [id, order] of Object.entries(ACTIVITY_ORDER)) {
    if (!status[id]) {
      return ACTIVITY_PATHS[id]
    }
  }
  
  // 모든 활동지 완료 시 첫 번째 활동지로
  return '/activity/mindmap'
}

