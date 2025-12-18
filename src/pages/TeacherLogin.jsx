import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInAsTeacher, signInAsAdmin } from '../firebase/auth'
import './TeacherLogin.css'

function TeacherLogin() {
  const [schoolCode, setSchoolCode] = useState('')
  const [grade, setGrade] = useState('')
  const [classNum, setClassNum] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // 관리자 로그인 체크 (학교 코드: Admin, 비밀번호: Admin)
    if (schoolCode === 'Admin' && password === 'Admin') {
      setLoading(true)
      try {
        const result = await signInAsAdmin(password)
        if (result.success) {
          // 관리자 페이지로 이동
          navigate('/admin')
        } else {
          setError(result.error || '관리자 로그인에 실패했습니다.')
          setLoading(false)
        }
      } catch (err) {
        console.error('관리자 로그인 오류:', err)
        setError('관리자 로그인 중 오류가 발생했습니다.')
        setLoading(false)
      }
      return
    }
    
    if (!schoolCode || !grade || !classNum || !password) {
      setError('모든 정보를 입력해주세요.')
      return
    }

    // 학년과 반 유효성 검사
    const gradeNum = Number(grade)
    const classNumNum = Number(classNum)
    
    if (isNaN(gradeNum) || gradeNum < 1 || gradeNum > 6) {
      setError('학년은 1~6 사이의 숫자여야 합니다.')
      return
    }
    
    if (isNaN(classNumNum) || classNumNum < 1 || classNumNum > 20) {
      setError('반은 1~20 사이의 숫자여야 합니다.')
      return
    }

    setLoading(true)
    
    try {
      const result = await signInAsTeacher(schoolCode, gradeNum, classNumNum, password)
      
      if (result.success) {
        // 교사 정보 저장
        const teacherData = {
          schoolCode,
          grade: gradeNum,
          classNum: classNumNum
        }
        localStorage.setItem('teacherData', JSON.stringify(teacherData))
        
        // 자동 로그인 정보 저장 (선택사항)
        if (rememberMe) {
          localStorage.setItem('teacherRemember', JSON.stringify(teacherData))
        } else {
          localStorage.removeItem('teacherRemember')
        }
        
        // 교사 대시보드로 이동
        navigate('/teacher')
      } else {
        setError(result.error || '로그인에 실패했습니다.')
        setLoading(false)
      }
    } catch (err) {
      console.error('로그인 오류:', err)
      setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleStudentLogin = () => {
    navigate('/login')
  }

  return (
    <div className="teacher-login-page">
      <div className="teacher-login-container">
        <header className="teacher-login-header">
          <button 
            className="teacher-login-back-btn"
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="teacher-login-header-title">선생님 로그인</h1>
          <div className="teacher-login-header-spacer"></div>
        </header>

        <main className="teacher-login-main">
          <div className="teacher-login-welcome">
            <div className="teacher-login-icon-wrapper">
              <div className="teacher-login-icon-glow"></div>
              <div className="teacher-login-icon">
                <span className="material-symbols-outlined">supervisor_account</span>
                <div className="teacher-login-icon-badge">
                  <span className="material-symbols-outlined">check</span>
                </div>
              </div>
            </div>
            <div className="teacher-login-welcome-text">
              <h2 className="teacher-login-welcome-title">선생님, 환영합니다!</h2>
              <p className="teacher-login-welcome-subtitle">
                학교 관리자 계정으로 로그인하여<br/>
                학생들의 탐험 활동을 지도해보세요.
              </p>
            </div>
          </div>

          <form className="teacher-login-form" onSubmit={handleSubmit}>
            <div className="teacher-login-field">
              <label className="teacher-login-label" htmlFor="school-code">
                학교 코드
              </label>
              <div className="teacher-login-input-wrapper">
                <div className="teacher-login-input-icon">
                  <span className="material-symbols-outlined">domain</span>
                </div>
                <input
                  className="teacher-login-input"
                  id="school-code"
                  name="school-code"
                  type="text"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  placeholder="학교 코드를 입력하세요"
                  autoComplete="organization"
                  autoFocus
                />
              </div>
            </div>

            <div className="teacher-login-form-grid">
              <div className="teacher-login-field">
                <label className="teacher-login-label" htmlFor="grade">
                  학년
                </label>
                <div className="teacher-login-input-wrapper">
                  <div className="teacher-login-input-icon">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <input
                    className="teacher-login-input teacher-login-input-center"
                    id="grade"
                    name="grade"
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

              <div className="teacher-login-field">
                <label className="teacher-login-label" htmlFor="class-num">
                  반
                </label>
                <div className="teacher-login-input-wrapper">
                  <div className="teacher-login-input-icon">
                    <span className="material-symbols-outlined">class</span>
                  </div>
                  <input
                    className="teacher-login-input teacher-login-input-center"
                    id="class-num"
                    name="class-num"
                    type="number"
                    value={classNum}
                    onChange={(e) => setClassNum(e.target.value)}
                    placeholder="1"
                    min="1"
                    max="20"
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="teacher-login-field">
              <label className="teacher-login-label" htmlFor="password">
                비밀번호
              </label>
              <div className="teacher-login-input-wrapper">
                <div className="teacher-login-input-icon">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <input
                  className="teacher-login-input"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                />
                <button
                  className="teacher-login-password-toggle"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="teacher-login-options">
              <label className="teacher-login-checkbox-label">
                <input
                  className="teacher-login-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>자동 로그인</span>
              </label>
              <a className="teacher-login-link" href="#">
                정보 찾기
              </a>
            </div>

            {error && (
              <div className="teacher-login-error">{error}</div>
            )}

            <button
              className="teacher-login-submit"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? '처리 중...' : '로그인'}</span>
              <span className="material-symbols-outlined">login</span>
            </button>
          </form>
        </main>

        <footer className="teacher-login-footer">
          <p className="teacher-login-footer-text">
            학생 계정으로 로그인하시겠습니까?
          </p>
          <button
            className="teacher-login-footer-btn"
            type="button"
            onClick={handleStudentLogin}
          >
            <span className="material-symbols-outlined">backpack</span>
            학생 로그인으로 이동
          </button>
        </footer>
      </div>
    </div>
  )
}

export default TeacherLogin


