import QuestionPage from '../../../components/QuestionPage'
import { QUESTION_DATA } from '../../../data/questions'

function Question05({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seoulGrowth05} />
}

export default Question05

