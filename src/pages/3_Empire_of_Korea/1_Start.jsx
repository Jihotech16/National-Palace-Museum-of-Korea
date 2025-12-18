import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import 대한제국실Image from '../../image/대한제국실.jpg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동 (표지 건너뛰기)
    navigate('/3_Empire_of_Korea/Question01_Empire', { state: { skipCover: true } })
  }

  return (
    <div className="empire-start-container">
      {/* 헤더 */}
      <div className="empire-header">
        <button 
          className="empire-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="empire-header-title">전시관 안내</h2>
        <button className="empire-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="empire-content">
        {/* 이미지 섹션 */}
        <div className="empire-image-section">
          <div 
            className="empire-image"
            style={{
              backgroundImage: `url(${대한제국실Image})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="empire-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="empire-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>현위치: 1층</span>
            </div>

            {/* 검색 아이콘 */}
            <div className="empire-search-icon">
              <span className="material-symbols-outlined">search</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="empire-info-section">
          {/* 태그 */}
          <div className="empire-tags">
            <div className="empire-tag primary">
              <span className="material-symbols-outlined">museum</span>
              <span>제 3전시실</span>
            </div>
            <div className="empire-tag secondary">
              <span>대한제국</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="empire-title">
            근대 전환기의<br />
            <span className="empire-title-gradient">대한제국</span>
          </h1>

          {/* 구분선 */}
          <div className="empire-divider"></div>

          {/* 설명 */}
          <div className="empire-description">
            <p>
              대한제국실은 1897년 고종이 대한제국을 선포한 이후 근대 전환기의 역사와 문화를 보여주는 전시관입니다. 제국 선포와 함께 변화한 왕실의 모습과 근대화의 흔적을 확인할 수 있습니다.
            </p>
            <p>
              이곳에서 <strong>대한제국의 역사</strong>와 <strong>근대 전환기</strong>를 통해 조선이 근대 국가로 변화하는 과정을 만나보고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="empire-difficulty">
            <div className="empire-difficulty-header">
              <span className="empire-difficulty-label">미션 난이도</span>
              <span className="empire-difficulty-value">Medium</span>
            </div>
            <div className="empire-difficulty-bar">
              <div className="empire-difficulty-fill"></div>
              <div className="empire-difficulty-fill"></div>
              <div className="empire-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="empire-footer">
        <button 
          className="empire-start-button"
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


