import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import CoverLayout from '../../components/CoverLayout'
import sealImage from '../../image/태조추상시호금보.jpeg'
import coverImage from '../../image/조선국왕표지.jpg'
import './ActivityCommon.css'

function ActivitySeal({ user }) {
  const navigate = useNavigate()
  const [showCover, setShowCover] = useState(true)
  const [sealAnswer, setSealAnswer] = useState('')
  const [sealAnimalAnswer, setSealAnimalAnswer] = useState('')
  const [saved, setSaved] = useState(false)
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
    const result = await getActivityData(user.uid, 'seal')
    if (result.success && result.data) {
      setSealAnswer(result.data.sealAnswer || '')
      setSealAnimalAnswer(result.data.sealAnimalAnswer || '')
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
    <ActivityLayout title="조선국왕">
      <div className="activity-section">
        <div className="seal-activity">
          <h2 style={{ textAlign: 'center' }}>어보</h2>
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

          <div className="input-group" style={{ marginTop: '24px' }}>
            <label>왕의 어보(도장)에는 어떤 동물이 새겨져 있을까?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
              {['용', '봉황', '거북', '호랑이'].map((option, index) => (
                <label 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s',
                    backgroundColor: sealAnimalAnswer === option ? '#f0f8ff' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (sealAnimalAnswer !== option) {
                      e.currentTarget.style.borderColor = '#8B4513'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (sealAnimalAnswer !== option) {
                      e.currentTarget.style.borderColor = '#e0e0e0'
                    }
                  }}
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
                    style={{ marginRight: '10px', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '15px' }}>{option}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="toast-error">
              {error}
            </div>
          )}

          <button onClick={handleSave} className="save-button">
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>
      </div>
    </ActivityLayout>
  )
}

export default ActivitySeal

