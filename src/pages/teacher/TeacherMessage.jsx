import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { getClassMessagesForTeacher } from '../../firebase/firestore'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherMessage.css'
import './TeacherPage.css'

function TeacherMessage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('messages')
  const [teacherData, setTeacherData] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const savedTeacherData = localStorage.getItem('teacherData')
      if (savedTeacherData) {
        const data = JSON.parse(savedTeacherData)
        setTeacherData(data)
        const result = await getClassMessagesForTeacher(data.schoolCode, data.grade, data.classNum)
        setMessages(result.messages || [])
        setLoading(false)
      } else {
        navigate('/teacher-login')
      }
    } catch (error) {
      console.error('교사 데이터 로드 오류:', error)
    }
  }

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  const handleMessageClick = (message) => {
    navigate(`/teacher/messages/${message.id}`)
  }

  const handleHome = () => {
    navigate('/teacher')
  }

  const handleStudentProgress = () => {
    navigate('/teacher/class')
  }

  const handleStudentManagement = () => {
    navigate('/teacher/students')
  }

  const handleQuestionManagement = () => {
    setActiveTab('questions')
    navigate('/teacher/questions')
  }

  const handleEndActivity = () => {
    // 대시보드로 이동해 활동 종료 확인창을 바로 열기
    navigate('/teacher', { state: { openEndActivity: true } })
  }

  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('teacherData')
      localStorage.removeItem('teacherRemember')
      navigate('/teacher-login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  const handleComposeMessage = () => {
    navigate('/teacher/messages/compose')
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
    <div className="teacher-page">
      <div className="teacher-container">
        <header className="teacher-header">
          <button 
            className="teacher-header-btn"
            onClick={handleMenuClick}
            type="button"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="teacher-header-title">보낸 공지</h1>
          <button 
            className="teacher-header-btn teacher-header-btn-notification"
            onClick={() => navigate('/teacher/messages')}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="teacher-main">
          <div className="teacher-message-main">
          {loading ? (
            <div className="teacher-loading"><p>불러오는 중...</p></div>
          ) : messages.length === 0 ? (
            <div className="teacher-message-empty">
              <p>아직 보낸 공지가 없어요.</p>
              <p>오른쪽 아래 버튼으로 반 전체에 공지를 보낼 수 있어요.</p>
            </div>
          ) : Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="teacher-message-date-divider">
                <span className="teacher-message-date-badge">{date}</span>
              </div>
              {dateMessages.map((message) => (
                <article
                  key={message.id}
                  className="teacher-message-item"
                  onClick={() => handleMessageClick(message)}
                >
                  <div className="teacher-message-avatar">
                    <div className="teacher-message-avatar-image teacher-message-avatar-icon">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                  </div>
                  <div className="teacher-message-content">
                    <div className="teacher-message-header-row">
                      <h3 className="teacher-message-sender">반 전체 · 읽음 {message.readCount}명</h3>
                      <time className="teacher-message-time">{message.time}</time>
                    </div>
                    <p className="teacher-message-title-text">{message.title}</p>
                    <p className="teacher-message-content-text">{message.content}</p>
                  </div>
                </article>
              ))}
            </div>
          ))}
          </div>
          
          {/* 메시지 작성 버튼 */}
          <button 
            className="teacher-message-compose-btn"
            onClick={handleComposeMessage}
            type="button"
          >
            <span className="material-symbols-outlined">edit</span>
          </button>
        </main>

        {/* 사이드 메뉴 */}
        <div 
          className={`teacher-sidebar-overlay ${showSidebar ? 'active' : ''}`}
          onClick={handleCloseSidebar}
        >
        </div>
        <div className={`teacher-sidebar ${showSidebar ? 'active' : ''}`}>
          <div className="teacher-sidebar-header">
            <h2 className="teacher-sidebar-title">메뉴</h2>
            <button 
              className="teacher-sidebar-close"
              onClick={handleCloseSidebar}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="teacher-sidebar-content">
            <div className="teacher-sidebar-section">
              <h3 className="teacher-sidebar-section-title">빠른 이동</h3>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleHome()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span className="teacher-sidebar-item-label">홈</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleStudentProgress()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">monitoring</span>
                <span className="teacher-sidebar-item-label">진도 관리</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleStudentManagement()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">groups</span>
                <span className="teacher-sidebar-item-label">학생 관리</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleQuestionManagement()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">quiz</span>
                <span className="teacher-sidebar-item-label">문제 보기</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  navigate('/teacher/messages')
                }}
                type="button"
              >
                <span className="material-symbols-outlined">mail</span>
                <span className="teacher-sidebar-item-label">메시지</span>
              </button>
            </div>
            
            <div className="teacher-sidebar-section">
              <h3 className="teacher-sidebar-section-title">설정</h3>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  console.log('설정')
                }}
                type="button"
              >
                <span className="material-symbols-outlined">settings</span>
                <span className="teacher-sidebar-item-label">설정</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleEndActivity()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">stop_circle</span>
                <span className="teacher-sidebar-item-label">활동 종료</span>
              </button>
              <button 
                className="teacher-sidebar-item"
                onClick={() => {
                  handleCloseSidebar()
                  handleLogout()
                }}
                type="button"
              >
                <span className="material-symbols-outlined">logout</span>
                <span className="teacher-sidebar-item-label">로그아웃</span>
              </button>
            </div>
          </div>
          
          <div className="teacher-sidebar-footer">
            {teacherData && (
              <div className="teacher-sidebar-profile">
                <div className="teacher-sidebar-profile-info">
                  <p className="teacher-sidebar-profile-name">
                    {teacherData.schoolName || '선생님'}
                  </p>
                  <p className="teacher-sidebar-profile-class">
                    {formatTeacherGroupLabel(teacherData)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <nav className="teacher-nav">
          <div className="teacher-nav-content">
            <button
              className={`teacher-nav-item ${activeTab === 'home' ? 'teacher-nav-item-active' : ''}`}
              onClick={handleHome}
              type="button"
            >
              <span className={`material-symbols-outlined ${activeTab === 'home' ? 'filled' : ''}`}>dashboard</span>
              <span className="teacher-nav-label">홈</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'progress' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('progress')
                handleStudentProgress()
              }}
              type="button"
            >
              <span className={`material-symbols-outlined ${activeTab === 'progress' ? 'filled' : ''}`}>monitoring</span>
              <span className="teacher-nav-label">진도 관리</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'students' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('students')
                handleStudentManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="teacher-nav-label">학생 관리</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'questions' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('questions')
                handleQuestionManagement()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">quiz</span>
              <span className="teacher-nav-label">문제 보기</span>
            </button>
            <button
              className={`teacher-nav-item ${activeTab === 'end' ? 'teacher-nav-item-active' : ''}`}
              onClick={() => {
                setActiveTab('end')
                handleEndActivity()
              }}
              type="button"
            >
              <span className="material-symbols-outlined">stop_circle</span>
              <span className="teacher-nav-label">활동 종료</span>
            </button>
            <button
              className="teacher-nav-item teacher-nav-item-logout"
              onClick={handleLogout}
              type="button"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="teacher-nav-label">로그아웃</span>
            </button>
          </div>
          <div className="teacher-nav-spacer"></div>
        </nav>
      </div>
    </div>
  )
}

export default TeacherMessage

