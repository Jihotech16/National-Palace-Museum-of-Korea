import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import 왕실의례실Image from '../../image/왕실의례실.jpg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동 (표지 건너뛰기)
    navigate('/5_Royal_Ritual/Question01_FiveRites', { state: { skipCover: true } })
  }

  return (
    <div className="ritual-start-container">
      {/* 헤더 */}
      <div className="ritual-header">
        <button 
          className="ritual-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="ritual-header-title">전시관 안내</h2>
        <button className="ritual-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="ritual-content">
        {/* 이미지 섹션 */}
        <div className="ritual-image-section">
          <div 
            className="ritual-image"
            style={{
              backgroundImage: `url(${왕실의례실Image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="ritual-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="ritual-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 지하 1층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="ritual-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="ritual-info-section">
          {/* 태그 */}
          <div className="ritual-tags">
            <div className="ritual-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 5전시실</span>
            </div>
            <div className="ritual-tag secondary">
              <span>왕실의례</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="ritual-title">
            조선 왕조의 위엄,<br />
            <span className="ritual-title-gradient">왕실의례</span>
          </h1>

          {/* 구분선 */}
          <div className="ritual-divider"></div>

          {/* 설명 */}
          <div className="ritual-description">
            <p>
              왕실의례실은 조선 왕조의 위엄과 권위를 상징하는 다양한 의례용품을 통해 왕실의 의례 문화를 탐험해보는 전시관입니다. 국왕의 즉위식, 대례, 제례 등 중요한 의식에서 사용된 유물들이 전시되어 있습니다.
            </p>
            <p>
              이곳에서 <strong>왕실 의례</strong>와 <strong>의례용품</strong>을 통해 조선 왕조의 권위와 위엄을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="ritual-difficulty">
            <div className="ritual-difficulty-header">
              <span className="ritual-difficulty-label">미션 난이도</span>
              <span className="ritual-difficulty-value">Easy</span>
            </div>
            <div className="ritual-difficulty-bar">
              <div className="ritual-difficulty-fill"></div>
              <div className="ritual-difficulty-empty"></div>
              <div className="ritual-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="ritual-footer">
        <button 
          className="ritual-start-button"
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

