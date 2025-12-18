import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question01_King({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.sealKing} />
}

export default Question01_King

