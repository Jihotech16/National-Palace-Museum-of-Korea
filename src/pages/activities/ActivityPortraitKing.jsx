import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityFooter from '../../components/ActivityFooter'
import portraitImage from '../../image/영조어진.jpg'
import './ActivityCommon.css'

function ActivityPortraitKing({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [kingNumber, setKingNumber] = useState('')
  const [kingName, setKingName] = useState('')
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
    const result = await getActivityData(user.uid, 'portraitKing')
    if (result.success && result.data) {
      if (result.data.kingAnswer) {
        const parts = result.data.kingAnswer.split(/대|번째/)
        if (parts.length > 1) {
          setKingNumber(parts[0].trim())
          setKingName(parts[1].trim())
        }
      } else {
        setKingNumber(result.data.kingNumber || '')
        setKingName(result.data.kingName || '')
      }
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
    
    if (!kingNumber.trim()) {
      setError('몇 대 왕인지 입력해주세요.')
      return
    }
    
    if (!kingName.trim()) {
      setError('왕의 이름을 입력해주세요.')
      return
    }
    
    const numberCheck = checkAnswer('portraitKing', 'kingNumber', kingNumber)
    if (!numberCheck.correct) {
      setError(numberCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }
    
    const nameCheck = checkAnswer('portraitKing', 'kingName', kingName)
    if (!nameCheck.correct) {
      setError(nameCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
      return
    }
    
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'portraitKing', {
        kingNumber: kingNumber,
        kingName: kingName
      })
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => {
          const nextPath = getNextActivityPath('portraitKing')
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
              style={{ backgroundImage: `url(${portraitImage})` }}
            >
              <div className="activity-image-overlay"></div>
              <div className="activity-badge">
                <span>문제</span>
              </div>
            </div>
          </div>

          <div className="activity-content">
            <h2 className="activity-problem-title">어진</h2>
            <div className="activity-divider"></div>
            <p className="activity-description">
              위 사진의 인물은 조선 몇 대 왕 누구 일까요?
            </p>
          </div>
        </article>

        <section className="activity-card">
          <div className="activity-input-group">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={kingNumber}
                onChange={(e) => {
                  setKingNumber(e.target.value)
                  setError('')
                }}
                placeholder="몇 대"
                className="activity-text-input"
                style={{ flex: '0 0 100px' }}
              />
              <span style={{ color: 'inherit' }}>대</span>
              <input
                type="text"
                value={kingName}
                onChange={(e) => {
                  setKingName(e.target.value)
                  setError('')
                }}
                placeholder="왕의 이름"
                className="activity-text-input"
                style={{ flex: '1' }}
              />
            </div>
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

export default ActivityPortraitKing

