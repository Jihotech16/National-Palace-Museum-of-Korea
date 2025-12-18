import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'
import './Question04_Clothing.css'

function Question04_Clothing({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.clothing} />
}

export default Question04_Clothing

