// 웹앱 CSS에서 가져온 색상
export const gold = {
  accent: '#ecb613',
  accentDark: '#d4a510',
  bg: '#221d10',
  surface: '#2e2716',
  border: 'rgba(255,255,255,0.08)',
  text: '#ffffff',
  muted: 'rgba(255,255,255,0.6)',
}

// 국립고궁박물관 (보라)
export const palace = {
  accent: '#a855f7',
  accentSoft: '#a78bfa',
  text: '#f3e8ff',
  bg: '#1d1226',
  bgDeep: '#0f0716',
  surface: '#2a1b36',
  surfaceAlt: '#362447',
  border: 'rgba(168,85,247,0.25)',
  muted: '#a78bfa',
}

// 서울역사박물관 (파랑)
export const seoul = {
  accent: '#2563eb',
  accentSoft: '#60a5fa',
  text: '#e0ecff',
  bg: '#0f172a',
  bgDeep: '#020617',
  surface: '#1e293b',
  surfaceAlt: '#334155',
  border: 'rgba(37,99,235,0.3)',
  muted: '#93c5fd',
}

// 로그인, 교사 화면 (진한 보라)
export const violet = {
  primary: '#7f13ec',
  primaryDark: '#5e0eb0',
  bg: '#191022',
  surface: '#261933',
  surfaceAlt: '#2d1f3f',
  border: '#4d3267',
  muted: '#ad92c9',
  text: '#ffffff',
}

export const status = {
  danger: '#ef4444',
  success: '#10b981',
  warning: '#fbbf24',
}

export const museumTheme = (museum) => (museum === 'seoul' ? seoul : palace)
