import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'
import './Question05_Nature.css'

function Question05_Nature({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.nature} />
}

export default Question05_Nature

