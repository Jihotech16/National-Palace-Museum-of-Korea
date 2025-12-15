import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithStudentId } from '../firebase/auth'
import './Login.css'

function Login() {
  const [studentId, setStudentId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!studentId) {
      setError('학번을 입력해주세요.')
      setLoading(false)
      return
    }

    // 학번 형식 검증 (예: 30101)
    if (!/^\d{5}$/.test(studentId)) {
      setError('학번은 5자리 숫자로 입력해주세요. (예: 30101)')
      setLoading(false)
      return
    }

    const result = await signInWithStudentId(studentId)

    setLoading(false)

    if (result.success) {
      navigate('/')
    } else {
      // 에러 메시지 처리
      let errorMessage = result.error || '로그인에 실패했습니다.'
      
      // 줄바꿈을 <br>로 변환하여 표시
      const errorLines = errorMessage.split('\n')
      
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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏛️ 국립고궁박물관</h1>
          <p>전시 해설 활동지</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="studentId">학번</label>
            <input
              id="studentId"
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="예: 30101 (3학년 1반 1번)"
              autoComplete="username"
              maxLength={5}
              autoFocus
            />
            <small className="form-hint">5자리 숫자로 입력하세요 (학년+반+번호)</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? '처리 중...' : '시작하기'}
          </button>
        </form>

        <div className="login-info">
          <p>💡 학번만 입력하면 자동으로 로그인됩니다.</p>
        </div>
      </div>
    </div>
  )
}

export default Login

