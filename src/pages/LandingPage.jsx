import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <div className="landing-container">
      {/* Background Image with Overlay */}
      <div className="landing-background">
        <div 
          className="landing-bg-image"
          style={{
            backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDyQEDp7Z-I0HGOQo-LaIWaM-oOTTSWhziXAS1LUQm8mCQFN_HBbvdT0RXRJWQbBPhgketGnhhdRpyhJWVuYaKoRHGoLpcqNvx5h0KEehV-i9tabacJjWiVrrL5Gf_r0QKwbuJEsANAt8RjN1Yu2hSeTv25uwsufTy3v2YO4aQw1RA23UH-cI1RJm2zR-rluu-djLnH2R2TdlcR5BFNEJcwMxaQ0QKpEf_LUADinr3YXfGnAsL74-D7H4p9z2YvZDAyHXTlKPR7cjoo")'
          }}
        />
        {/* Gradient Overlay */}
        <div className="landing-gradient-overlay" />
        <div className="landing-gradient-bottom" />
      </div>

      {/* Content Area */}
      <div className="landing-content">
        {/* Top Section: Branding */}
        <div className="landing-top">
          <div className="landing-brand">
            <span className="material-symbols-outlined">temple_buddhist</span>
            <span className="landing-brand-text">국립고궁박물관</span>
          </div>
          <button className="landing-settings-btn">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Bottom Section: Main Content */}
        <div className="landing-main">
          {/* Decorative Icon */}
          <div className="landing-icon">
            <span className="material-symbols-outlined">search_check</span>
          </div>

          {/* Headline */}
          <h1 className="landing-title">
            국립고궁박물관의<br/>
            <span className="landing-title-accent">비밀</span>
          </h1>

          {/* Body Text */}
          <p className="landing-description">
            박물관 곳곳에 숨겨진 단서를 찾아<br/> 
            고대의 미스터리를 지금 바로 해결하세요.
          </p>

          {/* Primary Button */}
          <div className="landing-button-container">
            <button className="landing-primary-btn" onClick={handleStart}>
              <div className="landing-btn-content">
                <span className="landing-btn-text">탐험 시작하기</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
              {/* Shine effect */}
              <div className="landing-shine" />
            </button>
          </div>

          {/* Secondary Button Group */}
          <div className="landing-secondary-buttons">
            <button className="landing-secondary-btn" onClick={handleLogin}>
              <span className="material-symbols-outlined">login</span>
              <span>로그인</span>
            </button>
            <div className="landing-divider" />
            <button className="landing-secondary-btn">
              <span className="material-symbols-outlined">help</span>
              <span>이용안내</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

