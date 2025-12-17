import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { saveActivityData, getActivityData } from '../firebase/firestore'
import { getNextActivityPath, getPreviousActivityPath, getActivityIdFromPath, getExhibitionHallFromActivityId } from '../utils/activityOrder'
import { checkAnswer, checkMultipleAnswers } from '../utils/answerCheck'
import ActivityFooter from './ActivityFooter'
import CorrectAnswer from './CorrectAnswer'
import '../pages/activities/ActivityCommon.css'
import '../pages/1_King_of_Joseon/1_Start.css'

function QuestionPage({ user, questionData }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const {
    activityId,
    questionNumber,
    title,
    description,
    image,
    answerField,
    answerPlaceholder,
    explanation,
    customCss,
    inputType = 'single',
    multipleCount = 5,
    multipleLabels = [],
    imageStyle = {}
  } = questionData

  const [answer, setAnswer] = useState(inputType === 'multiple' ? Array(multipleCount).fill('') : '')
  const [saved, setSaved] = useState(false)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [error, setError] = useState('')

  const currentActivityId = getActivityIdFromPath(location.pathname)
  const previousPath = currentActivityId ? getPreviousActivityPath(currentActivityId) : null
  const exhibitionHall = currentActivityId ? getExhibitionHallFromActivityId(currentActivityId) : null
  
  // 전시관 이름 결정
  const getExhibitionHallName = () => {
    if (exhibitionHall === '2_Royal_Life') {
      return '왕실생활'
    }
    if (exhibitionHall === '3_Empire_of_Korea') {
      return '대한제국'
    }
    if (exhibitionHall === '4_Palace_Painting') {
      return '궁중서화'
    }
    if (exhibitionHall === '5_Royal_Ritual') {
      return '왕실의례'
    }
    if (exhibitionHall === '6_Science_Culture') {
      return '과학문화'
    }
    return '조선국왕'
  }

  // 커스텀 CSS import
  useEffect(() => {
    if (customCss) {
      import(`../pages/1_King_of_Joseon/${customCss}`)
    }
  }, [customCss])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const loadData = async () => {
    const result = await getActivityData(user.uid, activityId, user.email)
    if (result.success && result.data) {
      if (inputType === 'multiple') {
        if (result.data[answerField] && Array.isArray(result.data[answerField])) {
          setAnswer(result.data[answerField])
        }
      } else {
        setAnswer(result.data[answerField] || '')
      }
    }
  }

  const handleBack = () => {
    if (previousPath) {
      navigate(previousPath)
    } else {
      navigate('/1_King_of_Joseon/1_Start')
    }
  }

  const handleAnswerChange = (value, index = null) => {
    if (inputType === 'multiple' && index !== null) {
      const newAnswers = [...answer]
      newAnswers[index] = value
      setAnswer(newAnswers)
    } else {
      setAnswer(value)
    }
    setError('')
  }

  const handleSave = async () => {
    setError('')
    
    if (inputType === 'multiple') {
      const answerCheck = checkMultipleAnswers(activityId, answerField, answer)
      if (!answerCheck.correct) {
        setError(answerCheck.message)
        return
      }
    } else {
      if (!answer.trim()) {
        setError('답을 입력해주세요.')
        return
      }

      const answerCheck = checkAnswer(activityId, answerField, answer)
      if (!answerCheck.correct) {
        setError('다시 생각해보세요.')
        return
      }
    }

    const saveData = { [answerField]: answer }
    // user.email에서 학번 추출 (형식: {studentId}@student.local)
    const result = await saveActivityData(user.uid, activityId, saveData, questionData, user.email)
    
    if (result.success) {
      setSaved(true)
      setShowCorrectAnswer(true)
    } else {
      setError(result.error || '저장에 실패했습니다.')
    }
  }

  if (showCorrectAnswer) {
    return (
      <CorrectAnswer
        explanation={explanation}
        score={10}
        activityId={currentActivityId}
        userId={user.uid}
        userEmail={user.email}
        onReplay={() => {
          setShowCorrectAnswer(false)
          setSaved(false)
        }}
      />
    )
  }

  // CSS 클래스 결정
  const getCardClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-problem-card'
      if (customCss.includes('Ceiling')) return 'activity-seal-problem-card'
      if (customCss.includes('Clothing')) return 'activity-clothing-problem-card'
      if (customCss.includes('Nature')) return 'activity-nature-problem-card'
    }
    return 'activity-problem-card'
  }

  const getImageWrapperClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-image-wrapper'
      if (customCss.includes('Ceiling')) return 'activity-seal-image-wrapper'
      if (customCss.includes('Clothing')) return 'activity-clothing-image-wrapper'
      if (customCss.includes('Nature')) return 'activity-nature-image-wrapper'
    }
    return 'activity-image-wrapper'
  }

  const getImageClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-image'
      if (customCss.includes('Ceiling')) return 'activity-seal-image'
      if (customCss.includes('Clothing')) return 'activity-clothing-image'
      if (customCss.includes('Nature')) return 'activity-nature-image'
    }
    return 'activity-image'
  }

  const getOverlayClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-image-overlay'
      if (customCss.includes('Ceiling')) return 'activity-seal-image-overlay'
      if (customCss.includes('Clothing')) return 'activity-clothing-image-overlay'
      if (customCss.includes('Nature')) return 'activity-nature-image-overlay'
    }
    return 'activity-image-overlay'
  }

  const getBadgeClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-badge'
      if (customCss.includes('Ceiling')) return 'activity-seal-badge'
      if (customCss.includes('Clothing')) return 'activity-clothing-badge'
      if (customCss.includes('Nature')) return 'activity-nature-badge'
    }
    return 'activity-badge'
  }

  const getContentClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-content'
      if (customCss.includes('Ceiling')) return 'activity-seal-content'
      if (customCss.includes('Clothing')) return 'activity-clothing-content'
      if (customCss.includes('Nature')) return 'activity-nature-content'
    }
    return 'activity-content'
  }

  const getTitleClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-problem-title'
      if (customCss.includes('Ceiling')) return 'activity-seal-problem-title'
      if (customCss.includes('Clothing')) return 'activity-clothing-problem-title'
      if (customCss.includes('Nature')) return 'activity-nature-problem-title'
    }
    return 'activity-problem-title'
  }

  const getDividerClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-divider'
      if (customCss.includes('Ceiling')) return 'activity-seal-divider'
      if (customCss.includes('Clothing')) return 'activity-clothing-divider'
      if (customCss.includes('Nature')) return 'activity-nature-divider'
    }
    return 'activity-divider'
  }

  const getDescriptionClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-description'
      if (customCss.includes('Ceiling')) return 'activity-seal-description'
      if (customCss.includes('Clothing')) return 'activity-clothing-description'
      if (customCss.includes('Nature')) return 'activity-nature-description'
    }
    return 'activity-description'
  }

  const getErrorClass = () => {
    if (customCss) {
      if (customCss.includes('Seal')) return 'activity-seal-error'
      if (customCss.includes('Ceiling')) return 'activity-seal-error'
      if (customCss.includes('Clothing')) return 'activity-clothing-error'
      if (customCss.includes('Nature')) return 'activity-nature-error'
    }
    return 'activity-error'
  }

  const paddingBottom = inputType === 'multiple' ? '420px' : '180px'

  return (
    <div className="joseon-royal-court-start-container">
      <header className="joseon-royal-court-header">
        <button 
          className="joseon-royal-court-back-button"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="joseon-royal-court-header-title">{getExhibitionHallName()}</h2>
        <button className="joseon-royal-court-search-button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="joseon-royal-court-content" style={{ paddingBottom }}>
        <article className={getCardClass()} style={{ padding: '0 1rem', marginTop: '1rem' }}>
          <div className={getImageWrapperClass()}>
            <div 
              className={getImageClass()}
              style={{ 
                backgroundImage: `url(${image})`,
                ...imageStyle
              }}
            >
              <div className={getOverlayClass()}></div>
              <div className={getBadgeClass()}>
                <span>문제 {questionNumber}</span>
              </div>
            </div>
          </div>

          <div className={getContentClass()}>
            <h2 className={getTitleClass()}>{title}</h2>
            <div className={getDividerClass()}></div>
            <p className={getDescriptionClass()}>
              {description}
            </p>
          </div>
        </article>

        {error && (
          <div className={getErrorClass()}>
            {error}
          </div>
        )}
      </main>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40 }}>
        {inputType === 'multiple' ? (
          <ActivityFooter
            answerValue=""
            onAnswerChange={() => {}}
            onSubmit={handleSave}
            saved={saved}
            showAnswerInput={false}
          >
            <div className="activity-nature-inputs-container">
              {answer.map((item, index) => (
                <div key={index} className="activity-input-wrapper">
                  <label className="activity-input-label" htmlFor={`${answerField}-${index}`}>
                    {multipleLabels[index] || `${index + 1}번째`}
                  </label>
                  <div className="activity-input-icon-wrapper">
                    <span className="material-symbols-outlined activity-input-icon">edit_note</span>
                  </div>
                  <input
                    id={`${answerField}-${index}`}
                    name={`${answerField}-${index}`}
                    type="text"
                    value={item}
                    onChange={(e) => handleAnswerChange(e.target.value, index)}
                    placeholder={multipleLabels[index] || `${index + 1}번째`}
                    className="activity-answer-input"
                  />
                </div>
              ))}
            </div>
          </ActivityFooter>
        ) : (
          <ActivityFooter
            answerValue={answer}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSave}
            saved={saved}
            answerPlaceholder={answerPlaceholder}
            answerId={answerField}
          />
        )}
      </div>
    </div>
  )
}

export default QuestionPage

