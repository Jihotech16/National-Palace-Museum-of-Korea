// 활동지 순서 정의
export const ACTIVITY_ORDER = {
  sealKing: 1,
  seal: 2,
  ceiling: 3,
  clothing: 4,
  nature: 5,
  education: 6,
  ceremonialSeal: 7,
  record: 8,
  politics: 9,
  exam: 10,
  age: 11,
  dragon: 12,
  queenSymbol: 13,
  queenVirtue: 14,
  queenPolitics: 15,
  queenSymbol2: 16,
  queenHairpin: 17,
  queenBirth: 18,
  queenPrincess: 19,
  queenClothing: 20,
  queenChima: 21,
  queenJewelry: 22,
  queenEmbroidery: 23,
  queenNorigae: 24,
  queenFood: 25,
  empire: 26,
  independence: 27,
  currency: 28,
  altar: 29,
  palace: 30,
  dondeokjeon: 31,
  plumBlossom: 32,
  hwajodo: 33,
  peony: 34,
  sealBook: 35,
  inkstone: 36,
  fiveRites: 37,
  dongroe: 38,
  daesarye: 39,
  yeon: 40,
  jeongchukgi: 41,
  honjeondogam: 42,
  jongmyo: 43,
  honcheoneui: 44,
  calendar: 45,
  ilseongjeongsiui: 46,
  soilyeong: 47,
  cheonsangyeolchabunyajido: 48,
  portraitKing: 49,
  animal: 39,
  portrait: 40,
  science: 41,
  draw: 42
}

export const ACTIVITY_PATHS = {
  sealKing: '/1_King_of_Joseon/Question01_King',
  seal: '/1_King_of_Joseon/Question02_Seal',
  ceiling: '/1_King_of_Joseon/Question03_Ceiling',
  clothing: '/1_King_of_Joseon/Question04_Clothing',
  nature: '/1_King_of_Joseon/Question05_Nature',
  education: '/1_King_of_Joseon/Question06_Education',
  ceremonialSeal: '/1_King_of_Joseon/Question07_Seal',
  record: '/1_King_of_Joseon/Question08_Record',
  politics: '/1_King_of_Joseon/Question09_Politics',
  exam: '/1_King_of_Joseon/Question10_Exam',
  age: '/1_King_of_Joseon/Question11_Age',
  dragon: '/1_King_of_Joseon/Question12_Dragon',
  queenSymbol: '/2_Royal_Life/Question01_Queen',
  queenVirtue: '/2_Royal_Life/Question02_QueenVirtue',
  queenPolitics: '/2_Royal_Life/Question03_QueenPolitics',
  queenSymbol2: '/2_Royal_Life/Question04_QueenSymbol2',
  queenHairpin: '/2_Royal_Life/Question05_QueenHairpin',
  queenBirth: '/2_Royal_Life/Question06_QueenBirth',
  queenPrincess: '/2_Royal_Life/Question07_QueenPrincess',
  queenClothing: '/2_Royal_Life/Question08_QueenClothing',
  queenChima: '/2_Royal_Life/Question09_QueenChima',
  queenJewelry: '/2_Royal_Life/Question10_QueenJewelry',
  queenEmbroidery: '/2_Royal_Life/Question11_QueenEmbroidery',
  queenNorigae: '/2_Royal_Life/Question12_QueenNorigae',
  queenFood: '/2_Royal_Life/Question13_QueenFood',
  empire: '/3_Empire_of_Korea/Question01_Empire',
  independence: '/3_Empire_of_Korea/Question02_Independence',
  currency: '/3_Empire_of_Korea/Question03_Currency',
  altar: '/3_Empire_of_Korea/Question04_Altar',
  palace: '/3_Empire_of_Korea/Question05_Palace',
  dondeokjeon: '/3_Empire_of_Korea/Question06_Dondeokjeon',
  plumBlossom: '/3_Empire_of_Korea/Question07_PlumBlossom',
  hwajodo: '/4_Palace_Painting/Question01_Hwajodo',
  peony: '/4_Palace_Painting/Question02_Peony',
  sealBook: '/4_Palace_Painting/Question03_SealBook',
  inkstone: '/4_Palace_Painting/Question04_Inkstone',
  fiveRites: '/5_Royal_Ritual/Question01_FiveRites',
  dongroe: '/5_Royal_Ritual/Question02_Dongroe',
  daesarye: '/5_Royal_Ritual/Question03_Daesarye',
  yeon: '/5_Royal_Ritual/Question04_Yeon',
  jeongchukgi: '/5_Royal_Ritual/Question05_Jeongchukgi',
  honjeondogam: '/5_Royal_Ritual/Question06_Honjeondogam',
  jongmyo: '/5_Royal_Ritual/Question07_Jongmyo',
  honcheoneui: '/6_Science_Culture/Question01_Honcheoneui',
  calendar: '/6_Science_Culture/Question02_Calendar',
  ilseongjeongsiui: '/6_Science_Culture/Question03_Ilseongjeongsiui',
  soilyeong: '/6_Science_Culture/Question04_Soilyeong',
  cheonsangyeolchabunyajido: '/6_Science_Culture/Question05_Cheonsangyeolchabunyajido',
  portraitKing: '/activity/portrait-king',
  animal: '/activity/animal',
  portrait: '/activity/portrait',
  science: '/activity/science',
  draw: '/activity/draw'
}

