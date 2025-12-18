import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import 궁중서화실Image from '../../image/궁중서화실.jpg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동 (표지 건너뛰기)
    navigate('/4_Palace_Painting/Question01_Hwajodo', { state: { skipCover: true } })
  }

  return (
    <div className="painting-start-container">
      {/* 헤더 */}
      <div className="painting-header">
        <button 
          className="painting-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="painting-header-title">전시관 안내</h2>
        <button className="painting-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="painting-content">
        {/* 이미지 섹션 */}
        <div className="painting-image-section">
          <div 
            className="painting-image"
            style={{
              backgroundImage: `url(${궁중서화실Image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="painting-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="painting-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 지하 1층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="painting-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="painting-info-section">
          {/* 태그 */}
          <div className="painting-tags">
            <div className="painting-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 4전시실</span>
            </div>
            <div className="painting-tag secondary">
              <span>궁중서화</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="painting-title">
            조선 왕실의 품격,<br />
            <span className="painting-title-gradient">궁중서화</span>
          </h1>

          {/* 구분선 */}
          <div className="painting-divider"></div>

          {/* 설명 */}
          <div className="painting-description">
            <p>
              궁중서화실은 조선 왕실의 품격을 담은 다양한 서화 작품들을 통해 궁중 문화의 예술성을 만나보는 전시관입니다. 왕과 왕비, 그리고 궁중 화원들이 제작한 서화 작품들이 전시되어 있습니다.
            </p>
            <p>
              이곳에서 <strong>궁중 서화</strong>와 <strong>예술 문화</strong>를 통해 조선 왕실의 미학과 예술적 성취를 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="painting-difficulty">
            <div className="painting-difficulty-header">
              <span className="painting-difficulty-label">미션 난이도</span>
              <span className="painting-difficulty-value">Medium</span>
            </div>
            <div className="painting-difficulty-bar">
              <div className="painting-difficulty-fill"></div>
              <div className="painting-difficulty-fill"></div>
              <div className="painting-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="painting-footer">
        <button 
          className="painting-start-button"
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


