import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import heroImage from '../image/일월오봉도 병풍.jpg'
import './MainPage.css'

function MainPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // 라이트(한지) 테마 사용
    document.documentElement.classList.remove('dark')
  }, [])

  const handleStart = () => {
    navigate('/login')
  }

  const handleTeacherLogin = () => {
    navigate('/teacher-login')
  }

  return (
    <div className="main-container">
      {/* Hero: 일월오봉도 */}
      <div className="main-hero">
        <img className="main-hero-image" src={heroImage} alt="일월오봉도 병풍" />
        <div className="main-hero-fade" />
      </div>

      <div className="main-content">
        {/* Branding */}
        <div className="main-titles">
          <p className="main-subtitle">국립고궁박물관 · 서울역사박물관</p>
          <h1 className="main-title">
            박물관<br/>미션 클리어
          </h1>
          <p className="main-description">
            전시실을 돌아다니며 유물 속 단서를 찾고<br/>미션을 하나씩 완성해 보세요.
          </p>
        </div>

        {/* Actions */}
        <div className="main-bottom">
          <button className="main-primary-btn" onClick={handleStart}>
            <span className="main-btn-text">탐험 시작하기</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button className="main-secondary-btn" onClick={handleTeacherLogin}>
            <span className="material-symbols-outlined">badge</span>
            <span>교사 / 관리자 로그인</span>
          </button>
          <p className="main-footer">
            v2.1.0 · Museum Mission Service
          </p>
        </div>
      </div>
    </div>
  )
}

export default MainPage