// 현재 활동지의 다음 활동지 경로 반환
export const getNextActivityPath = (currentActivityId) => {
  const order = ACTIVITY_ORDER[currentActivityId]
  if (!order) return '/1_King_of_Joseon/Question01_King'
  
  const nextOrder = order + 1
  const nextActivityId = Object.keys(ACTIVITY_ORDER).find(
    id => ACTIVITY_ORDER[id] === nextOrder
  )
  
  return nextActivityId ? ACTIVITY_PATHS[nextActivityId] : '/1_King_of_Joseon/Question01_King'
}

// 전시관별 시작 페이지 경로
export const EXHIBITION_HALL_START_PATHS = {
  '1_King_of_Joseon': '/1_King_of_Joseon/1_Start',
  '2_Royal_Life': '/2_Royal_Life/1_Start',
  '3_Empire_of_Korea': '/3_Empire_of_Korea/1_Start',
  '4_Palace_Painting': '/4_Palace_Painting/1_Start',
  '5_Royal_Ritual': '/5_Royal_Ritual/1_Start',
  '6_Science_Culture': '/6_Science_Culture/1_Start'
}

// 현재 활동지의 이전 활동지 경로 반환
export const getPreviousActivityPath = (currentActivityId) => {
  const order = ACTIVITY_ORDER[currentActivityId]
  if (!order) return null
  
  // 현재 활동지가 속한 전시관 찾기
  const exhibitionHall = getExhibitionHallFromActivityId(currentActivityId)
  
  if (exhibitionHall) {
    // 전시관의 첫 번째 문제인지 확인
    const hallActivities = EXHIBITION_HALL_ACTIVITIES[exhibitionHall]
    if (hallActivities && hallActivities[0] === currentActivityId) {
      // 전시관의 첫 번째 문제라면 해당 전시관의 시작 페이지로
      return EXHIBITION_HALL_START_PATHS[exhibitionHall] || null
    }
  }
  
  // 전시관의 첫 번째 문제가 아니면 이전 활동지 경로 반환
  if (order === 1) return null // 전체 순서상 첫 번째 활동지는 이전이 없음
  
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
  // 1_King_of_Joseon 경로 처리
  if (pathname.includes('/1_King_of_Joseon/')) {
    if (pathname.includes('Question01_King')) return 'sealKing'
    if (pathname.includes('Question02_Seal')) return 'seal'
    if (pathname.includes('Question03_Ceiling')) return 'ceiling'
    if (pathname.includes('Question04_Clothing')) return 'clothing'
    if (pathname.includes('Question05_Nature')) return 'nature'
    if (pathname.includes('Question06_Education')) return 'education'
    if (pathname.includes('Question07_Seal')) return 'ceremonialSeal'
    if (pathname.includes('Question08_Record')) return 'record'
    if (pathname.includes('Question09_Politics')) return 'politics'
    if (pathname.includes('Question10_Exam')) return 'exam'
    if (pathname.includes('Question11_Age')) return 'age'
    if (pathname.includes('Question12_Dragon')) return 'dragon'
  }
  
  // 2_Royal_Life 경로 처리
  if (pathname.includes('/2_Royal_Life/')) {
    if (pathname.includes('Question01_Queen')) return 'queenSymbol'
    if (pathname.includes('Question02_QueenVirtue')) return 'queenVirtue'
    if (pathname.includes('Question03_QueenPolitics')) return 'queenPolitics'
    if (pathname.includes('Question04_QueenSymbol2')) return 'queenSymbol2'
    if (pathname.includes('Question05_QueenHairpin')) return 'queenHairpin'
    if (pathname.includes('Question06_QueenBirth')) return 'queenBirth'
    if (pathname.includes('Question07_QueenPrincess')) return 'queenPrincess'
    if (pathname.includes('Question08_QueenClothing')) return 'queenClothing'
    if (pathname.includes('Question09_QueenChima')) return 'queenChima'
    if (pathname.includes('Question10_QueenJewelry')) return 'queenJewelry'
    if (pathname.includes('Question11_QueenEmbroidery')) return 'queenEmbroidery'
    if (pathname.includes('Question12_QueenNorigae')) return 'queenNorigae'
    if (pathname.includes('Question13_QueenFood')) return 'queenFood'
  }
  
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

// 전시관별 문제 목록 정의
export const EXHIBITION_HALL_ACTIVITIES = {
  '1_King_of_Joseon': [
    'sealKing',
    'seal',
    'ceiling',
    'clothing',
    'nature',
    'education',
    'ceremonialSeal',
    'record',
    'politics',
    'exam',
    'age',
    'dragon'
  ],
  '2_Royal_Life': [
    'queenSymbol',
    'queenVirtue',
    'queenPolitics',
    'queenSymbol2',
    'queenHairpin',
    'queenBirth',
    'queenPrincess',
    'queenClothing',
    'queenChima',
    'queenJewelry',
    'queenEmbroidery',
    'queenNorigae',
    'queenFood'
  ],
  '3_Empire_of_Korea': [
    'empire',
    'independence',
    'currency',
    'altar',
    'palace',
    'dondeokjeon',
    'plumBlossom'
  ],
  '4_Palace_Painting': [
    'hwajodo',
    'peony',
    'sealBook',
    'inkstone'
  ],
  '5_Royal_Ritual': [
    'fiveRites',
    'dongroe',
    'daesarye',
    'yeon',
    'jeongchukgi',
    'honjeondogam',
    'jongmyo'
  ],
  '6_Science_Culture': [
    'honcheoneui',
    'calendar',
    'ilseongjeongsiui',
    'soilyeong',
    'cheonsangyeolchabunyajido'
  ]
}

// 활동지 ID로 전시관 찾기
export const getExhibitionHallFromActivityId = (activityId) => {
  for (const [hallId, activities] of Object.entries(EXHIBITION_HALL_ACTIVITIES)) {
    if (activities.includes(activityId)) {
      return hallId
    }
  }
  return null
}

// 완료되지 않은 첫 번째 활동지 경로 반환
export const getFirstIncompleteActivity = async (userId, getAllActivityStatus) => {
  const result = await getAllActivityStatus(userId)
  if (!result.success) return '/1_King_of_Joseon/Question01_King'
  
  const status = result.status || {}
  
  // 순서대로 확인하여 완료되지 않은 첫 번째 활동지 찾기
  for (const [id, order] of Object.entries(ACTIVITY_ORDER)) {
    if (!status[id]) {
      return ACTIVITY_PATHS[id]
    }
  }
  
  // 모든 활동지 완료 시 첫 번째 활동지로
  return '/1_King_of_Joseon/Question01_King'
}

