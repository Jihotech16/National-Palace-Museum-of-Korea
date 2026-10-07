import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../firebase/auth'
import './StudentLayout.css'

function StudentLayout({ title, children, showBackButton = true, backPath = null, showMessageButton = true, activeNav = 'museum', museumType = null, onBack = null }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPath) {
      navigate(backPath)
    } else {
      navigate(-1)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleNavClick = (path) => {
    // 전시관 목록으로 이동할 때는 현재 경로에 따라 적절한 경로로 이동
    if (path === '/exhibition-hall-list') {
      // museumType prop이 있으면 그것을 우선 사용 (수료증 페이지에서 전달)
      if (museumType === 'seoul') {
        navigate('/seoul-history-museum-hall-list')
      } else if (museumType === 'palace') {
        navigate('/exhibition-hall-list')
      } else if (location.pathname.includes('seoul') || location.pathname.includes('Seoul')) {
        navigate('/seoul-history-museum-hall-list')
      } else {
        navigate('/exhibition-hall-list')
      }
    } else {
      navigate(path)
    }
  }

  return (
    <div className="student-layout-container">
      {/* 헤더 */}
      <div className="student-layout-header">
        {showBackButton ? (
          <button 
            className="student-layout-back-button"
            onClick={handleBack}
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
        ) : (
          <div style={{ width: '48px' }}></div>
        )}
        <h2 className="student-layout-title">{title || '전시관 탐험'}</h2>
        {showMessageButton ? (
          <button 
            className="student-layout-message-button" 
            style={{ position: 'relative' }}
            onClick={() => navigate('/student/messages')}
          >
            <span className="material-symbols-outlined">mail</span>
            <span style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '10px',
              height: '10px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              border: '2px solid white'
            }}></span>
          </button>
        ) : (
          <div style={{ width: '48px' }}></div>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="student-layout-content">
        {children}
      </div>

      {/* 하단 네비게이션 바 */}
      <div className={`student-layout-navbar ${museumType === 'seoul' ? 'student-layout-navbar-seoul' : ''}`}>
        <button 
          className={`student-layout-nav-item ${activeNav === 'museum' ? 'active' : ''}`}
          onClick={() => handleNavClick('/exhibition-hall-list')}
        >
          <span className="material-symbols-outlined">museum</span>
          <span>전시관</span>
        </button>
        <button 
          className={`student-layout-nav-item ${activeNav === 'certificate' ? 'active' : ''}`}
          onClick={() => handleNavClick('/student-clear')}
        >
          <span className="material-symbols-outlined">verified</span>
          <span>수료증 확인</span>
        </button>
        <button 
          className={`student-layout-nav-item ${activeNav === 'logout' ? 'active' : ''}`}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>로그아웃</span>
        </button>
      </div>
    </div>
  )
}

export default StudentLayout


