import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import { checkAnswer, checkMultipleAnswers } from '../../utils/answerCheck'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityNature({ user }) {
  const navigate = useNavigate()
  const [artifactName, setArtifactName] = useState('')
  const [natures, setNatures] = useState(['', '', '', '', ''])
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
    const result = await getActivityData(user.uid, 'nature')
    if (result.success && result.data) {
      // 기존 데이터 호환성 유지
      if (result.data.artifacts && Array.isArray(result.data.artifacts)) {
        setArtifactName(result.data.artifacts[0] || '')
      } else {
        setArtifactName(result.data.artifactName || '')
      }
      if (result.data.natures && Array.isArray(result.data.natures)) {
        setNatures(result.data.natures)
      }
    }
  }

  const handleNatureChange = (index, value) => {
    const newNatures = [...natures]
    newNatures[index] = value
    setNatures(newNatures)
    setError('') // 입력 시 에러 메시지 초기화
  }

  const handleSave = async () => {
    setError('')
    
    // 유물 이름 체크
    if (!artifactName.trim()) {
      setError('유물 이름을 입력해주세요.')
      return
    }
    
    const artifactCheck = checkAnswer('nature', 'artifactName', artifactName)
    if (!artifactCheck.correct) {
      setError(artifactCheck.message)
      return
    }
    
    // 5가지 자연물 체크
    const naturesCheck = checkMultipleAnswers('nature', 'natures', natures)
    if (!naturesCheck.correct) {
      setError(naturesCheck.message)
      return
    }
    
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'nature', {
        artifactName: artifactName,
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
    <ActivityLayout title="조선국왕">
      <div className="activity-section">
        <h2 style={{ textAlign: 'center' }}>일월오봉도</h2>

        <div className="input-group">
          <label>일월오봉도에 그려진 다섯 가지 자연물을 적어보세요.</label>
          {natures.map((nature, index) => (
            <input
              key={index}
              type="text"
              value={nature}
              onChange={(e) => handleNatureChange(index, e.target.value)}
              placeholder={`${index + 1}번째 자연물`}
              className="text-input"
            />
          ))}
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

export default ActivityNature

