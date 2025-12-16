import '../pages/activities/ActivityCommon.css'

function ActivityFooter({ 
  answerValue = '',
  onAnswerChange = () => {},
  onSubmit,
  saved = false,
  saving = false,
  showAnswerInput = true,
  answerPlaceholder = '답을 입력하세요',
  answerId = 'answer'
}) {
  return (
    <footer className="activity-footer">
      <form 
        className="activity-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (onSubmit) {
            onSubmit()
          }
        }}
      >
        {/* Answer Input Field */}
        {showAnswerInput && (
          <div className="activity-input-wrapper">
            <label className="activity-input-label" htmlFor={answerId}>
              정답 입력
            </label>
            <div className="activity-input-icon-wrapper">
              <span className="material-symbols-outlined activity-input-icon">edit_note</span>
            </div>
            <input
              id={answerId}
              name={answerId}
              type="text"
              value={answerValue}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder={answerPlaceholder}
              className="activity-answer-input"
            />
          </div>
        )}
        {/* Submit Button */}
        <button 
          type="submit"
          className={`activity-submit-btn ${saved ? 'saved' : ''}`}
          disabled={saving || saved}
        >
          <span>{saving ? '저장 중...' : saved ? '✓ 저장됨' : '정답 제출'}</span>
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
      <div className="activity-safe-area"></div>
    </footer>
  )
}

export default ActivityFooter
