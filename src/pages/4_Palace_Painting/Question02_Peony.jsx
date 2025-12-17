import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question02_Peony({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.peony} />
}

export default Question02_Peony

