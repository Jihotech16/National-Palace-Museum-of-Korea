import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import sejongImage from '../../image/세종.jpg'
import '../activities/ActivityCommon.css'
import './1_Start.css'

function Question01_King({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
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
      // 1_Start에서 온 경우 다시 1_Start로 돌아가기
      navigate('/1_King_of_Joseon/1_Start')
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
      setError('다시 생각해보세요.')
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

  return (
    <div className="joseon-royal-court-start-container">
      <header className="joseon-royal-court-header">
        <button 
          className="joseon-royal-court-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="joseon-royal-court-header-title">조선국왕</h2>
        <button className="joseon-royal-court-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="joseon-royal-court-content" style={{ paddingBottom: '180px' }}>
        <article className="activity-problem-card" style={{ padding: '0 1rem', marginTop: '1rem' }}>
          <div className="activity-image-wrapper">
            <div 
              className="activity-image"
              style={{ backgroundImage: `url(${sejongImage})` }}
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

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
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
    </div>
  )
}

export default Question01_King
