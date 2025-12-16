import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath } from '../../utils/activityOrder'
import ActivityFooter from '../../components/ActivityFooter'
import './ActivityCommon.css'

function ActivityPortrait({ user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [difference, setDifference] = useState('')
  const [reason, setReason] = useState('')
  const [symbolName, setSymbolName] = useState('')
  const [saved, setSaved] = useState(false)

  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'portrait')
    if (result.success && result.data) {
      setDifference(result.data.difference || '')
      setReason(result.data.reason || '')
      setSymbolName(result.data.symbolName || '')
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
    const result = await saveActivityData(user.uid, 'portrait', {
      difference,
      reason,
      symbolName
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('portrait')
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
        <h1 className="activity-title">어진 비교</h1>
        <div style={{ width: '40px' }}></div>
      </header>

      <main className="activity-main">
        <section className="activity-card">
          <div className="activity-input-group">
            <label className="activity-label"><strong>1층</strong> 왼쪽의 그림은 임금의 초상화 '어진'입니다. 아래 어진과의 차이점은 무엇일까요?</label>
            <textarea
              value={difference}
              onChange={(e) => setDifference(e.target.value)}
              placeholder="차이점을 적어보세요"
              rows={4}
              className="activity-textarea"
            />
          </div>
        </section>

        <section className="activity-card">
          <div className="activity-input-group">
            <label className="activity-label"><strong>2층</strong> 그러한 차이점이 생긴 이유는 무엇일까요?</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="이유를 적어보세요"
              rows={4}
              className="activity-textarea"
            />
          </div>
        </section>

        <section className="activity-card">
          <div className="activity-input-group">
            <label className="activity-label"><strong>3층</strong> 대한제국을 상징하는 문양이 담긴 유물을 찾아보세요. 그리고 문양의 이름을 적어보세요.</label>
            <input
              type="text"
              value={symbolName}
              onChange={(e) => setSymbolName(e.target.value)}
              placeholder="문양의 이름을 입력하세요"
              className="activity-text-input"
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

export default ActivityPortrait

