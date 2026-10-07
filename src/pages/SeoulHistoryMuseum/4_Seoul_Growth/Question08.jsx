import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question08({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulGrowth08} />
}

export default Question08

