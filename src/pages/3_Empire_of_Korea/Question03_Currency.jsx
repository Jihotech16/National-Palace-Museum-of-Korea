import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question03_Currency({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.currency} />
}

export default Question03_Currency


