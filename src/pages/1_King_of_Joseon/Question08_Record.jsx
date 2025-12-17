import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question08_Record({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.record} />
}

export default Question08_Record
