import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question02({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulJoseon02} />
}

export default Question02

