import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getClassMessagesForStudent } from '../firebase/firestore'
import StudentLayout from '../components/StudentLayout'
import './StudentMessage.css'

function StudentMessage({ user }) {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadMessages()
  }, [user, navigate])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const result = await getClassMessagesForStudent()
      if (result.success) {
        setMessages(result.messages || [])
      } else {
        console.error('메시지 로드 오류:', result.error)
        setMessages([])
      }
    } catch (error) {
      console.error('메시지 로드 오류:', error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  // 읽음 표시는 상세 화면을 열 때 처리
  const handleMessageClick = (message) => {
    navigate(`/student/messages/${message.id}`)
  }

  // 날짜별로 메시지 그룹화
  const groupedMessages = messages.reduce((acc, message) => {
    const date = message.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(message)
    return acc
  }, {})

  return (
    <StudentLayout 
      title="수신 메시지함" 
      backPath="/exhibition-hall-list"
      showMessageButton={false}
    >
      <main className="student-message-main">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>메시지를 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>선생님이 보낸 공지가 아직 없어요.</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="student-message-date-divider">
                <span className="student-message-date-badge">{date}</span>
              </div>
              {dateMessages.map((message) => (
                <article
                  key={message.id}
                  className={`student-message-item ${message.unread ? 'student-message-item-unread' : ''} ${date === '어제' ? 'student-message-item-old' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  {message.unread && (
                    <div className="student-message-unread-indicator"></div>
                  )}
                  <div className="student-message-avatar">
                    <div className="student-message-avatar-image student-message-avatar-icon">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                  </div>
                  <div className="student-message-content">
                    <div className="student-message-header-row">
                      <h3 className="student-message-sender">{message.senderName}</h3>
                      <time className={`student-message-time ${message.unread ? 'student-message-time-unread' : ''}`}>
                        {message.time}
                      </time>
                    </div>
                    <p className="student-message-title-text">{message.title}</p>
                    <p className="student-message-content-text">{message.content}</p>
                  </div>
                </article>
              ))}
            </div>
          ))
          )}
        </main>

      </StudentLayout>
  )
}

export default StudentMessage

