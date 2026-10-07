import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import './MainPage.css'

function MainPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // MainPage는 dark 모드 사용
    document.documentElement.classList.add('dark')
    return () => {
      // 필요시 언마운트 시 제거
    }
  }, [])

  const handleStart = () => {
    navigate('/login')
  }

  const handleTeacherLogin = () => {
    navigate('/teacher-login')
  }

  return (
    <div className="main-container">
      {/* Background Image with Overlay */}
      <div className="main-background">
        <div 
          className="main-bg-image"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCeKL7GVeWFNZ-0yW2qPmb0c8A6-OV-H9orDwzzdzHKc1SL7qgFKXCQXGWeT2-OfXPp53Imi_ri-ack8ujemxYI3Huhcu5cbC3SJ6vrrCRBAVUJixvpblC1tezerzi8Dr0i4Vg3nEm_Zu0Qq0ylwZ5sClAlew3pXRm-_bLXs40Xm7HlyOpinv-y9Z04A5RgzR-oKO_yVHzFSwtjxkzTQzQNYw3QxgUxsD2KrkSmIMeTqtuq3IbH34cV3yHCAscdPqDkzfYqLC3BWEIq")'
          }}
        />
        {/* Gradient Overlay */}
        <div className="main-gradient-overlay" />
      </div>

      {/* Content Area */}
      <div className="main-content">
        {/* Top Section: Branding */}
        <div className="main-top">
          <div className="main-top-inner">
            {/* Logo Icon */}
            <div className="main-icon-container">
              <span className="material-symbols-outlined main-icon">explore</span>
            </div>
            {/* Titles */}
            <div className="main-titles">
              <h2 className="main-subtitle">Digital Heritage</h2>
              <h1 className="main-title">
                박물관<br/>미션 클리어
              </h1>
              <div className="main-divider"></div>
              <p className="main-description">
                과거와 현재를 잇는<br/>디지털 탐험
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Actions */}
        <div className="main-bottom">
          {/* Primary Button */}
          <div className="main-button-container">
            <button className="main-primary-btn" onClick={handleStart}>
              <span className="material-symbols-outlined">play_arrow</span>
              <span className="main-btn-text">탐험 시작하기</span>
            </button>
          </div>
          {/* Secondary Button */}
          <button className="main-secondary-btn" onClick={handleTeacherLogin}>
            <span className="material-symbols-outlined">badge</span>
            <span>교사 / 관리자 로그인</span>
          </button>
          {/* Footer Text */}
          <p className="main-footer">
            v2.1.0 • Museum Mission Service
          </p>
        </div>
      </div>
    </div>
  )
}

export default MainPage
