import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question03({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulGrowth03} />
}

export default Question03

