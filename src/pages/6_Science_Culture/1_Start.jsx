import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import 과학문화실Image from '../../image/과학문화실.jpg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동 (표지 건너뛰기)
    navigate('/6_Science_Culture/Question01_Honcheoneui', { state: { skipCover: true } })
  }

  return (
    <div className="science-start-container">
      {/* 헤더 */}
      <div className="science-header">
        <button 
          className="science-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="science-header-title">전시관 안내</h2>
        <button className="science-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="science-content">
        {/* 이미지 섹션 */}
        <div className="science-image-section">
          <div 
            className="science-image"
            style={{
              backgroundImage: `url(${과학문화실Image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="science-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="science-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 지하 1층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="science-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="science-info-section">
          {/* 태그 */}
          <div className="science-tags">
            <div className="science-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 6전시실</span>
            </div>
            <div className="science-tag secondary">
              <span>과학문화</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="science-title">
            조선의 과학 기술,<br />
            <span className="science-title-gradient">과학문화</span>
          </h1>

          {/* 구분선 */}
          <div className="science-divider"></div>

          {/* 설명 */}
          <div className="science-description">
            <p>
              과학문화실은 조선 시대의 뛰어난 과학 기술과 천문학적 성취를 보여주는 다양한 유물들을 통해 조선의 과학 문화를 탐험해보는 전시관입니다. 자격루, 앙부일구 등 과학 기구들이 전시되어 있습니다.
            </p>
            <p>
              이곳에서 <strong>과학 기술</strong>과 <strong>천문학</strong>을 통해 조선의 과학적 성취를 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="science-difficulty">
            <div className="science-difficulty-header">
              <span className="science-difficulty-label">미션 난이도</span>
              <span className="science-difficulty-value">Easy</span>
            </div>
            <div className="science-difficulty-bar">
              <div className="science-difficulty-fill"></div>
              <div className="science-difficulty-empty"></div>
              <div className="science-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="science-footer">
        <button 
          className="science-start-button"
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

