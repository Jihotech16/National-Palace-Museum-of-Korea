import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getNextActivityPath, getExhibitionHallFromActivityId, EXHIBITION_HALL_ACTIVITIES } from '../utils/activityOrder'
import { getAllActivityStatus } from '../firebase/firestore'
import './CorrectAnswer.css'

function CorrectAnswer({ 
  explanation = '이 유물은 조선 시대 왕실의 권위를 상징하는 중요한 문화재입니다. 세부적인 특징을 잘 관찰하셨네요!',
  score = 10,
  activityId = null,
  userId = null,
  userEmail = null,
  onNext = null,
  onReplay = null,
  nextButtonText = '다음 문제로',
  theme = 'purple' // 'purple' or 'blue'
}) {
  const [progress, setProgress] = useState(0)
  const [isLastQuestion, setIsLastQuestion] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (activityId) {
      checkIfLastQuestion()
      if (userId) {
        loadProgress()
      }
    }
  }, [userId, activityId])

  const checkIfLastQuestion = () => {
    if (!activityId) return
    
    // 현재 활동지가 속한 전시관 찾기
    const exhibitionHall = getExhibitionHallFromActivityId(activityId)
    if (!exhibitionHall) {
      setIsLastQuestion(false)
      return
    }
    
    // 해당 전시관의 문제 목록 가져오기
    const hallActivities = EXHIBITION_HALL_ACTIVITIES[exhibitionHall] || []
    
    // 마지막 문제인지 확인
    const lastActivityId = hallActivities[hallActivities.length - 1]
    setIsLastQuestion(activityId === lastActivityId)
  }

  const loadProgress = async () => {
    if (!userId || !activityId) return
    
    const result = await getAllActivityStatus(userId, userEmail)
    if (result.success) {
      const status = result.status || {}
      
      // 현재 활동지가 속한 전시관 찾기
      const exhibitionHall = getExhibitionHallFromActivityId(activityId)
      if (!exhibitionHall) {
        setProgress(0)
        return
      }
      
      // 해당 전시관의 문제 목록 가져오기
      const hallActivities = EXHIBITION_HALL_ACTIVITIES[exhibitionHall] || []
      const totalActivities = hallActivities.length
      
      // 해당 전시관의 완료된 문제 수 계산
      const completedCount = hallActivities.filter(activityId => status[activityId] === true).length
      const progressPercentage = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0
      setProgress(progressPercentage)
    }
  }

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else if (isLastQuestion) {
      // 마지막 문제일 때는 해당 박물관의 전시관 목록으로 이동
      if (activityId && activityId.startsWith('seoul')) {
        navigate('/seoul-history-museum-hall-list')
      } else {
        navigate('/exhibition-hall-list')
      }
    } else if (activityId) {
      const nextPath = getNextActivityPath(activityId)
      if (nextPath) {
        // 현재 경로 형식에 맞게 변환
        let finalPath = nextPath
        const currentPath = location.pathname
        
        // 현재 경로가 /2_Seoul_Empire/, /3_Seoul_Colonial/, /4_Seoul_Growth/ 형식이면
        // 다음 경로도 같은 형식으로 변환
        if (currentPath.includes('/2_Seoul_Empire/') && nextPath.includes('/SeoulHistoryMuseum/2_Seoul_Empire/')) {
          finalPath = nextPath.replace('/SeoulHistoryMuseum/2_Seoul_Empire/', '/2_Seoul_Empire/')
        } else if (currentPath.includes('/3_Seoul_Colonial/') && nextPath.includes('/SeoulHistoryMuseum/3_Seoul_Colonial/')) {
          finalPath = nextPath.replace('/SeoulHistoryMuseum/3_Seoul_Colonial/', '/3_Seoul_Colonial/')
        } else if (currentPath.includes('/4_Seoul_Growth/') && nextPath.includes('/SeoulHistoryMuseum/4_Seoul_Growth/')) {
          finalPath = nextPath.replace('/SeoulHistoryMuseum/4_Seoul_Growth/', '/4_Seoul_Growth/')
        }
        
        navigate(finalPath)
      } else {
        // 다음 경로가 없으면 해당 박물관의 전시관 목록으로
        if (activityId && activityId.startsWith('seoul')) {
          navigate('/seoul-history-museum-hall-list')
        } else {
          navigate('/exhibition-hall-list')
        }
      }
    } else {
      navigate('/exhibition-hall-list')
    }
  }

  const handleReplay = () => {
    if (onReplay) {
      onReplay()
    } else {
      // 이전 페이지로 돌아가기
      window.history.back()
    }
  }

  const handleGoToExhibition = () => {
    // 서울역사박물관 문제인지 확인 (theme가 'blue'이거나 activityId가 'seoul'로 시작)
    if (theme === 'blue' || (activityId && activityId.startsWith('seoul'))) {
      navigate('/seoul-history-museum-hall-list')
    } else {
      navigate('/exhibition-hall-list')
    }
  }

  const containerClass = theme === 'blue' 
    ? 'correct-answer-container correct-answer-container-blue'
    : 'correct-answer-container'

  return (
    <div className={containerClass}>
      {/* 배경 효과 */}
      <div className="correct-answer-background-effects">
        <div className="correct-answer-bg-blur-1"></div>
        <div className="correct-answer-bg-blur-2"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="correct-answer-content">
        {/* 축하 아이콘 */}
        <div className="correct-answer-icon-wrapper">
          <div className="correct-answer-celebration-icon">
            <span className="material-symbols-outlined fill-1">celebration</span>
          </div>
          <div className="correct-answer-star-1">
            <span className="material-symbols-outlined">star</span>
          </div>
          <div className="correct-answer-star-2">
            <span className="material-symbols-outlined">star</span>
          </div>
        </div>

        {/* 축하 메시지 */}
        <div className="correct-answer-message">
          <h1 className="correct-answer-title">정답입니다!</h1>
          <p className="correct-answer-subtitle">훌륭한 관찰력이에요</p>
          <p className="correct-answer-description">
            {isLastQuestion 
              ? '이 전시관의 모든 문제를 완료하셨습니다! 훌륭해요!' 
              : '잘하셨어요! 다음 문제로 넘어가볼까요?'}
          </p>
        </div>

        {/* 정답 정보 카드 */}
        <div className="correct-answer-info-card">
          <div className="correct-answer-info-header">
            <div className="correct-answer-check-icon">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div className="correct-answer-info-text">
              <h3 className="correct-answer-info-title">정답</h3>
              <p className="correct-answer-info-subtitle">문제를 완벽하게 해결하셨습니다</p>
            </div>
          </div>
          <div className="correct-answer-score-section">
            <div className="correct-answer-score-header">
              <span className="correct-answer-score-label">탐험 진행도</span>
              <span className="correct-answer-score-value">{progress}%</span>
            </div>
            <div className="correct-answer-progress-bar">
              <div 
                className="correct-answer-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* 설명 카드 */}
        <div className="correct-answer-explanation-card">
          <span className="material-symbols-outlined correct-answer-explanation-icon">lightbulb</span>
          <div className="correct-answer-explanation-content">
            <h4 className="correct-answer-explanation-title">정답 설명</h4>
            <p className="correct-answer-explanation-text">{explanation}</p>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="correct-answer-buttons">
          <button 
            className="correct-answer-next-button"
            onClick={handleNext}
          >
            <span>{isLastQuestion ? '목록으로 돌아가기' : (nextButtonText || '다음 문제로')}</span>
            <span className="material-symbols-outlined">
              {isLastQuestion ? 'list' : 'arrow_forward'}
            </span>
          </button>
          <button 
            className="correct-answer-replay-button"
            onClick={handleReplay}
          >
            <span className="material-symbols-outlined">replay</span>
            <span>다시 보기</span>
          </button>
          {!isLastQuestion && (
            <button 
              className="correct-answer-exhibition-button"
              onClick={handleGoToExhibition}
            >
              <span className="material-symbols-outlined">museum</span>
              <span>전시관 탐험</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CorrectAnswer


