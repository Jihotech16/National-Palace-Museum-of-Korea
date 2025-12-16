// 활동지별 정답 정의
export const ANSWERS = {
  nature: {
    artifactName: '일월오봉도',
    natures: ['해', '달', '물', '소나무', '산봉우리'] // 일월오봉도에 그려진 다섯 가지 자연물
  },
  seal: {
    sealAnswer: '의례' // 어보는 조선왕실의 의례를 위해 제작된 인장
  }
  // 다른 활동지의 정답도 여기에 추가 가능
}

// 여러 정답 체크 (순서 무관)
export const checkMultipleAnswers = (activityId, fieldName, userAnswers) => {
  const correctAnswers = ANSWERS[activityId]?.[fieldName]
  if (!correctAnswers || !Array.isArray(correctAnswers)) {
    return { correct: true } // 정답이 정의되지 않은 경우 통과
  }
  
  // 사용자 답변 정규화 (대소문자, 공백 제거)
  const normalizedUserAnswers = userAnswers
    .map(answer => answer.replace(/\s+/g, '').toLowerCase())
    .filter(answer => answer.length > 0)
  
  // 정답 정규화
  const normalizedCorrectAnswers = correctAnswers
    .map(answer => answer.replace(/\s+/g, '').toLowerCase())
  
  // 모든 정답이 입력되었는지 확인
  if (normalizedUserAnswers.length !== normalizedCorrectAnswers.length) {
    return {
      correct: false,
      message: `5가지 자연물을 모두 입력해주세요.`
    }
  }
  
  // 각 정답이 포함되어 있는지 확인 (순서 무관)
  const missingAnswers = []
  normalizedCorrectAnswers.forEach(correctAnswer => {
    if (!normalizedUserAnswers.includes(correctAnswer)) {
      missingAnswers.push(correctAnswer)
    }
  })
  
  if (missingAnswers.length > 0) {
    return {
      correct: false,
      message: `정답이 아닙니다. 다시 확인해보세요.`
    }
  }
  
  return { correct: true }
}

// 정답 체크 함수 (대소문자, 공백 무시)
export const checkAnswer = (activityId, fieldName, userAnswer) => {
  const answer = ANSWERS[activityId]?.[fieldName]
  if (!answer) return { correct: true } // 정답이 정의되지 않은 경우 통과
  
  // 대소문자, 공백 제거 후 비교
  const normalizedAnswer = answer.replace(/\s+/g, '').toLowerCase()
  const normalizedUserAnswer = userAnswer.replace(/\s+/g, '').toLowerCase()
  
  if (normalizedUserAnswer === normalizedAnswer) {
    return { correct: true }
  } else {
    return { 
      correct: false, 
      message: `정답이 아닙니다. 다시 확인해보세요.` 
    }
  }
}

