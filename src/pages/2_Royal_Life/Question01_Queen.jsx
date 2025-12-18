import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question01_Queen({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.queenSymbol} />
}

export default Question01_Queen


