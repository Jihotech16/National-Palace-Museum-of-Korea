import { useNavigate } from 'react-router-dom'
import './1_Start.css'
import seoulJoseonImage from '../../image/SeoulHistoryMuseum/서울역사박물관.jpeg'

function Start() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/seoul-history-museum-hall-list')
  }

  const handleStartExploration = () => {
    // 탐험 시작 버튼 클릭 시 첫 번째 문제로 이동
    navigate('/SeoulHistoryMuseum/1_Seoul_Joseon/Question01', { state: { skipCover: true } })
  }

  return (
    <div className="seoul-joseon-start-container">
      {/* 헤더 */}
      <div className="seoul-joseon-header">
        <button 
          className="seoul-joseon-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="seoul-joseon-header-title">전시관 안내</h2>
        <button 
          className="seoul-joseon-search-button"
          onClick={() => navigate('/student/messages')}
        >
          <span className="material-symbols-outlined">mail</span>
        </button>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="seoul-joseon-content">
        {/* 이미지 섹션 */}
        <div className="seoul-joseon-image-section">
          <div 
            className="seoul-joseon-image"
            style={{
              backgroundImage: `url(${seoulJoseonImage})`,
              backgroundPosition: 'center'
            }}
          >
            <div className="seoul-joseon-image-overlay"></div>
            
            {/* 위치 배지 */}
            <div className="seoul-joseon-location-badge">
              <span className="material-symbols-outlined">location_on</span>
              <span>Zone 1</span>
            </div>

            {/* 메시지 아이콘 */}
            <div className="seoul-joseon-search-icon">
              <span className="material-symbols-outlined">mail</span>
            </div>
          </div>
        </div>

        {/* 정보 섹션 */}
        <div className="seoul-joseon-info-section">
          {/* 태그 */}
          <div className="seoul-joseon-tags">
            <div className="seoul-joseon-tag primary">
              <span className="material-symbols-outlined">history_edu</span>
              <span>Zone 1</span>
            </div>
            <div className="seoul-joseon-tag secondary">
              <span>조선시대</span>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="seoul-joseon-title">
            조선시대의 서울,<br />
            <span className="seoul-joseon-title-gradient">1392-1863</span>
          </h1>

          {/* 구분선 */}
          <div className="seoul-joseon-divider"></div>

          {/* 설명 */}
          <div className="seoul-joseon-description">
            <p>
              조선시대의 서울은 한양으로 불리며 조선 왕조의 수도였습니다. 1392년부터 1863년까지 약 500년간 지속된 이 시대는 유교 문화가 꽃피고, 한글 창제와 같은 문화적 성취가 이루어진 시기입니다.
            </p>
            <p>
              이곳에서 <strong>경복궁</strong>과 <strong>한양도성</strong> 등 조선시대 서울의 모습을 탐험하고, 역사 속에 숨겨진 이야기를 찾아보세요.
            </p>
          </div>

          {/* 미션 난이도 */}
          <div className="seoul-joseon-difficulty">
            <div className="seoul-joseon-difficulty-header">
              <span className="seoul-joseon-difficulty-label">미션 난이도</span>
              <span className="seoul-joseon-difficulty-value">Medium</span>
            </div>
            <div className="seoul-joseon-difficulty-bar">
              <div className="seoul-joseon-difficulty-fill"></div>
              <div className="seoul-joseon-difficulty-fill"></div>
              <div className="seoul-joseon-difficulty-empty"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="seoul-joseon-footer">
        <button 
          className="seoul-joseon-start-button"
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

