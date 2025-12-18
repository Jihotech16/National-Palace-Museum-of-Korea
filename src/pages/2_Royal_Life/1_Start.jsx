import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import 왕실생활실Image from '../../image/왕실생활실.jpg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동 (표지 건너뛰기)
    navigate('/2_Royal_Life/Question01_Queen', { state: { skipCover: true } })
  }

  return (
    <div className="royal-life-start-container">
      {/* 헤더 */}
      <div className="royal-life-header">
        <button 
          className="royal-life-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="royal-life-header-title">전시관 안내</h2>
        <button className="royal-life-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="royal-life-content">
        {/* 이미지 섹션 */}
        <div className="royal-life-image-section">
          <div 
            className="royal-life-image"
            style={{
              backgroundImage: `url(${왕실생활실Image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="royal-life-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="royal-life-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 2층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="royal-life-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="royal-life-info-section">
          {/* 태그 */}
          <div className="royal-life-tags">
            <div className="royal-life-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 2전시실</span>
            </div>
            <div className="royal-life-tag secondary">
              <span>조선 왕조</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="royal-life-title">
            궁궐의 아름다움,<br />
            <span className="royal-life-title-gradient">왕실생활</span>
          </h1>

          {/* 구분선 */}
          <div className="royal-life-divider"></div>

          {/* 설명 */}
          <div className="royal-life-description">
            <p>
              왕실생활 전시관은 500년 조선 왕조의 중심이었던 궁궐의 건축미와 생활 공간을 자세히 들여다보는 전시관입니다. 왕과 왕비의 일상생활과 궁궐 내 다양한 공간의 모습을 보여주는 유물들이 전시되어 있습니다.
            </p>
            <p>
              이곳에서 <strong>궁궐 건축</strong>과 <strong>왕실 생활 공간</strong>을 통해 조선 왕실의 일상을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="royal-life-difficulty">
            <div className="royal-life-difficulty-header">
              <span className="royal-life-difficulty-label">미션 난이도</span>
              <span className="royal-life-difficulty-value">Medium</span>
            </div>
            <div className="royal-life-difficulty-bar">
              <div className="royal-life-difficulty-fill"></div>
              <div className="royal-life-difficulty-fill"></div>
              <div className="royal-life-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="royal-life-footer">
        <button 
          className="royal-life-start-button"
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


