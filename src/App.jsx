import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthChange } from './firebase/auth'
import Login from './pages/Login'
import ActivityMindMap from './pages/activities/ActivityMindMap'
import ActivityNature from './pages/activities/ActivityNature'
import ActivitySeal from './pages/activities/ActivitySeal'
import ActivityAnimal from './pages/activities/ActivityAnimal'
import ActivityPortrait from './pages/activities/ActivityPortrait'
import ActivityScience from './pages/activities/ActivityScience'
import ActivityDraw from './pages/activities/ActivityDraw'
import { getFirstIncompleteActivity } from './utils/activityOrder'
import { getAllActivityStatus } from './firebase/firestore'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redirectPath, setRedirectPath] = useState('/activity/mindmap')

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange(async (user) => {
        setUser(user)
        if (user) {
          // 로그인 시 다음 활동지로 리다이렉트 경로 설정
          const path = await getFirstIncompleteActivity(user.uid, getAllActivityStatus)
          setRedirectPath(path)
        }
        setLoading(false)
        setError(null)
      })

      return () => {
        if (unsubscribe) unsubscribe()
      }
    } catch (error) {
      console.error('인증 상태 확인 오류:', error)
      setError('Firebase 초기화 오류가 발생했습니다. 브라우저 콘솔을 확인해주세요.')
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>로딩 중...</p>
        {error && <p style={{ color: '#ffcccc', marginTop: '10px' }}>{error}</p>}
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="loading-container">
        <p style={{ color: '#ffcccc', marginBottom: '20px' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#8B4513',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          새로고침
        </button>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to={redirectPath} replace /> : <Login />} 
        />
        <Route 
          path="/" 
          element={user ? <Navigate to={redirectPath} replace /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/mindmap" 
          element={user ? <ActivityMindMap user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/nature" 
          element={user ? <ActivityNature user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/seal" 
          element={user ? <ActivitySeal user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/animal" 
          element={user ? <ActivityAnimal user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/portrait" 
          element={user ? <ActivityPortrait user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/science" 
          element={user ? <ActivityScience user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/draw" 
          element={user ? <ActivityDraw user={user} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App

