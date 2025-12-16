import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import CoverLayout from '../../components/CoverLayout'
import ActivityFooter from '../../components/ActivityFooter'
import sealImage from '../../image/태조추상시호금보.jpeg'
import coverImage from '../../image/조선국왕표지.jpg'
import './ActivitySeal.css'

function ActivitySeal({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [showCover, setShowCover] = useState(true)
  const [sealAnswer, setSealAnswer] = useState('')
  const [sealAnimalAnswer, setSealAnimalAnswer] = useState('')
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
      setSealAnimalAnswer(result.data.sealAnimalAnswer || '')
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
    
    // 첫 번째 문제 정답 체크
    const answerCheck = checkAnswer('seal', 'sealAnswer', sealAnswer)
    if (!answerCheck.correct) {
      setError(answerCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }

    // 두 번째 문제 정답 체크
    if (!sealAnimalAnswer) {
      setError('동물 문제를 선택해주세요.')
      return
    }

    const animalCheck = checkAnswer('seal', 'sealAnimalAnswer', sealAnimalAnswer)
    if (!animalCheck.correct) {
      setError(animalCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }

    const result = await saveActivityData(user.uid, 'seal', {
      sealAnswer,
      sealAnimalAnswer
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('seal')
        navigate(nextPath)
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
    <div className="activity-seal-container dark">
      {/* Header */}
      <header className="activity-seal-header">
        <button 
          className="activity-seal-back-btn" 
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="activity-seal-title">조선국왕</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      {/* Main Content */}
      <main className="activity-seal-main">
        {/* Problem Card */}
        <article className="activity-seal-problem-card">
          {/* Image */}
          <div className="activity-seal-image-wrapper">
            <div 
              className="activity-seal-image"
              style={{ backgroundImage: `url(${sealImage})` }}
            >
              <div className="activity-seal-image-overlay"></div>
              <div className="activity-seal-badge">
                <span>문제 01</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="activity-seal-content">
            <h2 className="activity-seal-problem-title">조선의 국왕</h2>
            <div className="activity-seal-divider"></div>
            <p className="activity-seal-description">
              조선은 약 500년 동안 이어진 왕조로, 모두 17명의 국왕이 나라를 다스렸습니다. 이 가운데 조선의 4대 국왕은 <input 
                type="text" 
                value={sealAnswer}
                onChange={(e) => {
                  setSealAnswer(e.target.value)
                  setError('')
                }}
                placeholder="답을 입력하세요"
                className="activity-seal-inline-input"
              />입니다.
            </p>
          </div>
        </article>

        {/* Animal Selection Card */}
        <section className="activity-seal-animal-card">
          <div className="activity-seal-animal-content">
            <h3 className="activity-seal-animal-title">왕의 어보(도장)에는 어떤 동물이 새겨져 있을까?</h3>
            <div className="activity-seal-options-grid">
              {['용', '봉황', '거북', '호랑이'].map((option, index) => (
                <label 
                  key={index}
                  className={`activity-seal-option ${sealAnimalAnswer === option ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="sealAnimal"
                    value={option}
                    checked={sealAnimalAnswer === option}
                    onChange={(e) => {
                      setSealAnimalAnswer(e.target.value)
                      setError('')
                    }}
                    className="activity-seal-radio"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="activity-seal-error">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Area */}
      <ActivityFooter
        answerValue={sealAnimalAnswer}
        onAnswerChange={(value) => {
          setSealAnimalAnswer(value)
          setError('')
        }}
        onSubmit={handleSave}
        saved={saved}
        answerPlaceholder="동물의 이름을 입력하세요"
        answerId="sealAnimalAnswer"
      />
    </div>
  )
}

export default ActivitySeal

