import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question06_Education({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.sealAnimal} />
}

export default Question06_Education
