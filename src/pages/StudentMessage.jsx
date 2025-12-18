import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { getClassMessagesForStudent, markMessageAsRead } from '../firebase/firestore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
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
      // user 객체에서 email을 가져오거나, user 자체가 email 문자열일 수 있음
      const userEmail = user?.email || user
      const result = await getClassMessagesForStudent(userEmail)
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

  const handleMessageClick = async (message) => {
    // 메시지 읽음 처리
    const userEmail = user?.email || user
    if (message.unread && userEmail) {
      try {
        // userEmail에서 학번 추출
        const studentId = userEmail.replace('@student.local', '')
        
        // 학생 정보에서 classId 가져오기
        const userRef = doc(db, 'users', studentId)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const { schoolCode, grade, classNum } = userData
          const classId = `${schoolCode}-${grade}-${classNum}`
          
          // 읽음 처리
          await markMessageAsRead(message.id, classId, studentId)
          
          // 로컬 상태 업데이트
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === message.id ? { ...msg, unread: false } : msg
            )
          )
        }
      } catch (error) {
        console.error('메시지 읽음 처리 오류:', error)
      }
    }
    
    navigate(`/student/messages/${message.id}`)
  }

  const handleBack = () => {
    navigate('/exhibition-hall-list')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleComposeMessage = () => {
    navigate('/student/messages/compose')
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
    <div className="student-message-page">
      <div className="student-message-container">
        <header className="student-message-header">
          <button 
            className="student-message-header-btn student-message-back-button"
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="student-message-header-title">수신 메시지함</h1>
          <button 
            className="student-message-header-btn student-message-header-btn-notification"
            onClick={() => navigate('/student/messages')}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="student-message-main">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>메시지를 불러오는 중...</p>
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>받은 메시지가 없습니다.</p>
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
                    <div 
                      className="student-message-avatar-image"
                      style={{ backgroundImage: `url(${message.avatar})` }}
                    ></div>
                    {message.senderType === 'teacher' && (
                      <div className="student-message-avatar-badge student-message-avatar-badge-teacher">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                    )}
                    {message.senderType === 'system' && (
                      <div className="student-message-avatar-badge student-message-avatar-badge-system">
                        <span className="material-symbols-outlined">settings</span>
                      </div>
                    )}
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

        {/* 메시지 작성 버튼 */}
        <button 
          className="student-message-compose-btn"
          onClick={handleComposeMessage}
          type="button"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>

        <nav className="student-message-navbar">
          <button 
            className="student-message-nav-item"
            onClick={() => navigate('/exhibition-hall-list')}
          >
            <span className="material-symbols-outlined">museum</span>
            <span>전시관</span>
          </button>
          <button className="student-message-nav-item active">
            <span className="material-symbols-outlined">mail</span>
            <span>메시지</span>
          </button>
          <button 
            className="student-message-nav-item"
            onClick={() => navigate('/student-clear')}
          >
            <span className="material-symbols-outlined">verified</span>
            <span>수료증 확인</span>
          </button>
          <button 
            className="student-message-nav-item"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            <span>로그아웃</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default StudentMessage

