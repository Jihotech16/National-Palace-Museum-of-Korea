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

  // 선택된 값들로부터 학번 생성 (학교 + 학년 + 반 + 번호)
  const generateStudentId = () => {
    if (!school || !grade || !classNum || !number) {
      return ''
    }
    // 학교 이름을 숫자로 변환 (간단한 해시 방식)
    // 또는 학교 이름의 첫 글자나 특정 규칙 사용
    // 일단 "테스트학교"는 "1"로 매핑
    const schoolCode = school === '테스트학교' ? '1' : '1'
    
    // 형식: 학교(1자리) + 학년(1자리) + 반(2자리) + 번호(2자리) = 6자리
    const formattedClass = String(classNum).padStart(2, '0')
    const formattedNumber = String(number).padStart(2, '0')
    return `${schoolCode}${grade}${formattedClass}${formattedNumber}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!school || !grade || !classNum || !number) {
      setError('모든 항목을 입력해주세요.')
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
    <div className="login-page">
      <div className="login-page-bg-blur login-page-bg-blur-1"></div>
      <div className="login-page-bg-blur login-page-bg-blur-2"></div>
      
      <div className="login-page-container">
        <div className="login-page-header">
          <div className="login-page-icon">
            <span className="material-symbols-outlined">temple_buddhist</span>
          </div>
          <h1 className="login-page-title">Royal Archives</h1>
          <p className="login-page-subtitle">
            국립고궁박물관 탐험을 시작하려면<br/>학생 정보를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-page-form">
          <div className="login-form-field">
            <label className="login-form-label" htmlFor="school">학교</label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <span className="material-symbols-outlined">school</span>
              </div>
              <input
                className="login-input"
                id="school"
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="학교 이름을 입력하세요"
                autoComplete="organization"
                autoFocus
              />
            </div>
          </div>

          <div className="login-form-grid">
            <div className="login-form-field">
              <label className="login-form-label" htmlFor="grade">학년</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon">
                  <span className="material-symbols-outlined">workspace_premium</span>
                </div>
                <input
                  className="login-input login-input-center"
                  id="grade"
                  type="number"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="1"
                  min="1"
                  max="6"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="login-form-field">
              <label className="login-form-label" htmlFor="classNum">반</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon">
                  <span className="material-symbols-outlined">meeting_room</span>
                </div>
                <input
                  className="login-input login-input-center"
                  id="classNum"
                  type="number"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value)}
                  placeholder="3"
                  min="1"
                  max="10"
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="login-form-field">
              <label className="login-form-label" htmlFor="number">번호</label>
              <div className="login-input-wrapper">
                <div className="login-input-icon">
                  <span className="material-symbols-outlined">format_list_numbered</span>
                </div>
                <input
                  className="login-input login-input-center"
                  id="number"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="15"
                  min="1"
                  max="50"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {error && <div className="login-error-message">{error}</div>}

          <button 
            type="submit" 
            className="login-submit-button"
            disabled={loading}
          >
            <span>{loading ? '처리 중...' : '로그인'}</span>
            <span className="material-symbols-outlined login-submit-icon">login</span>
          </button>
        </form>

        <div className="login-page-footer">
          <p className="login-page-footer-text">
            도움이 필요하신가요? 
            <a className="login-page-footer-link" href="#">사용 가이드 보기</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
