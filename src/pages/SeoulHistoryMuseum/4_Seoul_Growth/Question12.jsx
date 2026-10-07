import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question12({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulGrowth12} />
}

export default Question12

