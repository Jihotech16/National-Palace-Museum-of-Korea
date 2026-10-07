import { useNavigate } from 'react-router-dom'
import seoulMuseumImage from '../image/SeoulHistoryMuseum/서울역사박물관.jpeg'
import './SeoulHistoryMuseum.css'

function SeoulHistoryMuseum() {
  const navigate = useNavigate()

  const handleStart = () => {
    // 서울역사박물관 전시관 목록으로 이동
    navigate('/seoul-history-museum-hall-list')
  }

  const handleMuseumSelect = () => {
    navigate('/choice-museum')
  }

  const handleUserGuide = () => {
    navigate('/userguide')
  }

  return (
    <div className="seoul-landing-container">
      {/* Background Image with Overlay */}
      <div className="seoul-landing-background">
        <div 
          className="seoul-landing-bg-image"
          style={{
            backgroundImage: `url(${seoulMuseumImage})`
          }}
        />
        {/* Gradient Overlay */}
        <div className="seoul-landing-gradient-overlay" />
        <div className="seoul-landing-gradient-bottom" />
      </div>

      {/* Content Area */}
      <div className="seoul-landing-content">
        {/* Top Section: Branding */}
        <div className="seoul-landing-top">
          <a 
            href="https://www.museum.seoul.kr/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="seoul-landing-brand"
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined">account_balance</span>
            <span className="seoul-landing-brand-text">서울역사박물관</span>
          </a>
        </div>

        {/* Bottom Section: Main Content */}
        <div className="seoul-landing-main">
          {/* Decorative Icon */}
          <div className="seoul-landing-icon">
            <span className="material-symbols-outlined">history_edu</span>
          </div>

          {/* Headline */}
          <h1 className="seoul-landing-title">
            서울역사박물관<br/>
            <span className="seoul-landing-title-accent">탐험</span>
          </h1>

          {/* Body Text */}
          <p className="seoul-landing-description">
            서울의 유구한 역사와 도시의 변화를<br/> 
            탐험하고 퀴즈를 풀어보세요.
          </p>

          {/* Primary Button */}
          <div className="seoul-landing-button-container">
            <button className="seoul-landing-primary-btn" onClick={handleStart}>
              <div className="seoul-landing-btn-content">
                <span className="seoul-landing-btn-text">탐험 시작하기</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
              {/* Shine effect */}
              <div className="seoul-landing-shine" />
            </button>
          </div>

          {/* Secondary Button Group */}
          <div className="seoul-landing-secondary-buttons">
            <button className="seoul-landing-secondary-btn" onClick={handleMuseumSelect}>
              <span className="material-symbols-outlined">museum</span>
              <span>박물관 선택하기</span>
            </button>
            <div className="seoul-landing-divider" />
            <button className="seoul-landing-secondary-btn" onClick={handleUserGuide}>
              <span className="material-symbols-outlined">help</span>
              <span>이용안내</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeoulHistoryMuseum

