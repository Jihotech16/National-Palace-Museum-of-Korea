import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'
import './Question03_Ceiling.css'

function Question03_Ceiling({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.ceiling} />
}

export default Question03_Ceiling
