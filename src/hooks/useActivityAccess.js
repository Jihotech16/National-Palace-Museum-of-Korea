import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkActivityCompleted } from '../firebase/firestore'

const ACTIVITY_ORDER = {
  seal: 1,
  nature: 2,
  animal: 3,
  portrait: 4,
  science: 5,
  draw: 6
}

const ACTIVITY_IDS = Object.keys(ACTIVITY_ORDER)

export const useActivityAccess = (user, activityId) => {
  const navigate = useNavigate()
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAccess()
  }, [])

  const checkAccess = async () => {
    const order = ACTIVITY_ORDER[activityId]
    
    // 첫 번째 활동지는 항상 접근 가능
    if (order === 1) {
      setHasAccess(true)
      setLoading(false)
      return
    }

    // 이전 활동지가 완료되었는지 확인
    const previousActivityId = ACTIVITY_IDS[order - 2]
    const result = await checkActivityCompleted(user.uid, previousActivityId)
    
    if (result.success && result.completed) {
      setHasAccess(true)
    } else {
      // 접근 불가 - 홈으로 리다이렉트
      alert('이전 활동지를 먼저 완료해주세요.')
      navigate('/')
    }
    
    setLoading(false)
  }

  return { hasAccess, loading }
}


