import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import ceilingImage from '../../image/쌍용각보개.jpg'
import './ActivityCommon.css'

function ActivityCeiling({ user }) {
  const navigate = useNavigate()
  const [ceilingUsage, setCeilingUsage] = useState('')
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
    const result = await getActivityData(user.uid, 'ceiling')
    if (result.success && result.data) {
      setCeilingUsage(result.data.ceilingUsage || '')
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
    <ActivityLayout title="조선국왕">
      <div className="activity-section">
        <h2 style={{ textAlign: 'center' }}>쌍용각보개</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src={ceilingImage} 
            alt="쌍용각보개" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px',
              width: 'auto',
              height: 'auto', 
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }} 
          />
        </div>

        <div className="input-group">
          <label>
            쌍용각보개는 정전이나 편전에서 국왕의 자리{' '}
            <input 
              type="text" 
              value={ceilingUsage}
              onChange={(e) => {
                setCeilingUsage(e.target.value)
                setError('')
              }}
              placeholder="답을 입력하세요"
              className="inline-input"
            />
            에 사용되었다.
          </label>
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

export default ActivityCeiling

