import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkMultipleAnswers } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import natureImage from '../../image/일월오봉도 병풍.jpg'
import './Question03_Nature.css'
import './1_Start.css'

function Question03_Nature({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [natures, setNatures] = useState(['', '', '', '', ''])
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
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
    const result = await getActivityData(user.uid, 'nature')
    if (result.success && result.data) {
      if (result.data.natures && Array.isArray(result.data.natures)) {
        setNatures(result.data.natures)
      }
    }
  }

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      navigate('/1_King_of_Joseon/1_Start')
    }
  }

  const handleNatureChange = (index, value) => {
    const newNatures = [...natures]
    newNatures[index] = value
    setNatures(newNatures)
    setError('')
  }

  const handleSave = async () => {
    setError('')
    
    const naturesCheck = checkMultipleAnswers('nature', 'natures', natures)
    if (!naturesCheck.correct) {
      setError(naturesCheck.message)
      return
    }
    
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'nature', {
        natures: natures
      })
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => {
          const nextPath = getNextActivityPath('nature')
          navigate(nextPath)
        }, 1000)
      } else {
        setError(result.error || '저장에 실패했습니다.')
        setSaving(false)
      }
    } catch (err) {
      setError('저장 중 오류가 발생했습니다: ' + err.message)
      setSaving(false)
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
        <article className="activity-nature-problem-card" style={{ padding: '0 1rem', marginTop: '1rem' }}>
          {/* Image */}
          <div className="activity-nature-image-wrapper">
            <div 
              className="activity-nature-image"
              style={{ backgroundImage: `url(${natureImage})` }}
            >
              <div className="activity-nature-image-overlay"></div>
              <div className="activity-nature-badge">
                <span>문제 03</span>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="activity-nature-content">
            <h2 className="activity-nature-problem-title">일월오봉도</h2>
            <div className="activity-nature-divider"></div>
            <p className="activity-nature-description">
              일월오봉도에 그려진 다섯 가지 자연물을 적어보세요.
            </p>
          </div>
        </article>

        {/* Input Card */}
        <section className="activity-nature-input-card">
          <div className="activity-nature-input-group">
            {natures.map((nature, index) => (
              <input
                key={index}
                type="text"
                value={nature}
                onChange={(e) => handleNatureChange(index, e.target.value)}
                placeholder={`${index + 1}번째 자연물`}
                className="activity-nature-text-input"
              />
            ))}
          </div>
        </section>

        {error && (
          <div className="activity-nature-error">
            {error}
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Area */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
        <ActivityFooter
          answerValue=""
          onAnswerChange={() => {}}
          onSubmit={handleSave}
          saved={saved}
          saving={saving}
          showAnswerInput={false}
        />
      </div>
    </div>
  )
}

export default Question03_Nature

