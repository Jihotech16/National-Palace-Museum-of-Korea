import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question01({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulColonial01} />
}

export default Question01

