import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question09_Politics({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.politics} />
}

export default Question09_Politics

