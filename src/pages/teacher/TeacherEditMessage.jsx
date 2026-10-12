import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { getTeacherStudents, sendClassMessage, RETENTION_DAYS } from '../../firebase/firestore'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherEditMessage.css'
import './TeacherPage.css'

function TeacherEditMessage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('messages')
  const [teacherData, setTeacherData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  const [charCount, setCharCount] = useState(0)
  const maxCharCount = 500

  useEffect(() => {
    loadTeacherData()
  }, [])

  useEffect(() => {
    setCharCount(formData.content.length)
  }, [formData.content])

  const loadTeacherData = async () => {
    try {
      const savedTeacherData = localStorage.getItem('teacherData')
      if (savedTeacherData) {
        const data = JSON.parse(savedTeacherData)
        setTeacherData(data)
        await loadStudents(data.schoolCode, data.grade, data.classNum)
      } else {
        navigate('/teacher-login')
      }
    } catch (error) {
      console.error('교사 데이터 로드 오류:', error)
      setLoading(false)
    }
  }

  const loadStudents = async (schoolCode, grade, classNum) => {
    try {
      setLoading(true)
      const result = await getTeacherStudents(schoolCode, grade, classNum)
      if (result.success) {
        setStudents(result.students)
      }
      setLoading(false)
    } catch (error) {
      console.error('학생 목록 로드 오류:', error)
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/teacher/messages')
  }

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value })
  }

  const handleContentChange = (e) => {
    const value = e.target.value
    if (value.length <= maxCharCount) {
      setFormData({ ...formData, content: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!teacherData || sending) return
    setSending(true)
    setSendError('')
    const result = await sendClassMessage(
      teacherData.schoolCode,
      teacherData.grade,
      teacherData.classNum,
      formData.title,
      formData.content
    )
    if (result.success) {
      navigate('/teacher/messages')
    } else {
      setSendError('공지를 보내지 못했습니다. 잠시 후 다시 시도해주세요.')
      setSending(false)
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

  // 받는 사람: 반 전체 공지만 지원
  const recipientLabel = teacherData
    ? `${formatTeacherGroupLabel(teacherData)} 전체 (${students.length}명)`
    : '반 전체'


  return (
    <div className="teacher-page">
      <div className="teacher-container">
        <header className="teacher-header">
          <button 
            className="teacher-header-btn"
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back_ios_new</span>
          </button>
          <h1 className="teacher-header-title">공지 보내기</h1>
          <button 
            className="teacher-header-btn teacher-header-btn-notification"
            onClick={() => navigate('/teacher/messages')}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

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

        <main className="teacher-main">
          <form className="teacher-edit-message-form" onSubmit={handleSubmit}>
            {/* 받는 사람 선택 */}
            <div className="teacher-edit-message-card">
              <span className="teacher-edit-message-label">받는 사람</span>
              <div className="teacher-edit-message-select teacher-edit-message-recipient">
                {recipientLabel}
              </div>
              <p className="teacher-edit-message-hint">
                <span className="material-symbols-outlined">info</span>
                학생 공지함에 표시되고, {RETENTION_DAYS}일 뒤 자동으로 지워져요.
              </p>
            </div>

            {/* 제목 및 내용 */}
            <div className="teacher-edit-message-card teacher-edit-message-content-card">
              <div className="teacher-edit-message-title-section">
                <label className="teacher-edit-message-label" htmlFor="title">
                  제목
                </label>
                <input
                  id="title"
                  type="text"
                  className="teacher-edit-message-title-input"
                  placeholder="제목을 입력하세요"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>
              
              <div className="teacher-edit-message-content-section">
                <label className="sr-only" htmlFor="content">내용</label>
                <textarea
                  id="content"
                  className="teacher-edit-message-content-textarea"
                  placeholder="학생들에게 전달할 메시지 내용을 입력하세요.&#10;예: 힌트 제공, 집합 장소 안내, 격려의 말 등"
                  value={formData.content}
                  onChange={handleContentChange}
                  rows={10}
                />
                
                <div className="teacher-edit-message-toolbar">
                  <div className="teacher-edit-message-tool-spacer"></div>
                  <span className="teacher-edit-message-char-count">
                    {charCount}/{maxCharCount}
                  </span>
                </div>
              </div>
            </div>

            {sendError && <p className="teacher-edit-message-error">{sendError}</p>}

            {/* 전송 버튼 */}
            <div className="teacher-edit-message-submit-section">
              <button 
                type="submit"
                className="teacher-edit-message-submit-btn"
                disabled={sending || !formData.title.trim() || !formData.content.trim()}
              >
                <span>{sending ? '보내는 중...' : '공지 보내기'}</span>
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </form>
        </main>

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

export default TeacherEditMessage

