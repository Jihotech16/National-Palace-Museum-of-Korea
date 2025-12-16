import { useNavigate } from 'react-router-dom'
import { getNextActivityPath } from '../utils/activityOrder'
import './CorrectAnswer.css'

function CorrectAnswer({ 
  explanation = '이 유물은 조선 시대 왕실의 권위를 상징하는 중요한 문화재입니다. 세부적인 특징을 잘 관찰하셨네요!',
  score = 10,
  activityId = null,
  onNext = null,
  onReplay = null
}) {
  const navigate = useNavigate()

  const handleNext = () => {
    if (onNext) {
      onNext()
    } else if (activityId) {
      const nextPath = getNextActivityPath(activityId)
      if (nextPath) {
        navigate(nextPath)
      } else {
        navigate('/exhibition-hall-list')
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

  return (
    <div className="correct-answer-container">
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
          <p className="correct-answer-description">잘하셨어요! 다음 문제로 넘어가볼까요?</p>
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
              <span className="correct-answer-score-label">획득 점수</span>
              <span className="correct-answer-score-value">+{score}점</span>
            </div>
            <div className="correct-answer-progress-bar">
              <div className="correct-answer-progress-fill"></div>
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
            <span>다음 문제로</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button 
            className="correct-answer-replay-button"
            onClick={handleReplay}
          >
            <span className="material-symbols-outlined">replay</span>
            <span>다시 보기</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CorrectAnswer
