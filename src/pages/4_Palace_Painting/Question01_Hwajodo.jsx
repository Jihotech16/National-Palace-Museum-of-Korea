import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question01_Hwajodo({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.hwajodo} />
}

export default Question01_Hwajodo


