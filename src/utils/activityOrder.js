// 활동지 순서 정의
export const ACTIVITY_ORDER = {
  seal: 1,
  nature: 2,
  ceiling: 3,
  clothing: 4,
  portraitKing: 5,
  education: 6,
  animal: 7,
  portrait: 8,
  science: 9,
  draw: 10
}

export const ACTIVITY_PATHS = {
  nature: '/activity/nature',
  seal: '/activity/seal',
  ceiling: '/activity/ceiling',
  clothing: '/activity/clothing',
  portraitKing: '/activity/portrait-king',
  education: '/activity/education',
  animal: '/activity/animal',
  portrait: '/activity/portrait',
  science: '/activity/science',
  draw: '/activity/draw'
}

// 현재 활동지의 다음 활동지 경로 반환
export const getNextActivityPath = (currentActivityId) => {
  const order = ACTIVITY_ORDER[currentActivityId]
  if (!order) return '/activity/seal'
  
  const nextOrder = order + 1
  const nextActivityId = Object.keys(ACTIVITY_ORDER).find(
    id => ACTIVITY_ORDER[id] === nextOrder
  )
  
  return nextActivityId ? ACTIVITY_PATHS[nextActivityId] : '/activity/seal'
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
  // 먼저 ACTIVITY_PATHS에서 정확한 경로를 찾아서 키를 반환
  for (const [id, path] of Object.entries(ACTIVITY_PATHS)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      return id
    }
  }
  
  // 경로 매칭이 안되면 기본 정규식으로 시도
  const match = pathname.match(/\/activity\/([\w-]+)/)
  if (match) {
    const pathSegment = match[1]
    // 하이픈을 포함한 경로를 camelCase로 변환 (portrait-king -> portraitKing)
    const camelCase = pathSegment.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
    // ACTIVITY_ORDER에 해당 키가 있는지 확인
    if (ACTIVITY_ORDER[camelCase]) {
      return camelCase
    }
  }
  
  return null
}

// 완료되지 않은 첫 번째 활동지 경로 반환
export const getFirstIncompleteActivity = async (userId, getAllActivityStatus) => {
  const result = await getAllActivityStatus(userId)
  if (!result.success) return '/activity/seal'
  
  const status = result.status || {}
  
  // 순서대로 확인하여 완료되지 않은 첫 번째 활동지 찾기
  for (const [id, order] of Object.entries(ACTIVITY_ORDER)) {
    if (!status[id]) {
      return ACTIVITY_PATHS[id]
    }
  }
  
  // 모든 활동지 완료 시 첫 번째 활동지로
  return '/activity/seal'
}

