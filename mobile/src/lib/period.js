// 박물관 활동 기간 계산 (네트워크 없이 쓰는 순수 함수)
const toDate = (v) => (v?.toDate ? v.toDate() : new Date(v))

// 활동 기간 안인지 (시각 비교는 절대 시간이라 시간대와 상관없이 정확함)
export function periodOf(periods, museum) {
  const p = periods?.[museum]
  if (!p?.startDate || !p?.endDate) return null
  return { startDate: toDate(p.startDate), endDate: toDate(p.endDate) }
}

export function isMuseumOpen(periods, museum, now = new Date()) {
  const p = periodOf(periods, museum)
  return !!p && now >= p.startDate && now <= p.endDate
}

// 한국 시간으로 "2026년 10월 8일 09:00" 형태
export function formatKoreanDateTime(date) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)
  const get = (t) => parts.find((x) => x.type === t)?.value || ''
  return `${get('year')}년 ${get('month')}월 ${get('day')}일 ${get('hour')}:${get('minute')}`
}
