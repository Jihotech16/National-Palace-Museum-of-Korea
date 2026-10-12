import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { getClassMessageForTeacher, deleteClassMessage } from '../../firebase/firestore'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherMessageDetail.css'
import './TeacherPage.css'

function TeacherMessageDetail() {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [activeTab, setActiveTab] = useState('messages')
  const [teacherData, setTeacherData] = useState(null)
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)

  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const savedTeacherData = localStorage.getItem('teacherData')
    if (!savedTeacherData) {
      navigate('/teacher-login')
      return
    }
    const data = JSON.parse(savedTeacherData)
    setTeacherData(data)
    getClassMessageForTeacher(data.schoolCode, data.grade, data.classNum, messageId).then((result) => {
      if (result.success && result.message) {
        setMessage(result.message)
        setLoading(false)
      } else {
        // 메시지를 찾을 수 없으면 목록으로 돌아가기
        navigate('/teacher/messages', { replace: true })
      }
    })
  }, [messageId, navigate])

  const handleBack = () => {
    navigate('/teacher/messages')
  }

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  const handleDelete = async () => {
    if (!teacherData || !window.confirm('이 공지를 삭제할까요? 학생 화면에서도 사라집니다.')) return
    setDeleting(true)
    const result = await deleteClassMessage(teacherData.schoolCode, teacherData.grade, teacherData.classNum, messageId)
    if (result.success) {
      navigate('/teacher/messages', { replace: true })
    } else {
      setDeleting(false)
      alert('공지를 삭제하지 못했습니다.')
    }
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

  if (loading || !message) {
    return (
      <div className="teacher-page">
        <div className="teacher-container">
          <div className="teacher-loading">
            <p>메시지를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="teacher-page">
      <div className="teacher-container">
        <header className="teacher-header">
          <button 
            className="teacher-header-btn"
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="teacher-header-title">메시지 상세</h1>
          <div className="teacher-header-btn" style={{ visibility: 'hidden' }}>
            <span className="material-symbols-outlined">mail</span>
          </div>
        </header>

        <main className="teacher-main">
          <div className="teacher-message-detail-card">
            <div className="teacher-message-detail-header">
              <div className="teacher-message-detail-avatar">
                <div className="teacher-message-detail-avatar-image teacher-message-detail-avatar-icon">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
              </div>
              <div className="teacher-message-detail-sender-info">
                <span className="teacher-message-detail-sender-label">받는 사람</span>
                <h2 className="teacher-message-detail-sender-name">
                  {teacherData ? formatTeacherGroupLabel(teacherData) : '반'} 전체 · 읽음 {message.readCount}명
                </h2>
                <time className="teacher-message-detail-time">{message.fullDate} {message.time}</time>
              </div>
            </div>
            <div className="teacher-message-detail-divider"></div>
            <div className="teacher-message-detail-content">
              <h3 className="teacher-message-detail-title">{message.title}</h3>
              <div className="teacher-message-detail-body">
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
            <div className="teacher-message-detail-action">
              <button
                className="teacher-message-detail-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
                type="button"
              >
                <span className="material-symbols-outlined">delete</span>
                <span>{deleting ? '삭제하는 중...' : '공지 삭제'}</span>
              </button>
            </div>
          </div>
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

export default TeacherMessageDetail

