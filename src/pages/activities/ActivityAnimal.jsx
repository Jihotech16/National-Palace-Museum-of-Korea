import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../../firebase/firestore'
import { getNextActivityPath } from '../../utils/activityOrder'
import ActivityLayout from '../../components/ActivityLayout'
import './ActivityCommon.css'

function ActivityAnimal({ user }) {
  const navigate = useNavigate()
  const [artifactName, setArtifactName] = useState('')
  const [similarAnimals, setSimilarAnimals] = useState(['', '', '', '', '', '', '', '', ''])
  const [reason, setReason] = useState('')
  const [otherArtifacts, setOtherArtifacts] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const result = await getActivityData(user.uid, 'animal')
    if (result.success && result.data) {
      setArtifactName(result.data.artifactName || '')
      setSimilarAnimals(result.data.similarAnimals || ['', '', '', '', '', '', '', '', ''])
      setReason(result.data.reason || '')
      setOtherArtifacts(result.data.otherArtifacts || '')
    }
  }

  const handleSave = async () => {
    const result = await saveActivityData(user.uid, 'animal', {
      artifactName,
      similarAnimals,
      reason,
      otherArtifacts
    })
    if (result.success) {
      setSaved(true)
      setTimeout(() => {
        const nextPath = getNextActivityPath('animal')
        navigate(nextPath)
      }, 1000)
    }
  }

  const handleAnimalChange = (index, value) => {
    const newAnimals = [...similarAnimals]
    newAnimals[index] = value
    setSimilarAnimals(newAnimals)
  }

  return (
    <ActivityLayout title="동물 유물">
      <div className="activity-section">
        <div className="input-group">
          <label>위 유물을 찾아 이름을 적어보세요.</label>
          <input
            type="text"
            value={artifactName}
            onChange={(e) => setArtifactName(e.target.value)}
            placeholder="유물 이름을 입력하세요"
            className="text-input"
          />
        </div>

        <div className="input-group">
          <label>이 동물은 9가지 다른 동물들과 비슷한 모습을 하고 있다고 해요. 닮은 동물을 생각해보고 이름을 적어보세요.</label>
          {similarAnimals.map((animal, index) => (
            <input
              key={index}
              type="text"
              value={animal}
              onChange={(e) => handleAnimalChange(index, e.target.value)}
              placeholder={`${index + 1}번째 동물 이름`}
              className="text-input"
            />
          ))}
        </div>

        <div className="input-group">
          <label>이러한 유물을 만든 이유는 무엇인지 생각해보고, 비슷한 의미로 만들어진 다른 유물도 찾아보세요.</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="이유를 적어보세요"
            rows={4}
            className="text-input"
          />
        </div>

        <div className="input-group">
          <label>비슷한 의미로 만들어진 다른 유물</label>
          <input
            type="text"
            value={otherArtifacts}
            onChange={(e) => setOtherArtifacts(e.target.value)}
            placeholder="다른 유물 이름을 입력하세요"
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

export default ActivityAnimal

