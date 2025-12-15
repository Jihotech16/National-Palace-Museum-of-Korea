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
      // 첫 번째 활동지이거나 경로를 찾을 수 없으면 로그아웃
      handleLogout()
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="activity-layout">
      <header className="activity-header">
        <div className="header-buttons">
          {previousPath && (
            <button className="back-button" onClick={handleBack}>
              ← 뒤로
            </button>
          )}
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
        <h1>{title}</h1>
      </header>
      <main className="activity-content">
        {children}
      </main>
    </div>
  )
}

export default ActivityLayout

