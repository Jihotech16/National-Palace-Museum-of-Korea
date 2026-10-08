// 교사 화면 색상 (웹 TeacherPage.css 등에서 가져옴)
import { violet } from '../../theme/colors'

export const t = {
  ...violet,
  headerBg: 'rgba(15,7,22,0.95)',
  headerBorder: '#362447',
  headerText: '#f3e8ff',
  navBorder: 'rgba(77,50,103,0.3)',
  gray: '#6b7280',
  slate: '#94a3b8',
  slateLight: '#cbd5e1',
  slateLighter: '#e2e8f0',
  danger: '#ef4444',
  dangerText: '#fca5a5',
  green: '#10b981',
  exploring: '#22c55e',
  dark: 'rgba(17,24,39,0.5)',
}

// 전시관 색 (orange / blue / emerald)
export const hallColors = {
  orange: { fg: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  blue: { fg: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  emerald: { fg: '#10b981', bg: 'rgba(16,185,129,0.1)' },
}
