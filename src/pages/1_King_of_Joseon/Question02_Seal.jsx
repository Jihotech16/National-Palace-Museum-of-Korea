import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'
import './Question02_Seal.css'

function Question02_Seal({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.seal} />
}

export default Question02_Seal
