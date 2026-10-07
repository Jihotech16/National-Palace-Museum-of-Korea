/** 교사 그룹 표시: 동아리는 grade 0 + classNum = 동아리 번호 */
export function formatTeacherGroupLabel({ grade, classNum }) {
  const g = Number(grade)
  const c = Number(classNum)
  if (g === 0 && !Number.isNaN(c)) {
    return `동아리 ${c}`
  }
  return `${g}학년 ${c}반`
}
