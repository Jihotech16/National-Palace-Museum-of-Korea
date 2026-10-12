import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import StudentLayout from '../components/StudentLayout'
import { openClassMessageForStudent } from '../firebase/firestore'
import './StudentMessageDetail.css'

function StudentMessageDetail({ user }) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    // 공지를 열면 읽음으로 표시됨
    openClassMessageForStudent(messageId).then((result) => {
      if (result.success && result.message) {
        setMessage(result.message)
        setLoading(false)
      } else {
        // 메시지를 찾을 수 없으면 목록으로 돌아가기
        navigate('/student/messages', { replace: true })
      }
    })
  }, [messageId, user, navigate])

  if (loading || !message) {
    return (
      <StudentLayout title="메시지 상세" backPath="/student/messages" showMessageButton={false}>
        <div className="student-message-detail-loading">
          <p>메시지를 불러오는 중...</p>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout title="메시지 상세" backPath="/student/messages" showMessageButton={false}>
      <main className="student-message-detail-main">
          <div className="student-message-detail-card">
            <div className="student-message-detail-header-section">
              <div className="student-message-detail-avatar">
                <div className="student-message-detail-avatar-image student-message-detail-avatar-icon">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
              </div>
              <div className="student-message-detail-sender-info">
                <span className="student-message-detail-sender-label">보낸 사람</span>
                <h2 className="student-message-detail-sender-name">{message.senderName}</h2>
                <time className="student-message-detail-time">{message.fullDate} {message.time}</time>
              </div>
            </div>
            <div className="student-message-detail-divider"></div>
            <div className="student-message-detail-content">
              <h3 className="student-message-detail-title">{message.title}</h3>
              <div className="student-message-detail-body">
                {message.content.split('\n').map((paragraph, index) => {
                  // **텍스트**를 <strong>으로 변환
                  const parts = paragraph.split(/(\*\*.*?\*\*)/g)
                  return (
                    <p key={index}>
                      {parts.map((part, partIndex) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <strong key={partIndex}>{part.slice(2, -2)}</strong>
                        }
                        return <span key={partIndex}>{part}</span>
                      })}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
    </StudentLayout>
  )
}

export default StudentMessageDetail

