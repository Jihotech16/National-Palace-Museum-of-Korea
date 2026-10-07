import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import seoulMuseumImage from '../../../image/SeoulHistoryMuseum/zone3.jpeg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/seoul-history-museum-hall-list')
  }

  const handleStartExploration = () => {
    navigate('/3_Seoul_Colonial/Question01', { state: { skipCover: true } })
  }

  return (
    <div className="seoul-colonial-start-container">
      <div className="seoul-colonial-header">
        <button 
          className="seoul-colonial-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="seoul-colonial-header-title">전시관 안내</h2>
        <button className="seoul-colonial-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      <div className="seoul-colonial-content">
        <div className="seoul-colonial-image-section">
          <div 
            className="seoul-colonial-image"
            style={{
              backgroundImage: `url(${seoulMuseumImage})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="seoul-colonial-image-overlay"></div>
            <div className="seoul-colonial-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>Zone 3</span>
            </div>
            <div className="seoul-colonial-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        <div className="seoul-colonial-info-section">
          <div className="seoul-colonial-tags">
            <div className="seoul-colonial-tag primary">
              <span className="material-symbols-outlined">history_edu</span>
              <span>Zone 3</span>
            </div>
            <div className="seoul-colonial-tag secondary">
              <span>일제강점기</span>
            </div>
          </div>

          <h1 className="seoul-colonial-title">
            일제강점기의 서울,<br />
            <span className="seoul-colonial-title-gradient">1910-1945</span>
          </h1>

          <div className="seoul-colonial-divider"></div>

          <div className="seoul-colonial-description">
            <p>
              일제강점기는 한국 근현대사에서 가장 어두운 시기 중 하나입니다. 1910년부터 1945년까지 35년간 지속된 이 시기는 식민지 지배와 민족의 저항이 공존했던 시기입니다.
            </p>
            <p>
              이곳에서 <strong>경성부</strong>의 변화와 <strong>독립운동</strong>의 흔적을 탐험하고, 그 시대 서울의 모습을 찾아보세요.
            </p>
          </div>

          <div className="seoul-colonial-difficulty">
            <div className="seoul-colonial-difficulty-header">
              <span className="seoul-colonial-difficulty-label">미션 난이도</span>
              <span className="seoul-colonial-difficulty-value">Hard</span>
            </div>
            <div className="seoul-colonial-difficulty-bar">
              <div className="seoul-colonial-difficulty-fill"></div>
              <div className="seoul-colonial-difficulty-fill"></div>
              <div className="seoul-colonial-difficulty-fill"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="seoul-colonial-footer">
        <button 
          className="seoul-colonial-start-button"
          onClick={handleStartExploration}
        >
          <div>
            <span className="material-symbols-outlined">flag</span>
            <span>탐험 시작하기</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Start
