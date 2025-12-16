import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import './ActivityCommon.css'

function ActivityEducation({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [educationAnswer, setEducationAnswer] = useState('')
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
    const result = await getActivityData(user.uid, 'education')
    if (result.success && result.data) {
      setEducationAnswer(result.data.educationAnswer || '')
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
    
    if (!educationAnswer.trim()) {
      setError('답을 입력해주세요.')
      return
    }
    
    const answerCheck = checkAnswer('education', 'educationAnswer', educationAnswer)
    if (!answerCheck.correct) {
      setError(answerCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }
    
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'education', {
        educationAnswer: educationAnswer
      })
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => {
          const nextPath = getNextActivityPath('education')
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
          <div className="activity-content">
            <h2 className="activity-problem-title">국왕의 교육</h2>
            <div className="activity-divider"></div>
            <p className="activity-description">
              왕위계승자인 원자가 글을 배우기 전까지의 교육을 맡던 시설을 무엇이라고 할까요?
            </p>
          </div>
        </article>

        <section className="activity-card">
          <div className="activity-input-group">
            <input
              type="text"
              value={educationAnswer}
              onChange={(e) => {
                setEducationAnswer(e.target.value)
                setError('')
              }}
              placeholder="답을 입력하세요"
              className="activity-text-input"
            />
          </div>
        </section>

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

export default ActivityEducation

