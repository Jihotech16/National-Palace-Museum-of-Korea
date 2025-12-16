import { useNavigate } from 'react-router-dom'
import './JoseonRoyalCourtStart.css'

function JoseonRoyalCourtStart() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 실제 활동지로 이동
    navigate('/activity/seal/activity')
  }

  return (
    <div className="joseon-royal-court-start-container">
      {/* 헤더 */}
      <div className="joseon-royal-court-header">
        <button 
          className="joseon-royal-court-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="joseon-royal-court-header-title">전시관 안내</h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="joseon-royal-court-content">
        {/* 이미지 섹션 */}
        <div className="joseon-royal-court-image-section">
          <div 
            className="joseon-royal-court-image"
            style={{
              backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBXHOS2FSjAni0Pe5KnBxkFa-zRvM2V4G7Oy1Qkn2TcpsdTIhbNlZuO9ds54OkDBxnwNa69XftYvjsFNuT5pWN9CmdJQ1Zt3DxjOwoE2-p4WmxEGA2Cgm6D2NSOwVhgNYAGdt1m3powhcuLiO6wi1OKnVOCgBviFMNfVaq55-d-5FnK4nkrmPNJ789s_8ZbZjCIqL-XEYH8kBAyi_sQ6Nz3Br5wyeKxJ7SB17lTRhL1CmkkGJqZdrdQ_JQzPGdtFkv599OU3ouZu0O6")'
            }}
          >
            <div className="joseon-royal-court-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="joseon-royal-court-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 2층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="joseon-royal-court-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="joseon-royal-court-info-section">
          {/* 태그 */}
          <div className="joseon-royal-court-tags">
            <div className="joseon-royal-court-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 1전시실</span>
            </div>
            <div className="joseon-royal-court-tag secondary">
              <span>조선 왕조</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="joseon-royal-court-title">
            왕실의 품격,<br />
            <span className="joseon-royal-court-title-gradient">조선국왕실</span>
          </h1>

          {/* 구분선 */}
          <div className="joseon-royal-court-divider"></div>

          {/* 설명 */}
          <div className="joseon-royal-court-description">
            <p>
              조선국왕실은 500년 역사를 지닌 조선 왕조의 역사와 문화를 한눈에 볼 수 있는 전시관입니다. 국왕의 권위를 상징하는 다양한 의례용품과 왕실의 생활상을 보여주는 유물들이 전시되어 있습니다.
            </p>
            <p>
              이곳에서 <strong>어좌</strong>와 <strong>일월오봉도</strong> 등 왕실의 상징적인 문화유산을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="joseon-royal-court-difficulty">
            <div className="joseon-royal-court-difficulty-header">
              <span className="joseon-royal-court-difficulty-label">미션 난이도</span>
              <span className="joseon-royal-court-difficulty-value">Easy</span>
            </div>
            <div className="joseon-royal-court-difficulty-bar">
              <div className="joseon-royal-court-difficulty-fill"></div>
              <div className="joseon-royal-court-difficulty-empty"></div>
              <div className="joseon-royal-court-difficulty-empty"></div>
              <div className="joseon-royal-court-difficulty-empty"></div>
              <div className="joseon-royal-court-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="joseon-royal-court-footer">
        <button 
          className="joseon-royal-court-start-button"
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

export default JoseonRoyalCourtStart
