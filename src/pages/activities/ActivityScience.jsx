import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityScience({ user }) {
  const navigate = useNavigate()
  const [artifactName, setArtifactName] = useState('')
  const [artifactPurpose, setArtifactPurpose] = useState('')
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'science')
    if (result.success && result.data) {
      setArtifactName(result.data.artifactName || '')
      setArtifactPurpose(result.data.artifactPurpose || '')
      setReason(result.data.reason || '')
    }
  }

  const handleSave = async () => {
    const result = await saveActivityData(user.uid, 'science', {
      artifactName,
      artifactPurpose,
      reason
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('science')
        navigate(nextPath)
      }, 1000)
    }
  }

  return (
    <ActivityLayout title="과학문화실">
      <div className="activity-section">
        <h2>B1층 과학문화실</h2>
        
        <div className="input-group">
          <label>그림과 같은 모양의 유물을 찾아 이름과 용도를 적어보세요.</label>
          <input
            type="text"
            value={artifactName}
            onChange={(e) => setArtifactName(e.target.value)}
            placeholder="유물 이름"
            className="text-input"
          />
          <input
            type="text"
            value={artifactPurpose}
            onChange={(e) => setArtifactPurpose(e.target.value)}
            placeholder="유물 용도"
            className="text-input"
            style={{ marginTop: '12px' }}
          />
        </div>

        <div className="input-group">
          <label>위의 과학 기구를 만든 이유는 무엇일까요?</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="이유를 적어보세요"
            rows={4}
            className="text-input"
          />
        </div>

        <button onClick={handleSave} className="save-button">
          {saved ? '✓ 저장됨' : '저장하기'}
        </button>
      </div>
    </ActivityLayout>
  )
}

export default ActivityScience

