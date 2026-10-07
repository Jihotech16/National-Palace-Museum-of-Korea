import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import seoulMuseumImage from '../../../image/SeoulHistoryMuseum/zone2.jpeg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/seoul-history-museum-hall-list')
  }

  const handleStartExploration = () => {
    navigate('/2_Seoul_Empire/Question01', { state: { skipCover: true } })
  }

  return (
    <div className="seoul-empire-start-container">
      <div className="seoul-empire-header">
        <button 
          className="seoul-empire-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="seoul-empire-header-title">전시관 안내</h2>
        <button className="seoul-empire-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      <div className="seoul-empire-content">
        <div className="seoul-empire-image-section">
          <div 
            className="seoul-empire-image"
            style={{
              backgroundImage: `url(${seoulMuseumImage})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="seoul-empire-image-overlay"></div>
            <div className="seoul-empire-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>Zone 2</span>
            </div>
            <div className="seoul-empire-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        <div className="seoul-empire-info-section">
          <div className="seoul-empire-tags">
            <div className="seoul-empire-tag primary">
              <span className="material-symbols-outlined">history_edu</span>
              <span>Zone 2</span>
            </div>
            <div className="seoul-empire-tag secondary">
              <span>대한제국</span>
            </div>
          </div>

          <h1 className="seoul-empire-title">
            개항과 대한제국,<br />
            <span className="seoul-empire-title-gradient">1863-1910</span>
          </h1>

          <div className="seoul-empire-divider"></div>

          <div className="seoul-empire-description">
            <p>
              개항과 대한제국 시기는 조선이 서구 문명과 만나 근대화의 길을 걷기 시작한 시기입니다. 1863년부터 1910년까지 이 시기는 개항장의 형성, 근대적 제도 도입, 그리고 대한제국 선포 등 역사적 전환점들이 있었습니다.
            </p>
            <p>
              이곳에서 <strong>경운궁</strong>과 <strong>덕수궁</strong> 등 근대 궁궐의 모습을 탐험하고, 개항기 서울의 변화를 찾아보세요.
            </p>
          </div>

          <div className="seoul-empire-difficulty">
            <div className="seoul-empire-difficulty-header">
              <span className="seoul-empire-difficulty-label">미션 난이도</span>
              <span className="seoul-empire-difficulty-value">Medium</span>
            </div>
            <div className="seoul-empire-difficulty-bar">
              <div className="seoul-empire-difficulty-fill"></div>
              <div className="seoul-empire-difficulty-fill"></div>
              <div className="seoul-empire-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="seoul-empire-footer">
        <button 
          className="seoul-empire-start-button"
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
