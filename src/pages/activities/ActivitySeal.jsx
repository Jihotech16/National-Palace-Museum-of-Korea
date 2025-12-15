import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivitySeal({ user }) {
  const navigate = useNavigate()
  const [sealAnswer, setSealAnswer] = useState('')
  const [sealMaterial, setSealMaterial] = useState('')
  const [sealShape, setSealShape] = useState('')
  const [innerBoxMaterial, setInnerBoxMaterial] = useState('')
  const [innerBoxShape, setInnerBoxShape] = useState('')
  const [outerBoxMaterial, setOuterBoxMaterial] = useState('')
  const [outerBoxShape, setOuterBoxShape] = useState('')
  const [sealContent, setSealContent] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'seal')
    if (result.success && result.data) {
      setSealAnswer(result.data.sealAnswer || '')
      setSealMaterial(result.data.sealMaterial || '')
      setSealShape(result.data.sealShape || '')
      setInnerBoxMaterial(result.data.innerBoxMaterial || '')
      setInnerBoxShape(result.data.innerBoxShape || '')
      setOuterBoxMaterial(result.data.outerBoxMaterial || '')
      setOuterBoxShape(result.data.outerBoxShape || '')
      setSealContent(result.data.sealContent || '')
    }
  }

  const handleSave = async () => {
    const result = await saveActivityData(user.uid, 'seal', {
      sealAnswer,
      sealMaterial,
      sealShape,
      innerBoxMaterial,
      innerBoxShape,
      outerBoxMaterial,
      outerBoxShape,
      sealContent
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
        <h2>2층 조선의 국왕실</h2>
        
        <div className="seal-activity">
          <p className="activity-description">
            (1) 어보는 <input 
              type="text" 
              value={sealAnswer}
              onChange={(e) => setSealAnswer(e.target.value)}
              placeholder="답을 입력하세요"
              className="inline-input"
            /> 의 도장입니다.
          </p>
          <p className="activity-description">
            어보와 어보 상자를 관찰 후 빈 칸에 알맞은 답을 채워주세요.
          </p>

          <div className="observation-table">
            <div className="table-row header">
              <div className="table-cell">구분</div>
              <div className="table-cell">재료</div>
              <div className="table-cell">모양</div>
            </div>
            <div className="table-row">
              <div className="table-cell">어보</div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={sealMaterial}
                  onChange={(e) => setSealMaterial(e.target.value)}
                  placeholder="재료"
                  className="table-input"
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={sealShape}
                  onChange={(e) => setSealShape(e.target.value)}
                  placeholder="모양"
                  className="table-input"
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">안 상자(내함)</div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={innerBoxMaterial}
                  onChange={(e) => setInnerBoxMaterial(e.target.value)}
                  placeholder="재료"
                  className="table-input"
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={innerBoxShape}
                  onChange={(e) => setInnerBoxShape(e.target.value)}
                  placeholder="모양"
                  className="table-input"
                />
              </div>
            </div>
            <div className="table-row">
              <div className="table-cell">바깥 상자(외함)</div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={outerBoxMaterial}
                  onChange={(e) => setOuterBoxMaterial(e.target.value)}
                  placeholder="재료"
                  className="table-input"
                />
              </div>
              <div className="table-cell">
                <input 
                  type="text" 
                  value={outerBoxShape}
                  onChange={(e) => setOuterBoxShape(e.target.value)}
                  placeholder="모양"
                  className="table-input"
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>(1) 소중한 사람에게 어보를 만들어 준다면 어떤 내용을 담고 싶은가요?</label>
            <textarea
              value={sealContent}
              onChange={(e) => setSealContent(e.target.value)}
              placeholder="내용을 적어보세요"
              rows={4}
              className="text-input"
            />
          </div>

          <button onClick={handleSave} className="save-button">
            {saved ? '✓ 저장됨' : '저장하기'}
          </button>
        </div>
      </div>
    </ActivityLayout>
  )
}

export default ActivitySeal

