import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import guideHeroImage from '../image/NationalPalaceMuseum/국립고궁박물관.jpg'
import './UserGuide.css'

function UserGuide() {
  const navigate = useNavigate()

  useEffect(() => {
    // 라이트(한지) 테마 사용
    document.documentElement.classList.remove('dark')
    return () => {
      // 컴포넌트 언마운트 시 dark 클래스 제거 (선택사항)
      // document.documentElement.classList.remove('dark')
    }
  }, [])

  const handleBack = () => {
    navigate(-1)
  }

  const handleClose = () => {
    navigate('/')
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('jihotech16@outlook.kr')
    alert('이메일이 복사되었습니다.')
  }

  const handleStart = () => {
    navigate('/login')
  }

  return (
    <div className="guide-container">
      {/* TopAppBar */}
      <header className="guide-app-bar">
        <button className="guide-app-bar-btn" onClick={handleBack} aria-label="뒤로 가기">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="guide-app-bar-title">이용안내</h2>
        <button className="guide-app-bar-btn" onClick={handleClose} aria-label="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      {/* Main Content Scroll Area */}
      <main className="guide-main">
        {/* Hero */}
        <div className="guide-hero">
          <img className="guide-hero-image" src={guideHeroImage} alt="" />
          <div className="guide-hero-scrim" />
          <div className="guide-hero-text">
            <p className="guide-hero-label">National Palace Museum</p>
            <h1 className="guide-hero-title">박물관 탐험 가이드</h1>
          </div>
        </div>

        {/* ActionPanel: Critical School Notice */}
        <div className="guide-notice">
          <div className="guide-notice-head">
            <div className="guide-notice-icon">
              <span className="material-symbols-outlined">warning</span>
            </div>
            <div className="guide-notice-body">
              <p className="guide-notice-title">학교 단체 관람 필수 공지</p>
              <p className="guide-notice-text">
                학교에서 사용을 시작하기 전에 원활한 진행을 위해 반드시 아래 메일로 사전 문의해 주세요.
              </p>
            </div>
          </div>
          <div className="guide-email-row">
            <span className="guide-email-text">jihotech16@outlook.kr</span>
            <button className="guide-copy-btn" onClick={handleCopyEmail}>
              <span className="material-symbols-outlined">content_copy</span>
              <span>복사</span>
            </button>
          </div>
        </div>

        {/* HeadlineText: Exploration Method */}
        <div className="guide-section-head">
          <h2 className="guide-section-title">탐험 방법</h2>
          <p className="guide-section-desc">박물관 곳곳에 숨겨진 단서를 찾아 미션을 완료하세요.</p>
        </div>

        {/* Timeline: Steps */}
        <div className="guide-timeline">
          {/* Vertical Line */}
          <div className="guide-timeline-line" />

          {/* Step 1 */}
          <div className="guide-step">
            <div className="guide-step-marker">
              <span className="material-symbols-outlined">museum</span>
            </div>
            <div className="guide-step-card">
              <span className="guide-step-chip">Step 1</span>
              <p className="guide-step-title">박물관 탐험</p>
              <p className="guide-step-text">
                국립고궁박물관의 전시실을 돌아다니며 앱에서 지정한 유물을 찾아보세요.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="guide-step">
            <div className="guide-step-marker">
              <span className="material-symbols-outlined">search</span>
            </div>
            <div className="guide-step-card">
              <span className="guide-step-chip">Step 2</span>
              <p className="guide-step-title">단서 찾기</p>
              <p className="guide-step-text">
                유물 주변에 숨겨진 QR코드나 이미지 마커를 스캔하여 단서를 획득하세요.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="guide-step">
            <div className="guide-step-marker">
              <span className="material-symbols-outlined">extension</span>
            </div>
            <div className="guide-step-card">
              <span className="guide-step-chip">Step 3</span>
              <p className="guide-step-title">문제 해결</p>
              <p className="guide-step-text">
                획득한 단서를 조합하여 퀴즈를 풀고 다음 스테이지 잠금을 해제하세요.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Footer Button */}
      <div className="guide-bottom-bar">
        <div className="guide-bottom-bar-content">
          <button className="guide-start-btn" onClick={handleStart}>
            <span>탐험 시작하기</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserGuide
