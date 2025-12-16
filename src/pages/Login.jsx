import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithStudentId } from '../firebase/auth'
import './Login.css'

function Login() {
  const [school, setSchool] = useState('')
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 학교 목록 (필요에 따라 수정 가능)
  const schools = [
    { value: '1', label: '학교 1' },
    { value: '2', label: '학교 2' },
    { value: '3', label: '학교 3' },
  ]

  // 학년 목록
  const grades = Array.from({ length: 6 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}학년`
  }))

  // 반 목록 (1반부터 10반까지)
  const classes = Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${i + 1}반`
  }))

  // 번호 목록 (1번부터 50번까지)
  const numbers = Array.from({ length: 50 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: `${i + 1}번`
  }))

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    }
  }

  // 선택된 값들로부터 학번 생성 (학교 + 학년 + 반 + 번호)
  const generateStudentId = () => {
    if (!school || !grade || !classNum || !number) {
      return ''
    }
    // 형식: 학교(1자리) + 학년(1자리) + 반(2자리) + 번호(2자리) = 6자리
    return `${school}${grade}${classNum}${number}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!school || !grade || !classNum || !number) {
      setError('모든 항목을 선택해주세요.')
      setLoading(false)
      return
    }

    const studentId = generateStudentId()

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
          <button className="back-button" onClick={handleBack}>
            ← 뒤로
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="school">학교</label>
            <select
              id="school"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="form-select"
              autoFocus
            >
              <option value="">학교를 선택하세요</option>
              {schools.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="grade">학년</label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="form-select"
              >
                <option value="">학년을 선택하세요</option>
                {grades.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="classNum">반</label>
              <select
                id="classNum"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value)}
                className="form-select"
              >
                <option value="">반을 선택하세요</option>
                {classes.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="number">번호</label>
              <select
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="form-select"
              >
                <option value="">번호를 선택하세요</option>
                {numbers.map((n) => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
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
          <p>💡 학교, 학년, 반, 번호를 선택하면 자동으로 로그인됩니다.</p>
        </div>
      </div>
    </div>
  )
}

export default Login

