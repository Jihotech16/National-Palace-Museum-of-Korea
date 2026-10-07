import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question06({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulGrowth06} />
}

export default Question06

