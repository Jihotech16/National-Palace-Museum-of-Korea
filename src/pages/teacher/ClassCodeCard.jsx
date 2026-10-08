import { useState, useEffect } from 'react'
import { getActiveClassSession, createClassSession, closeClassSession, SESSION_VALID_DAYS } from '../../firebase/firestore'

// 교사 대시보드: 학생이 입장할 때 쓰는 수업 코드 관리
function ClassCodeCard({ teacherData }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const { schoolCode, grade, classNum } = teacherData || {}

  useEffect(() => {
    if (!schoolCode) return
    getActiveClassSession(schoolCode, grade, classNum).then((result) => {
      if (result.success) setSession(result.session)
      else setError('수업 코드를 불러오지 못했습니다.')
      setLoading(false)
    })
  }, [schoolCode, grade, classNum])

  const handleCreate = async () => {
    setWorking(true)
    setError('')
    const result = await createClassSession(schoolCode, grade, classNum)
    if (result.success) setSession(result.session)
    else setError(result.error || '수업 코드를 만들지 못했습니다.')
    setWorking(false)
  }

  const handleClose = async () => {
    if (!session) return
    setWorking(true)
    setError('')
    const result = await closeClassSession(session.code)
    if (result.success) setSession(null)
    else setError(result.error || '수업 코드를 닫지 못했습니다.')
    setWorking(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(session.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const expiresLabel = session?.expiresAt?.toDate
    ? session.expiresAt.toDate().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })
    : ''

  return (
    <section className="teacher-code-card">
      <div className="teacher-code-header">
        <div>
          <h3 className="teacher-code-title">수업 코드</h3>
          <p className="teacher-code-subtitle">학생은 이 코드와 번호만 입력해 입장해요.</p>
        </div>
        <span className="material-symbols-outlined teacher-code-icon">key</span>
      </div>

      {loading ? (
        <p className="teacher-code-empty">불러오는 중...</p>
      ) : session ? (
        <>
          <button type="button" className="teacher-code-value" onClick={handleCopy} aria-label="수업 코드 복사">
            <span>{session.code}</span>
            <span className="material-symbols-outlined">{copied ? 'check' : 'content_copy'}</span>
          </button>
          <p className="teacher-code-meta">{expiresLabel}까지 입장 가능</p>
          <div className="teacher-code-actions">
            <button type="button" className="teacher-code-btn" onClick={handleCreate} disabled={working}>
              새 코드
            </button>
            <button type="button" className="teacher-code-btn teacher-code-btn-danger" onClick={handleClose} disabled={working}>
              입장 닫기
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="teacher-code-empty">사용 중인 코드가 없어요. 코드는 {SESSION_VALID_DAYS}일 동안 쓸 수 있어요.</p>
          <button type="button" className="teacher-code-btn teacher-code-btn-primary" onClick={handleCreate} disabled={working}>
            {working ? '만드는 중...' : '수업 코드 만들기'}
          </button>
        </>
      )}

      {error && <p className="teacher-code-error">{error}</p>}
    </section>
  )
}

export default ClassCodeCard
