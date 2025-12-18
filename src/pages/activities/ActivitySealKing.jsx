import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import coverImage from '../../image/조선국왕표지.jpg'
import CoverLayout from '../../components/CoverLayout'
import './ActivityCommon.css'

function ActivitySealKing({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showCover, setShowCover] = useState(true)
  const [kingAnswer, setKingAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'sealKing')
    if (result.success && result.data) {
      setKingAnswer(result.data.kingAnswer || '')
    }
  }

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      navigate('/')
    }
  }

  const handleSave = async () => {
    setError('')
    
    if (!kingAnswer.trim()) {
      setError('답을 입력해주세요.')
      return
    }

    const answerCheck = checkAnswer('sealKing', 'kingAnswer', kingAnswer)
    if (!answerCheck.correct) {
      setError(answerCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }

    const result = await saveActivityData(user.uid, 'sealKing', {
      kingAnswer
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('sealKing')
        if (nextPath) {
          navigate(nextPath)
        } else {
          navigate('/exhibition-hall-list')
        }
      }, 1000)
    }
  }

  if (showCover) {
    return (
      <CoverLayout>
        <div className="cover-page">
          <img 
            src={coverImage} 
            alt="조선국왕 표지" 
            className="cover-image"
          />
          <button 
            onClick={() => setShowCover(false)} 
            className="cover-start-button"
          >
            시작하기
          </button>
        </div>
      </CoverLayout>
    )
  }

  return (
    <div className="activity-container dark">
      <header className="activity-header">
        <button className="activity-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="activity-title">조선국왕</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <main className="activity-main">
        <article className="activity-problem-card">
          <div className="activity-image-wrapper">
            <div 
              className="activity-image"
              style={{ backgroundImage: `url(${coverImage})` }}
            >
              <div className="activity-image-overlay"></div>
              <div className="activity-badge">
                <span>문제 01</span>
              </div>
            </div>
          </div>

          <div className="activity-content">
            <h2 className="activity-problem-title">조선의 국왕</h2>
            <div className="activity-divider"></div>
            <p className="activity-description">
              조선은 약 500년 동안 이어진 왕조로, 모두 17명의 국왕이 나라를 다스렸습니다. 이 가운데 조선의 4대 국왕은 누구일까요?
            </p>
          </div>
        </article>

        {error && (
          <div className="activity-error">
            {error}
          </div>
        )}
      </main>

      <ActivityFooter
        answerValue={kingAnswer}
        onAnswerChange={(value) => {
          setKingAnswer(value)
          setError('')
        }}
        onSubmit={handleSave}
        saved={saved}
        answerPlaceholder="국왕의 이름을 입력하세요"
        answerId="kingAnswer"
      />
    </div>
  )
}

export default ActivitySealKing

