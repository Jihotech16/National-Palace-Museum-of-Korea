import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question21({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulJoseon21} />
}

export default Question21
