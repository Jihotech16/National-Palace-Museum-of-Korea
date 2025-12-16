import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import ceilingImage from '../../image/쌍용각보개.jpg'
import './ActivityCommon.css'

function ActivityCeiling({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [ceilingUsage, setCeilingUsage] = useState('')
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
    const result = await getActivityData(user.uid, 'ceiling')
    if (result.success && result.data) {
      setCeilingUsage(result.data.ceilingUsage || '')
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
    
    if (!ceilingUsage.trim()) {
      setError('답을 입력해주세요.')
      return
    }
    
    const answerCheck = checkAnswer('ceiling', 'ceilingUsage', ceilingUsage)
    if (!answerCheck.correct) {
      setError(answerCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }
    
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'ceiling', {
        ceilingUsage: ceilingUsage
      })
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => {
          const nextPath = getNextActivityPath('ceiling')
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
              style={{ backgroundImage: `url(${ceilingImage})` }}
            >
              <div className="activity-image-overlay"></div>
              <div className="activity-badge">
                <span>문제</span>
              </div>
            </div>
          </div>

          <div className="activity-content">
            <h2 className="activity-problem-title">쌍용각보개</h2>
            <div className="activity-divider"></div>
            <p className="activity-description">
              쌍용각보개는 정전이나 편전에서 국왕의 자리{' '}
              <input 
                type="text" 
                value={ceilingUsage}
                onChange={(e) => {
                  setCeilingUsage(e.target.value)
                  setError('')
                }}
                placeholder="답을 입력하세요"
                className="activity-inline-input"
              />
              에 사용되었다.
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
        answerValue=""
        onAnswerChange={() => {}}
        onSubmit={handleSave}
        saved={saved}
        saving={saving}
        showAnswerInput={false}
      />
    </div>
  )
}

export default ActivityCeiling

