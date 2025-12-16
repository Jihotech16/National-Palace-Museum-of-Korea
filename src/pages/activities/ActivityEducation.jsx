import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityEducation({ user }) {
  const navigate = useNavigate()
  const [educationAnswer, setEducationAnswer] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
    <ActivityLayout title="조선국왕">
      <div className="activity-section">
        <h2 style={{ textAlign: 'center' }}>국왕의 교육</h2>
        
        <div className="input-group">
          <label>
            왕위계승자인 원자가 글을 배우기 전까지의 교육을 맡던 시설을 무엇이라고 할까요?
          </label>
          <input
            type="text"
            value={educationAnswer}
            onChange={(e) => {
              setEducationAnswer(e.target.value)
              setError('')
            }}
            placeholder="답을 입력하세요"
            className="text-input"
          />
        </div>

        {error && (
          <div className="toast-error">
            {error}
          </div>
        )}
        
        <button 
          onClick={handleSave} 
          className="save-button"
          disabled={saving || saved}
        >
          {saving ? '저장 중...' : saved ? '✓ 저장됨' : '저장하기'}
        </button>
      </div>
    </ActivityLayout>
  )
}

export default ActivityEducation

