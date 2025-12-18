import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question01_Empire({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.empire} />
}

export default Question01_Empire


