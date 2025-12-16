import { useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { getPreviousActivityPath, getActivityIdFromPath } from '../utils/activityOrder'
import './ActivityLayout.css'

function ActivityLayout({ title, children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      // 첫 번째 활동지이거나 경로를 찾을 수 없으면 홈으로
      navigate('/')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="activity-layout">
      <header className="activity-header">
        {previousPath ? (
          <button className="back-button" onClick={handleBack}>
            ← 뒤로
          </button>
        ) : (
          <div style={{ width: '80px' }}></div>
        )}
        <h1>{title}</h1>
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </header>
      <main className="activity-content">
        {children}
      </main>
    </div>
  )
}

export default ActivityLayout

