import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question02_Independence({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.independence} />
}

export default Question02_Independence

