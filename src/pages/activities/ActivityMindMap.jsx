import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityMindMap({ user }) {
  const navigate = useNavigate()
  const [words, setWords] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'mindmap')
    if (result.success && result.data) {
      setWords(result.data.words || '')
    }
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)
    
    try {
      const result = await saveActivityData(user.uid, 'mindmap', {
        words: words
      })
      
      if (result.success) {
        setSaved(true)
        setTimeout(() => {
          const nextPath = getNextActivityPath('mindmap')
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
    <ActivityLayout title="마인드 맵">
      <div className="activity-section">
        <h2>국립고궁박물관을 생각하면 떠오르는 단어들을 나열해 보세요.</h2>
        
        <div className="input-area">
          <textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="떠오르는 단어들을 입력해주세요 (예: 조선, 왕, 궁궐, 유물, 역사...)"
            rows={8}
            className="text-input"
          />
        </div>

        {error && <div className="error-message" style={{ marginBottom: '16px' }}>{error}</div>}
        
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

export default ActivityMindMap

