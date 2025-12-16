import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import sealImage from '../../image/태조추상시호금보.jpeg'
import './ActivityCommon.css'

function ActivitySeal({ user }) {
  const navigate = useNavigate()
  const [sealAnswer, setSealAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'seal')
    if (result.success && result.data) {
      setSealAnswer(result.data.sealAnswer || '')
    }
  }

  const handleSave = async () => {
    setError('')
    
    // 정답 체크
    const answerCheck = checkAnswer('seal', 'sealAnswer', sealAnswer)
    if (!answerCheck.correct) {
      setError(answerCheck.message || '정답이 아닙니다. 다시 확인해보세요.')
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
    <ActivityLayout title="어보">
      <div className="activity-section">
        <div className="seal-activity">
          <img 
            src={sealImage} 
            alt="태조추상시호금보" 
            style={{ 
              width: '100%', 
              maxWidth: '400px', 
              marginBottom: '16px',
              borderRadius: '8px'
            }} 
          />
          <p className="activity-description">
            어보는 조선왕실의 <input 
              type="text" 
              value={sealAnswer}
              onChange={(e) => {
                setSealAnswer(e.target.value)
                setError('')
              }}
              placeholder="답을 입력하세요"
              className="inline-input"
            />를 위해 제작된 인장입니다.
          </p>

          {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}

          <button onClick={handleSave} className="save-button">
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>
      </div>
    </ActivityLayout>
  )
}

export default ActivitySeal

