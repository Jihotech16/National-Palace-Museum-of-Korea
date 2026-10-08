import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithClassCode } from '../firebase/auth'
import { auth } from '../firebase/config'
import { resolveStudentId, RETENTION_DAYS } from '../firebase/firestore'
import './Login.css'

function Login() {
  useEffect(() => {
    // 라이트(한지) 테마 사용
    document.documentElement.classList.remove('dark')
  }, [])
  const [sessionCode, setSessionCode] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 이미 이 기기로 입장한 학생이면 바로 박물관 선택으로 이동
  useEffect(() => {
    const user = auth?.currentUser
    if (!user?.isAnonymous) return
    resolveStudentId(user.uid).then((studentId) => {
      if (studentId) navigate('/choice-museum', { replace: true })
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!sessionCode.trim() || !number) {
      setError('수업 코드와 번호를 모두 입력해주세요.')
      return
    }

    setLoading(true)
    const result = await signInWithClassCode(sessionCode, Number(number))
    setLoading(false)

    if (result.success) {
      navigate('/choice-museum')
    } else {
      // 줄바꿈을 나눠서 표시
      const errorLines = (result.error || '입장에 실패했습니다.').split('\n')
      setError(
        <div>
          {errorLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="login-page-new">
      {/* Top App Bar */}
      <div className="login-app-bar">
        <button 
          className="login-app-bar-back"
          onClick={() => navigate('/')}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="login-app-bar-title">입장하기</h2>
        <div className="login-app-bar-spacer"></div>
      </div>

      {/* Main Content */}
      <main className="login-main-content">
        {/* Headline Section */}
        <div className="login-headline">
          <div className="login-headline-icon">
            <span className="material-symbols-outlined login-headline-icon-symbol">explore</span>
          </div>
          <h3 className="login-headline-title">
            탐험을 시작해볼까요?
          </h3>
          <p className="login-headline-subtitle">
            선생님이 알려준 수업 코드와<br/>내 번호를 입력하고 미션을 시작하세요.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="login-form-new">
          {/* Class Code Input */}
          <label className="login-form-field-new">
            <span className="login-form-label-new">수업 코드</span>
            <div className="login-input-wrapper-new">
              <input
                className="login-input-new login-code-input"
                type="text"
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
                placeholder="선생님이 알려준 6자리"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck="false"
              />
            </div>
          </label>

          {/* Number Row */}
          <label className="login-form-field-new">
            <span className="login-form-label-new">번호</span>
            <div className="login-input-wrapper-new">
              <input 
                className="login-input-new"
                type="number"
                inputMode="numeric"
                pattern="\d*"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="1"
                min="1"
                max="99"
                autoComplete="off"
              />
              <span className="login-input-suffix">번</span>
            </div>
          </label>

          <p className="login-privacy-note">
            <span className="material-symbols-outlined">verified_user</span>
            이름이나 학교 같은 개인정보는 받지 않아요. 기록은 {RETENTION_DAYS}일 뒤 자동으로 지워져요.
          </p>

          {error && <div className="login-error-message">{error}</div>}
        </form>
      </main>

      {/* Bottom Action Bar */}
      <div className="login-bottom-bar">
        <div className="login-bottom-bar-content">
          <button 
            type="button"
            onClick={handleSubmit}
            className="login-submit-button-new"
            disabled={loading}
          >
            <span>{loading ? '처리 중...' : '입장하기'}</span>
            <span className="material-symbols-outlined login-submit-icon-new">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
