import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question10_Exam({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.exam} />
}

export default Question10_Exam

