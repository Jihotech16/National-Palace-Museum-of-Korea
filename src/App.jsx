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
import SeoulJoseonQuestion01 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question01'
import SeoulJoseonQuestion02 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question02'
import SeoulJoseonQuestion03 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question03'
import SeoulJoseonQuestion04 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question04'
import SeoulJoseonQuestion05 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question05'
import SeoulJoseonQuestion06 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question06'
import SeoulJoseonQuestion07 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question07'
import SeoulJoseonQuestion08 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question08'
import SeoulJoseonQuestion09 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question09'
import SeoulJoseonQuestion10 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question10'
import SeoulJoseonQuestion11 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question11'
import SeoulJoseonQuestion12 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question12'
import SeoulJoseonQuestion13 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question13'
import SeoulJoseonQuestion14 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question14'
import SeoulJoseonQuestion15 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question15'
import SeoulJoseonQuestion16 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question16'
import SeoulJoseonQuestion17 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question17'
import SeoulJoseonQuestion18 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question18'
import SeoulJoseonQuestion19 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question19'
import SeoulJoseonQuestion20 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question20'
import SeoulJoseonQuestion21 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question21'
import SeoulJoseonQuestion22 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question22'
import SeoulJoseonQuestion23 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question23'
import SeoulJoseonQuestion24 from './pages/SeoulHistoryMuseum/1_Seoul_Joseon/Question24'
import SeoulEmpireQuestion01 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question01'
import SeoulEmpireQuestion02 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question02'
import SeoulEmpireQuestion03 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question03'
import SeoulEmpireQuestion04 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question04'
import SeoulEmpireQuestion05 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question05'
import SeoulEmpireQuestion06 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question06'
import SeoulEmpireQuestion07 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question07'
import SeoulEmpireQuestion08 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question08'
import SeoulEmpireQuestion09 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question09'
import SeoulEmpireQuestion10 from './pages/SeoulHistoryMuseum/2_Seoul_Empire/Question10'
import SeoulColonialQuestion01 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question01'
import SeoulColonialQuestion02 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question02'
import SeoulColonialQuestion03 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question03'
import SeoulColonialQuestion04 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question04'
import SeoulColonialQuestion05 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question05'
import SeoulColonialQuestion06 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question06'
import SeoulColonialQuestion07 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question07'
import SeoulColonialQuestion08 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question08'
import SeoulColonialQuestion09 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question09'
import SeoulColonialQuestion10 from './pages/SeoulHistoryMuseum/3_Seoul_Colonial/Question10'
import SeoulGrowthQuestion01 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question01'
import SeoulGrowthQuestion02 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question02'
import SeoulGrowthQuestion03 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question03'
import SeoulGrowthQuestion04 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question04'
import SeoulGrowthQuestion05 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question05'
import SeoulGrowthQuestion06 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question06'
import SeoulGrowthQuestion07 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question07'
import SeoulGrowthQuestion08 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question08'
import SeoulGrowthQuestion09 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question09'
import SeoulGrowthQuestion10 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question10'
import SeoulGrowthQuestion11 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question11'
import SeoulGrowthQuestion12 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question12'
import SeoulGrowthQuestion13 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question13'
import SeoulGrowthQuestion14 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question14'
import SeoulGrowthQuestion15 from './pages/SeoulHistoryMuseum/4_Seoul_Growth/Question15'
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
import Question01_King from './pages/1_King_of_Joseon/Question01_King'
import Question02_Seal from './pages/1_King_of_Joseon/Question02_Seal'
import Question03_Ceiling from './pages/1_King_of_Joseon/Question03_Ceiling'
import Question04_Clothing from './pages/1_King_of_Joseon/Question04_Clothing'
import Question05_Nature from './pages/1_King_of_Joseon/Question05_Nature'
import Question06_Education from './pages/1_King_of_Joseon/Question06_Education'
import Question07_Seal from './pages/1_King_of_Joseon/Question07_Seal'
import Question08_Record from './pages/1_King_of_Joseon/Question08_Record'
import Question09_Politics from './pages/1_King_of_Joseon/Question09_Politics'
import Question10_Exam from './pages/1_King_of_Joseon/Question10_Exam'
import Question11_Age from './pages/1_King_of_Joseon/Question11_Age'
import Question12_Dragon from './pages/1_King_of_Joseon/Question12_Dragon'
import RoyalLifeStart from './pages/2_Royal_Life/1_Start'
import Question01_Queen from './pages/2_Royal_Life/Question01_Queen'
import Question02_QueenVirtue from './pages/2_Royal_Life/Question02_QueenVirtue'
import Question03_QueenPolitics from './pages/2_Royal_Life/Question03_QueenPolitics'
import Question04_QueenSymbol2 from './pages/2_Royal_Life/Question04_QueenSymbol2'
import Question05_QueenHairpin from './pages/2_Royal_Life/Question05_QueenHairpin'
import Question06_QueenBirth from './pages/2_Royal_Life/Question06_QueenBirth'
import Question07_QueenPrincess from './pages/2_Royal_Life/Question07_QueenPrincess'
import Question08_QueenClothing from './pages/2_Royal_Life/Question08_QueenClothing'
import Question09_QueenChima from './pages/2_Royal_Life/Question09_QueenChima'
import Question10_QueenJewelry from './pages/2_Royal_Life/Question10_QueenJewelry'
import Question11_QueenEmbroidery from './pages/2_Royal_Life/Question11_QueenEmbroidery'
import Question12_QueenNorigae from './pages/2_Royal_Life/Question12_QueenNorigae'
import Question13_QueenFood from './pages/2_Royal_Life/Question13_QueenFood'
import EmpireStart from './pages/3_Empire_of_Korea/1_Start'
import Question01_Empire from './pages/3_Empire_of_Korea/Question01_Empire'
import Question02_Independence from './pages/3_Empire_of_Korea/Question02_Independence'
import Question03_Currency from './pages/3_Empire_of_Korea/Question03_Currency'
import Question04_Altar from './pages/3_Empire_of_Korea/Question04_Altar'
import Question05_Palace from './pages/3_Empire_of_Korea/Question05_Palace'
import Question06_Dondeokjeon from './pages/3_Empire_of_Korea/Question06_Dondeokjeon'
import Question07_PlumBlossom from './pages/3_Empire_of_Korea/Question07_PlumBlossom'
import PalacePaintingStart from './pages/4_Palace_Painting/1_Start'
import Question01_Hwajodo from './pages/4_Palace_Painting/Question01_Hwajodo'
import Question02_Peony from './pages/4_Palace_Painting/Question02_Peony'
import Question03_SealBook from './pages/4_Palace_Painting/Question03_SealBook'
import Question04_Inkstone from './pages/4_Palace_Painting/Question04_Inkstone'
import RoyalRitualStart from './pages/5_Royal_Ritual/1_Start'
import Question01_FiveRites from './pages/5_Royal_Ritual/Question01_FiveRites'
import Question02_Dongroe from './pages/5_Royal_Ritual/Question02_Dongroe'
import Question03_Daesarye from './pages/5_Royal_Ritual/Question03_Daesarye'
import Question04_Yeon from './pages/5_Royal_Ritual/Question04_Yeon'
import Question05_Jeongchukgi from './pages/5_Royal_Ritual/Question05_Jeongchukgi'
import Question06_Honjeondogam from './pages/5_Royal_Ritual/Question06_Honjeondogam'
import Question07_Jongmyo from './pages/5_Royal_Ritual/Question07_Jongmyo'
import ScienceCultureStart from './pages/6_Science_Culture/1_Start'
import Question01_Honcheoneui from './pages/6_Science_Culture/Question01_Honcheoneui'
import Question02_Calendar from './pages/6_Science_Culture/Question02_Calendar'
import Question03_Ilseongjeongsiui from './pages/6_Science_Culture/Question03_Ilseongjeongsiui'
import Question04_Soilyeong from './pages/6_Science_Culture/Question04_Soilyeong'
import Question05_Cheonsangyeolchabunyajido from './pages/6_Science_Culture/Question05_Cheonsangyeolchabunyajido'
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
import { getFirstIncompleteActivity } from './utils/activityOrder'
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
          path="/1_King_of_Joseon/Question03_Ceiling" 
          element={user ? <Question03_Ceiling user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question04_Clothing" 
          element={user ? <Question04_Clothing user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question05_Nature" 
          element={user ? <Question05_Nature user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question06_Education" 
          element={user ? <Question06_Education user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question07_Seal" 
          element={user ? <Question07_Seal user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question08_Record" 
          element={user ? <Question08_Record user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question09_Politics" 
          element={user ? <Question09_Politics user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question10_Exam" 
          element={user ? <Question10_Exam user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question11_Age" 
          element={user ? <Question11_Age user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/1_King_of_Joseon/Question12_Dragon" 
          element={user ? <Question12_Dragon user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/1_Start" 
          element={user ? <RoyalLifeStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question01_Queen" 
          element={user ? <Question01_Queen user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question02_QueenVirtue" 
          element={user ? <Question02_QueenVirtue user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question03_QueenPolitics" 
          element={user ? <Question03_QueenPolitics user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question04_QueenSymbol2" 
          element={user ? <Question04_QueenSymbol2 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question05_QueenHairpin" 
          element={user ? <Question05_QueenHairpin user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question06_QueenBirth" 
          element={user ? <Question06_QueenBirth user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question07_QueenPrincess" 
          element={user ? <Question07_QueenPrincess user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question08_QueenClothing" 
          element={user ? <Question08_QueenClothing user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question09_QueenChima" 
          element={user ? <Question09_QueenChima user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question10_QueenJewelry" 
          element={user ? <Question10_QueenJewelry user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question11_QueenEmbroidery" 
          element={user ? <Question11_QueenEmbroidery user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question12_QueenNorigae" 
          element={user ? <Question12_QueenNorigae user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Royal_Life/Question13_QueenFood" 
          element={user ? <Question13_QueenFood user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/1_Start" 
          element={user ? <EmpireStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question01_Empire" 
          element={user ? <Question01_Empire user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question02_Independence" 
          element={user ? <Question02_Independence user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question03_Currency" 
          element={user ? <Question03_Currency user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question04_Altar" 
          element={user ? <Question04_Altar user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question05_Palace" 
          element={user ? <Question05_Palace user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question06_Dondeokjeon" 
          element={user ? <Question06_Dondeokjeon user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Empire_of_Korea/Question07_PlumBlossom" 
          element={user ? <Question07_PlumBlossom user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/1_Start" 
          element={user ? <PalacePaintingStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/Question01_Hwajodo" 
          element={user ? <Question01_Hwajodo user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/Question02_Peony" 
          element={user ? <Question02_Peony user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/Question03_SealBook" 
          element={user ? <Question03_SealBook user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Palace_Painting/Question04_Inkstone" 
          element={user ? <Question04_Inkstone user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/1_Start" 
          element={user ? <RoyalRitualStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question01_FiveRites" 
          element={user ? <Question01_FiveRites user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question02_Dongroe" 
          element={user ? <Question02_Dongroe user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question03_Daesarye" 
          element={user ? <Question03_Daesarye user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question04_Yeon" 
          element={user ? <Question04_Yeon user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question05_Jeongchukgi" 
          element={user ? <Question05_Jeongchukgi user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question06_Honjeondogam" 
          element={user ? <Question06_Honjeondogam user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/5_Royal_Ritual/Question07_Jongmyo" 
          element={user ? <Question07_Jongmyo user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/1_Start" 
          element={user ? <ScienceCultureStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/Question01_Honcheoneui" 
          element={user ? <Question01_Honcheoneui user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/Question02_Calendar" 
          element={user ? <Question02_Calendar user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/Question03_Ilseongjeongsiui" 
          element={user ? <Question03_Ilseongjeongsiui user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/Question04_Soilyeong" 
          element={user ? <Question04_Soilyeong user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/6_Science_Culture/Question05_Cheonsangyeolchabunyajido" 
          element={user ? <Question05_Cheonsangyeolchabunyajido user={user} /> : <Navigate to="/login" replace />} 
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
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question01" 
          element={user ? <SeoulJoseonQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question02" 
          element={user ? <SeoulJoseonQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question03" 
          element={user ? <SeoulJoseonQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question04" 
          element={user ? <SeoulJoseonQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question05" 
          element={user ? <SeoulJoseonQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question06" 
          element={user ? <SeoulJoseonQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question07" 
          element={user ? <SeoulJoseonQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question08" 
          element={user ? <SeoulJoseonQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question09" 
          element={user ? <SeoulJoseonQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question10" 
          element={user ? <SeoulJoseonQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question11" 
          element={user ? <SeoulJoseonQuestion11 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question12" 
          element={user ? <SeoulJoseonQuestion12 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question13" 
          element={user ? <SeoulJoseonQuestion13 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question14" 
          element={user ? <SeoulJoseonQuestion14 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question15" 
          element={user ? <SeoulJoseonQuestion15 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question16" 
          element={user ? <SeoulJoseonQuestion16 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question17" 
          element={user ? <SeoulJoseonQuestion17 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question18" 
          element={user ? <SeoulJoseonQuestion18 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question19" 
          element={user ? <SeoulJoseonQuestion19 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question20" 
          element={user ? <SeoulJoseonQuestion20 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question21" 
          element={user ? <SeoulJoseonQuestion21 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question22" 
          element={user ? <SeoulJoseonQuestion22 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question23" 
          element={user ? <SeoulJoseonQuestion23 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/1_Seoul_Joseon/Question24" 
          element={user ? <SeoulJoseonQuestion24 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/1_Start" 
          element={user ? <SeoulEmpireStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question01" 
          element={user ? <SeoulEmpireQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question02" 
          element={user ? <SeoulEmpireQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question03" 
          element={user ? <SeoulEmpireQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question04" 
          element={user ? <SeoulEmpireQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question05" 
          element={user ? <SeoulEmpireQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question06" 
          element={user ? <SeoulEmpireQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question07" 
          element={user ? <SeoulEmpireQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question08" 
          element={user ? <SeoulEmpireQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question09" 
          element={user ? <SeoulEmpireQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/2_Seoul_Empire/Question10" 
          element={user ? <SeoulEmpireQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question01" 
          element={user ? <SeoulEmpireQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question02" 
          element={user ? <SeoulEmpireQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question03" 
          element={user ? <SeoulEmpireQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question04" 
          element={user ? <SeoulEmpireQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question05" 
          element={user ? <SeoulEmpireQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question06" 
          element={user ? <SeoulEmpireQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question07" 
          element={user ? <SeoulEmpireQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question08" 
          element={user ? <SeoulEmpireQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question09" 
          element={user ? <SeoulEmpireQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/2_Seoul_Empire/Question10" 
          element={user ? <SeoulEmpireQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/1_Start" 
          element={user ? <SeoulColonialStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question01" 
          element={user ? <SeoulColonialQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question02" 
          element={user ? <SeoulColonialQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question03" 
          element={user ? <SeoulColonialQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question04" 
          element={user ? <SeoulColonialQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question05" 
          element={user ? <SeoulColonialQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question06" 
          element={user ? <SeoulColonialQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question07" 
          element={user ? <SeoulColonialQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question08" 
          element={user ? <SeoulColonialQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question09" 
          element={user ? <SeoulColonialQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/3_Seoul_Colonial/Question10" 
          element={user ? <SeoulColonialQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question01" 
          element={user ? <SeoulColonialQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question02" 
          element={user ? <SeoulColonialQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question03" 
          element={user ? <SeoulColonialQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question04" 
          element={user ? <SeoulColonialQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question05" 
          element={user ? <SeoulColonialQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question06" 
          element={user ? <SeoulColonialQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question07" 
          element={user ? <SeoulColonialQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question08" 
          element={user ? <SeoulColonialQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question09" 
          element={user ? <SeoulColonialQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/3_Seoul_Colonial/Question10" 
          element={user ? <SeoulColonialQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/1_Start" 
          element={user ? <SeoulGrowthStart /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question01" 
          element={user ? <SeoulGrowthQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question02" 
          element={user ? <SeoulGrowthQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question03" 
          element={user ? <SeoulGrowthQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question04" 
          element={user ? <SeoulGrowthQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question05" 
          element={user ? <SeoulGrowthQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question06" 
          element={user ? <SeoulGrowthQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question07" 
          element={user ? <SeoulGrowthQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question08" 
          element={user ? <SeoulGrowthQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question09" 
          element={user ? <SeoulGrowthQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question10" 
          element={user ? <SeoulGrowthQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question11" 
          element={user ? <SeoulGrowthQuestion11 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question12" 
          element={user ? <SeoulGrowthQuestion12 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question13" 
          element={user ? <SeoulGrowthQuestion13 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question14" 
          element={user ? <SeoulGrowthQuestion14 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/4_Seoul_Growth/Question15" 
          element={user ? <SeoulGrowthQuestion15 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question01" 
          element={user ? <SeoulGrowthQuestion01 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question02" 
          element={user ? <SeoulGrowthQuestion02 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question03" 
          element={user ? <SeoulGrowthQuestion03 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question04" 
          element={user ? <SeoulGrowthQuestion04 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question05" 
          element={user ? <SeoulGrowthQuestion05 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question06" 
          element={user ? <SeoulGrowthQuestion06 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question07" 
          element={user ? <SeoulGrowthQuestion07 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question08" 
          element={user ? <SeoulGrowthQuestion08 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question09" 
          element={user ? <SeoulGrowthQuestion09 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question10" 
          element={user ? <SeoulGrowthQuestion10 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question11" 
          element={user ? <SeoulGrowthQuestion11 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question12" 
          element={user ? <SeoulGrowthQuestion12 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question13" 
          element={user ? <SeoulGrowthQuestion13 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question14" 
          element={user ? <SeoulGrowthQuestion14 user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/SeoulHistoryMuseum/4_Seoul_Growth/Question15" 
          element={user ? <SeoulGrowthQuestion15 user={user} /> : <Navigate to="/login" replace />} 
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

