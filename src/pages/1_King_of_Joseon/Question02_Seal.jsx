import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import sealImage from '../../image/태조추상시호금보.jpeg'
import './Question02_Seal.css'
import './1_Start.css'

function Question02_Seal({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [sealAnswer, setSealAnswer] = useState('')
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
    const result = await getActivityData(user.uid, 'seal')
    if (result.success && result.data) {
      setSealAnswer(result.data.sealAnswer || '')
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
    
    if (!sealAnswer.trim()) {
      setError('답을 입력해주세요.')
      return
    }

    const answerCheck = checkAnswer('seal', 'sealAnswer', sealAnswer)
    if (!answerCheck.correct) {
      setError('다시 생각해보세요.')
      return
    }

    const result = await saveActivityData(user.uid, 'seal', {
      sealAnswer
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('seal')
        navigate(nextPath)
      }, 1000)
    }
  }

  return (
    <div className="joseon-royal-court-start-container">
      {/* Header */}
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

      {/* Main Content */}
      <main className="joseon-royal-court-content" style={{ paddingBottom: '180px' }}>
        {/* Problem Card */}
        <article className="activity-seal-problem-card" style={{ padding: '0 1rem', marginTop: '1rem' }}>
          {/* Image */}
          <div className="activity-seal-image-wrapper">
            <div 
              className="activity-seal-image"
              style={{ backgroundImage: `url(${sealImage})` }}
            >
              <div className="activity-seal-image-overlay"></div>
              <div className="activity-seal-badge">
                <span>문제 02</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="activity-seal-content">
            <h2 className="activity-seal-problem-title">어보</h2>
            <div className="activity-seal-divider"></div>
            <p className="activity-seal-description">
              어보는 조선왕실의 <span className="activity-seal-answer-box">{sealAnswer || ''}</span>를 위해 제작된 인장입니다.
            </p>
          </div>
        </article>

        {error && (
          <div className="activity-seal-error">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Area */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
        <ActivityFooter
        answerValue={sealAnswer}
        onAnswerChange={(value) => {
          setSealAnswer(value)
          setError('')
        }}
        onSubmit={handleSave}
        saved={saved}
        answerPlaceholder="답을 입력하세요"
        answerId="sealAnswer"
        />
      </div>
    </div>
  )
}

export default Question02_Seal
