import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import portraitImage from '../../image/영조어진.jpg'
import './ActivityCommon.css'

function ActivityPortraitKing({ user }) {
  const navigate = useNavigate()
  const [kingNumber, setKingNumber] = useState('')
  const [kingName, setKingName] = useState('')
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
    const result = await getActivityData(user.uid, 'portraitKing')
    if (result.success && result.data) {
      // 기존 데이터 호환성 유지
      if (result.data.kingAnswer) {
        // 기존 단일 필드 데이터가 있으면 분리 시도
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
    <ActivityLayout title="조선국왕">
      <div className="activity-section">
        <h2 style={{ textAlign: 'center' }}>어진</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img 
            src={portraitImage} 
            alt="어진" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '150px',
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
            위 사진의 인물은 조선 몇 대 왕 누구 일까요?
          </label>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              value={kingNumber}
              onChange={(e) => {
                setKingNumber(e.target.value)
                setError('')
              }}
              placeholder="몇 대"
              className="text-input"
              style={{ flex: '0 0 100px' }}
            />
            <span>대</span>
            <input
              type="text"
              value={kingName}
              onChange={(e) => {
                setKingName(e.target.value)
                setError('')
              }}
              placeholder="왕의 이름"
              className="text-input"
              style={{ flex: '1' }}
            />
          </div>
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

export default ActivityPortraitKing

