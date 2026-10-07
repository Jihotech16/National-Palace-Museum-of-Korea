import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthChange } from './firebase/auth'
import MainPage from './pages/MainPage'
import PalaceLandingPage from './pages/PalaceLandingPage'
import SeoulHistoryMuseum from './pages/SeoulHistoryMuseum'
import SeoulHistoryMuseumHallList from './pages/SeoulHistoryMuseumHallList'
import SeoulJoseonStart from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/1_Start'
import SeoulEmpireStart from './pages/SeoulHistoryMuseum/2_Seoul_Empire/1_Start'
import SeoulColonialStart from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/1_Start'
import SeoulGrowthStart from './pages/SeoulHistoryMuseum/4_Seoul_Growth/1_Start'
import UserGuide from './pages/UserGuide'
import Login from './pages/Login'
import TeacherLogin from './pages/teacher/TeacherLogin'
import TeacherPage from './pages/teacher/TeacherPage'
import TeacherClass from './pages/teacher/TeacherClass'
import TeacherDetail from './pages/teacher/TeacherDetail'
import TeacherMessage from './pages/teacher/TeacherMessage'
import TeacherMessageDetail from './pages/teacher/TeacherMessageDetail'
import TeacherEditMessage from './pages/teacher/TeacherEditMessage'
import TeacherQuestionManagement from './pages/teacher/TeacherQuestionManagement'
import JoseonRoyalCourtStart from './pages/1_King_of_Joseon/1_Start'
import RoyalLifeStart from './pages/2_Royal_Life/1_Start'
import EmpireStart from './pages/3_Empire_of_Korea/1_Start'
import PalacePaintingStart from './pages/4_Palace_Painting/1_Start'
import RoyalRitualStart from './pages/5_Royal_Ritual/1_Start'
import ScienceCultureStart from './pages/6_Science_Culture/1_Start'
import ActivityPortraitKing from './pages/activities/ActivityPortraitKing'
import ActivityAnimal from './pages/activities/ActivityAnimal'
import ActivityPortrait from './pages/activities/ActivityPortrait'
import ActivityScience from './pages/activities/ActivityScience'
import ActivityDraw from './pages/activities/ActivityDraw'
import ChoiceMuseum from './pages/ChoiceMuseum'
import ExhibitionHallList from './pages/ExhibitionHallList'
import StudentClear from './pages/StudentClear'
import StudentMessage from './pages/StudentMessage'
import StudentMessageDetail from './pages/StudentMessageDetail'
import Adminpage from './pages/Adminpage'
import { getFirstIncompleteActivity, ACTIVITY_PATHS } from './utils/activityOrder'
import QuestionPage from './components/QuestionPage'
import { QUESTION_DATA } from './data/questions'
import { getAllActivityStatus } from './firebase/firestore'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [redirectPath, setRedirectPath] = useState('/choice-museum')

  useEffect(() => {
    try {
      const unsubscribe = onAuthChange(async (user) => {
        setUser(user)
        if (user) {
          // 로그인 시 박물관 선택 페이지로 리다이렉트
          setRedirectPath('/choice-museum')
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
          path="/teacher-login" 
          element={<TeacherLogin />} 
        />
        <Route 
          path="/teacher" 
          element={<TeacherPage />} 
        />
        <Route 
          path="/teacher/class" 
          element={<TeacherClass />} 
        />
        <Route 
          path="/teacher/students" 
          element={<TeacherDetail />} 
        />
        <Route 
          path="/teacher/messages" 
          element={<TeacherMessage />} 
        />
        <Route 
          path="/teacher/messages/:messageId" 
          element={<TeacherMessageDetail />}
        />
        <Route 
          path="/teacher/messages/compose" 
          element={<TeacherEditMessage />}
        />
        <Route 
          path="/teacher/questions" 
          element={<TeacherQuestionManagement />}
        />
        <Route 
          path="/admin" 
          element={<Adminpage />} 
        />
        <Route 
          path="/" 
          element={<MainPage />} 
        />
        <Route 
          path="/userguide" 
          element={<UserGuide />} 
        />
        {/* 문제 화면: questions.js의 각 문제를 ACTIVITY_PATHS 경로에 연결 */}
        {Object.values(QUESTION_DATA).map((questionData) => (
          <Route
            key={questionData.activityId}
            path={ACTIVITY_PATHS[questionData.activityId]}
            element={user ? <QuestionPage key={questionData.activityId} user={user} questionData={questionData} /> : <Navigate to="/login" replace />}
          />
        ))}
        <Route 
          path="/1_King_of_Joseon/1_Start" 
          element={user ? <JoseonRoyalCourtStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/1_Start" 
          element={user ? <RoyalLifeStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/1_Start" 
          element={user ? <EmpireStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/1_Start" 
          element={user ? <PalacePaintingStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/1_Start" 
          element={user ? <RoyalRitualStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/1_Start" 
          element={user ? <ScienceCultureStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/activity/portrait-king" 
          element={user ? <ActivityPortraitKing user={user} /> : <Navigate to="/login" replace />} 
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
          path="/choice-museum" 
          element={user ? <ChoiceMuseum user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/landing" 
          element={user ? <PalaceLandingPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/seoul-history-museum" 
          element={user ? <SeoulHistoryMuseum /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/seoul-history-museum-hall-list" 
          element={user ? <SeoulHistoryMuseumHallList user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_Seoul_Joseon/1_Start" 
          element={user ? <SeoulJoseonStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/1_Start" 
          element={user ? <SeoulEmpireStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/1_Start" 
          element={user ? <SeoulColonialStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/1_Start" 
          element={user ? <SeoulGrowthStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/exhibition-hall-list" 
          element={user ? <ExhibitionHallList user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/student-clear" 
          element={user ? <StudentClear user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/student/messages" 
          element={user ? <StudentMessage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/student/messages/:messageId" 
          element={user ? <StudentMessageDetail user={user} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  )
}

export default App

