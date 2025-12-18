import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question11_Age({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.age} />
}

export default Question11_Age

