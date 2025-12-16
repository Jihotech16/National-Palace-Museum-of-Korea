import { useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import './CoverLayout.css'

function CoverLayout({ children }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="cover-layout">
      <button className="cover-logout-button" onClick={handleLogout}>
        로그아웃
      </button>
      <main className="cover-content-wrapper">
        {children}
      </main>
    </div>
  )
}

export default CoverLayout

