import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import ActivityFooter from '../../components/ActivityFooter'
import './ActivityCommon.css'

function ActivityScience({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [artifactName, setArtifactName] = useState('')
  const [artifactPurpose, setArtifactPurpose] = useState('')
  const [reason, setReason] = useState('')
  const [saved, setSaved] = useState(false)

  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null

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

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      navigate('/')
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
    <div className="activity-container dark">
      <header className="activity-header">
        <button className="activity-back-btn" onClick={handleBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="activity-title">과학문화실</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <main className="activity-main">
        <article className="activity-problem-card">
          <div className="activity-content">
            <h2 className="activity-problem-title">B1층 과학문화실</h2>
            <div className="activity-divider"></div>
          </div>
        </article>

        <section className="activity-card">
          <div className="activity-input-group">
            <label className="activity-label">그림과 같은 모양의 유물을 찾아 이름과 용도를 적어보세요.</label>
            <input
              type="text"
              value={artifactName}
              onChange={(e) => setArtifactName(e.target.value)}
              placeholder="유물 이름"
              className="activity-text-input"
            />
            <input
              type="text"
              value={artifactPurpose}
              onChange={(e) => setArtifactPurpose(e.target.value)}
              placeholder="유물 용도"
              className="activity-text-input"
              style={{ marginTop: '12px' }}
            />
          </div>
        </section>

        <section className="activity-card">
          <div className="activity-input-group">
            <label className="activity-label">위의 과학 기구를 만든 이유는 무엇일까요?</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="이유를 적어보세요"
              rows={4}
              className="activity-textarea"
            />
          </div>
        </section>
      </main>

      <ActivityFooter
        answerValue=""
        onAnswerChange={() => {}}
        onSubmit={handleSave}
        saved={saved}
        showAnswerInput={false}
      />
    </div>
  )
}

export default ActivityScience

