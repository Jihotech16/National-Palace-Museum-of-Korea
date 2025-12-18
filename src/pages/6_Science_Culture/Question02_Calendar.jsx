import QuestionPage from '../../components/QuestionPage'
import { QUESTION_DATA } from '../../data/questions'

function Question02_Calendar({ user }) {
  return <QuestionPage user={user} questionData={QUESTION_DATA.calendar} />
}

export default Question02_Calendar


