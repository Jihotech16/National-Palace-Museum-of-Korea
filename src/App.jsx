import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthChange } from './firebase/auth'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import JoseonRoyalCourtStart from './pages/1_King_of_Joseon/1_Start'
import Question01_King from './pages/1_King_of_Joseon/Question01_King'
import Question02_Seal from './pages/1_King_of_Joseon/Question02_Seal'
import Question03_Nature from './pages/1_King_of_Joseon/Question03_Nature'
import ActivitySeal from './pages/activities/ActivitySeal'
import ActivityCeiling from './pages/activities/ActivityCeiling'
import ActivityClothing from './pages/activities/ActivityClothing'
import ActivityPortraitKing from './pages/activities/ActivityPortraitKing'
import ActivityEducation from './pages/activities/ActivityEducation'
import ActivityAnimal from './pages/activities/ActivityAnimal'
import ActivityPortrait from './pages/activities/ActivityPortrait'
import ActivityScience from './pages/activities/ActivityScience'
import ActivityDraw from './pages/activities/ActivityDraw'
import ExhibitionHallList from './pages/ExhibitionHallList'
import { getFirstIncompleteActivity } from './utils/activityOrder'
import { getAllActivityStatus } from './firebase/firestore'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redirectPath, setRedirectPath] = useState('/exhibition-hall-list')

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange(async (user) => {
        setUser(user)
        if (user) {
          // 로그인 시 전시관 목록으로 리다이렉트
          setRedirectPath('/exhibition-hall-list')
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
          element={user ? <Navigate to={redirectPath} replace /> : <LandingPage />} 
        />
        <Route 
          path="/1_King_of_Joseon/1_Start" 
          element={user ? <JoseonRoyalCourtStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question01_King" 
          element={user ? <Question01_King user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question02_Seal" 
          element={user ? <Question02_Seal user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question03_Nature" 
          element={user ? <Question03_Nature user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/ceiling" 
          element={user ? <ActivityCeiling user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/clothing" 
          element={user ? <ActivityClothing user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/portrait-king" 
          element={user ? <ActivityPortraitKing user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/education" 
          element={user ? <ActivityEducation user={user} /> : <Navigate to="/login" replace />} 
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
        <Route 
          path="/exhibition-hall-list" 
          element={user ? <ExhibitionHallList /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App

