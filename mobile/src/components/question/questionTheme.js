// 문제 화면 색상 (웹 1_Start.css의 Activity 오버라이드, CorrectAnswer.css에서 가져옴)
// 고궁박물관은 보라, 서울역사박물관은 파랑
const PALACE = {
  bg: '#0f0716',
  headerBg: 'rgba(15,7,22,0.9)',
  headerBorder: '#362447',
  text: '#f3e8ff',
  description: '#a78bfa',
  divider: '#7f13ec',
  badgeBg: 'rgba(0,0,0,0.5)',
  badgeBorder: 'rgba(255,255,255,0.1)',
  inputBg: 'rgba(29,18,38,0.6)',
  inputBorder: 'rgba(54,36,71,0.5)',
  placeholder: '#a78bfa',
  inputIcon: '#9ca3af',
  focus: '#7f13ec',
  submit: '#a855f7',
  submitShadow: 'rgba(168,85,247,0.3)',
  footerBorder: 'rgba(54,36,71,0.5)',
  footerFade: ['rgba(15,7,22,0)', '#0f0716'],
}

const SEOUL = {
  bg: '#0f172a',
  headerBg: 'rgba(15,23,42,0.9)',
  headerBorder: '#1e293b',
  text: '#f3e8ff',
  description: '#94a3b8',
  divider: '#2563eb',
  badgeBg: 'rgba(37,99,235,0.2)',
  badgeBorder: 'rgba(37,99,235,0.4)',
  inputBg: 'rgba(30,41,59,0.6)',
  inputBorder: 'rgba(51,65,85,0.5)',
  placeholder: '#60a5fa',
  inputIcon: '#9ca3af',
  focus: '#2563eb',
  submit: '#2563eb',
  submitShadow: 'rgba(37,99,235,0.3)',
  footerBorder: 'rgba(30,41,59,0.5)',
  footerFade: ['rgba(15,23,42,0)', '#0f172a'],
}

// 정답 화면 (CorrectAnswer.css 기본 = 보라, -blue = 파랑)
const CORRECT_PURPLE = {
  bg: '#0f0716',
  glow1: 'rgba(168,85,247,0.18)',
  glow2: 'rgba(251,191,36,0.16)',
  iconGradient: ['#10b981', '#a855f7', '#fbbf24'],
  iconShadow: 'rgba(168,85,247,0.5)',
  star2: '#a855f7',
  title: '#f3e8ff',
  subtitle: '#a78bfa',
  description: 'rgba(167,139,250,0.8)',
  cardBg: '#1d1226',
  cardBorder: 'rgba(16,185,129,0.3)',
  cardShadow: 'rgba(16,185,129,0.1)',
  checkBg: 'rgba(16,185,129,0.2)',
  check: '#10b981',
  cardSubtitle: '#a78bfa',
  scoreBorder: '#362447',
  scoreLabel: '#a78bfa',
  scoreValue: '#fbbf24',
  progress: ['#10b981', '#a855f7'],
  explanationIcon: '#a855f7',
  explanationText: '#a78bfa',
  next: ['#a855f7', '#7e22ce'],
  nextShadow: 'rgba(168,85,247,0.3)',
}

const CORRECT_BLUE = {
  ...CORRECT_PURPLE,
  bg: '#0f172a',
  glow1: 'rgba(37,99,235,0.18)',
  iconGradient: ['#10b981', '#2563eb', '#fbbf24'],
  iconShadow: 'rgba(37,99,235,0.5)',
  star2: '#2563eb',
  subtitle: '#60a5fa',
  description: 'rgba(96,165,250,0.8)',
  cardBg: '#1e293b',
  cardBorder: 'rgba(37,99,235,0.3)',
  cardShadow: 'rgba(37,99,235,0.1)',
  checkBg: 'rgba(37,99,235,0.2)',
  check: '#2563eb',
  cardSubtitle: '#60a5fa',
  scoreBorder: 'rgba(51,65,85,0.5)',
  scoreLabel: '#60a5fa',
  scoreValue: '#2563eb',
  progress: ['#10b981', '#2563eb'],
  explanationIcon: '#2563eb',
  explanationText: '#60a5fa',
  next: ['#2563eb', '#1d4ed8'],
  nextShadow: 'rgba(37,99,235,0.3)',
}

export const questionTheme = (museum) => (museum === 'seoul' ? SEOUL : PALACE)
export const correctTheme = (museum) => (museum === 'seoul' ? CORRECT_BLUE : CORRECT_PURPLE)

// 헤더 제목: 전시관 이름 (웹 QuestionPage의 getExhibitionHallName)
const HALL_NAMES = {
  '1_King_of_Joseon': '조선국왕',
  '2_Royal_Life': '왕실생활',
  '3_Empire_of_Korea': '대한제국',
  '4_Palace_Painting': '궁중서화',
  '5_Royal_Ritual': '왕실의례',
  '6_Science_Culture': '과학문화',
  '1_Seoul_Joseon': 'Zone 1',
  '2_Seoul_Empire': 'Zone 2',
  '3_Seoul_Colonial': 'Zone 3',
  '4_Seoul_Growth': 'Zone 4',
}
export const hallTitle = (hallId) => HALL_NAMES[hallId] || '조선국왕'

// 사진에서 보여줄 위치 (웹의 background-position을 expo-image contentPosition으로)
export function imagePositionOf(q) {
  const pos = q?.imageStyle?.backgroundPosition
  if (pos) return pos.trim()
  if (q?.customCss?.includes('Clothing')) return 'top center'
  return 'center'
}
