// 전시관 이름, 색, 아이콘 (웹 TeacherQuestionManagement.jsx, firestore.js getHallProgress와 같음)
export const HALL_INFO = {
  '1_King_of_Joseon': { name: '1관: 조선의 국왕', color: 'orange', icon: 'crown', museum: 'palace' },
  '2_Royal_Life': { name: '2관: 왕실생활', color: 'blue', icon: 'home', museum: 'palace' },
  '3_Empire_of_Korea': { name: '3관: 대한제국', color: 'emerald', icon: 'flag', museum: 'palace' },
  '4_Palace_Painting': { name: '4관: 궁중서화', color: 'emerald', icon: 'palette', museum: 'palace' },
  '5_Royal_Ritual': { name: '5관: 왕실의례', color: 'orange', icon: 'celebration', museum: 'palace' },
  '6_Science_Culture': { name: '6관: 과학문화', color: 'blue', icon: 'science', museum: 'palace' },
  '1_Seoul_Joseon': { name: '1관: 조선의 서울', color: 'orange', icon: 'castle', museum: 'seoul' },
  '2_Seoul_Empire': { name: '2관: 대한제국의 서울', color: 'blue', icon: 'flag', museum: 'seoul' },
  '3_Seoul_Colonial': { name: '3관: 일제강점기의 서울', color: 'emerald', icon: 'history', museum: 'seoul' },
  '4_Seoul_Growth': { name: '4관: 성장하는 서울', color: 'orange', icon: 'trending_up', museum: 'seoul' },
}

export const MUSEUM_NAMES = { palace: '국립고궁박물관', seoul: '서울역사박물관' }

// Material Icons에 없는 이름은 비슷한 아이콘으로
export const hallIcon = (name) => (!name || name === 'crown' ? 'workspace_premium' : name)
