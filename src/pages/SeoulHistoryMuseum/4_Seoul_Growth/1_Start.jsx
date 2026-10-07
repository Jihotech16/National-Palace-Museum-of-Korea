import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import seoulMuseumImage from '../../../image/SeoulHistoryMuseum/서울역사박물관.jpeg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/seoul-history-museum-hall-list')
  }

  const handleStartExploration = () => {
    navigate('/4_Seoul_Growth/Question01', { state: { skipCover: true } })
  }

  return (
    <div className="seoul-growth-start-container">
      <div className="seoul-growth-header">
        <button 
          className="seoul-growth-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="seoul-growth-header-title">전시관 안내</h2>
        <button className="seoul-growth-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      <div className="seoul-growth-content">
        <div className="seoul-growth-image-section">
          <div 
            className="seoul-growth-image"
            style={{
              backgroundImage: `url(${seoulMuseumImage})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="seoul-growth-image-overlay"></div>
            <div className="seoul-growth-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>Zone 4</span>
            </div>
            <div className="seoul-growth-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        <div className="seoul-growth-info-section">
          <div className="seoul-growth-tags">
            <div className="seoul-growth-tag primary">
              <span className="material-symbols-outlined">history_edu</span>
              <span>Zone 4</span>
            </div>
            <div className="seoul-growth-tag secondary">
              <span>고도성장기</span>
            </div>
          </div>

          <h1 className="seoul-growth-title">
            고도성장기 서울,<br />
            <span className="seoul-growth-title-gradient">1945-2002</span>
          </h1>

          <div className="seoul-growth-divider"></div>

          <div className="seoul-growth-description">
            <p>
              고도성장기는 한국이 전쟁의 폐허에서 일어나 세계적인 경제 강국으로 성장한 시기입니다. 1945년부터 2002년까지 이 시기는 산업화, 도시화, 그리고 민주화가 동시에 진행된 시기입니다.
            </p>
            <p>
              이곳에서 <strong>한강의 기적</strong>과 <strong>올림픽</strong> 등 현대 서울의 탄생을 탐험하고, 급속한 변화의 흔적을 찾아보세요.
            </p>
          </div>

          <div className="seoul-growth-difficulty">
            <div className="seoul-growth-difficulty-header">
              <span className="seoul-growth-difficulty-label">미션 난이도</span>
              <span className="seoul-growth-difficulty-value">Easy</span>
            </div>
            <div className="seoul-growth-difficulty-bar">
              <div className="seoul-growth-difficulty-fill"></div>
              <div className="seoul-growth-difficulty-empty"></div>
              <div className="seoul-growth-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="seoul-growth-footer">
        <button 
          className="seoul-growth-start-button"
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
