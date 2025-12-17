import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question01_FiveRites({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.fiveRites} />
}

export default Question01_FiveRites

