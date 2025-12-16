import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { getAllActivityStatus } from '../firebase/firestore'
import './Home.css'

function Home({ user }) {
  const navigate = useNavigate()
  const [completedActivities, setCompletedActivities] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCompletedActivities()
  }, [])

  // 페이지 포커스 시 완료 상태 다시 로드
  useEffect(() => {
    const handleFocus = () => {
      loadCompletedActivities()
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const loadCompletedActivities = async () => {
    const result = await getAllActivityStatus(user.uid)
    if (result.success) {
      setCompletedActivities(result.status || {})
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const activities = [
    {
      id: 'mindmap',
      title: '마인드 맵',
      description: '국립고궁박물관을 생각하면 떠오르는 단어들을 나열해보세요',
      path: '/activity/mindmap',
      icon: '🧠',
      order: 1
    },
    {
      id: 'seal',
      title: '어보',
      description: '2층 조선의 국왕실 - 어보와 어보 상자 관찰',
      path: '/activity/seal',
      icon: '🪙',
      order: 2
    },
    {
      id: 'nature',
      title: '다섯 가지 자연물',
      description: '2층 조선의 국왕실 - 자연물 그림 찾기',
      path: '/activity/nature',
      icon: '🌿',
      order: 3
    },
    {
      id: 'animal',
      title: '동물 유물',
      description: '9가지 동물과 비슷한 모습의 유물 찾기',
      path: '/activity/animal',
      icon: '🐉',
      order: 4
    },
    {
      id: 'portrait',
      title: '어진 비교',
      description: '임금의 초상화 어진 비교하기',
      path: '/activity/portrait',
      icon: '👑',
      order: 5
    },
    {
      id: 'science',
      title: '과학문화실',
      description: 'B1층 과학문화실 유물 찾기',
      path: '/activity/science',
      icon: '🔬',
      order: 6
    },
    {
      id: 'draw',
      title: '유물 그리기',
      description: '친구들에게 소개하고 싶은 유물 그려보기',
      path: '/activity/draw',
      icon: '🎨',
      order: 7
    }
  ]

  // 다음 활동지 찾기
  const getNextActivity = () => {
    for (let i = 0; i < activities.length; i++) {
      if (!completedActivities[activities[i].id]) {
        return activities[i]
      }
    }
    return null // 모든 활동지 완료
  }

  const nextActivity = getNextActivity()

  const handleActivityClick = (activity) => {
    navigate(activity.path)
  }

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🏛️ 국립고궁박물관</h1>
        <p className="subtitle">전시 해설 활동지</p>
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <main className="activities-grid">
        {activities.map((activity) => {
          const isCompleted = completedActivities[activity.id] === true
          const isNext = nextActivity && nextActivity.id === activity.id
          
          return (
            <div
              key={activity.id}
              className={`activity-card ${isCompleted ? 'completed' : ''} ${isNext ? 'next-activity' : ''}`}
              onClick={() => handleActivityClick(activity)}
            >
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-number">{activity.order}</div>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              {isCompleted && <div className="completed-badge">✓ 완료</div>}
              {isNext && <div className="next-badge">다음 활동지</div>}
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default Home

