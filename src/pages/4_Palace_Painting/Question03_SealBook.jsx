import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question03_SealBook({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.sealBook} />
}

export default Question03_SealBook

