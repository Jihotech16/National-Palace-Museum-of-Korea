import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../firebase/auth'
import { getTeacherStudents } from '../firebase/firestore'
import './TeacherEditMessage.css'
import './TeacherPage.css'

function TeacherEditMessage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('messages')
  const [teacherData, setTeacherData] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [formData, setFormData] = useState({
    recipient: 'class_all',
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

  const handleRecipientChange = (e) => {
    setFormData({ ...formData, recipient: e.target.value })
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
    // 메시지 전송 로직 (추후 구현)
    console.log('메시지 전송:', formData)
    // 전송 후 메시지 목록으로 이동
    navigate('/teacher/messages')
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
    // 활동 종료 (추후 구현)
    console.log('활동 종료')
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

  // 받는 사람 옵션 생성
  const recipientOptions = [
    { 
      value: 'class_all', 
      label: teacherData ? `${teacherData.grade}학년 ${teacherData.classNum}반 전체 (${students.length}명)` : '전체',
      type: 'class'
    },
    ...students.map(student => ({
      value: student.studentId,
      label: `${student.number}번 ${student.name || student.studentId}`,
      type: 'student'
    }))
  ]

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
          <h1 className="teacher-header-title">메시지 보내기</h1>
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
                    {teacherData.grade}학년 {teacherData.classNum}반
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
              <label className="teacher-edit-message-label" htmlFor="recipient">
                받는 사람
              </label>
              <div className="teacher-edit-message-select-wrapper">
                <select
                  id="recipient"
                  className="teacher-edit-message-select"
                  value={formData.recipient}
                  onChange={handleRecipientChange}
                >
                  {recipientOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="teacher-edit-message-select-arrow material-symbols-outlined">
                  arrow_drop_down
                </span>
              </div>
              <p className="teacher-edit-message-hint">
                <span className="material-symbols-outlined">info</span>
                선택한 대상에게 푸시 알림이 함께 전송됩니다.
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
                  <button 
                    type="button"
                    className="teacher-edit-message-tool-btn"
                    onClick={() => console.log('이미지 추가')}
                  >
                    <span className="material-symbols-outlined">image</span>
                  </button>
                  <button 
                    type="button"
                    className="teacher-edit-message-tool-btn"
                    onClick={() => console.log('링크 추가')}
                  >
                    <span className="material-symbols-outlined">add_link</span>
                  </button>
                  <button 
                    type="button"
                    className="teacher-edit-message-tool-btn"
                    onClick={() => console.log('이모지 추가')}
                  >
                    <span className="material-symbols-outlined">sentiment_satisfied</span>
                  </button>
                  <div className="teacher-edit-message-tool-spacer"></div>
                  <span className="teacher-edit-message-char-count">
                    {charCount}/{maxCharCount}
                  </span>
                </div>
              </div>
            </div>

            {/* 전송 버튼 */}
            <div className="teacher-edit-message-submit-section">
              <button 
                type="submit"
                className="teacher-edit-message-submit-btn"
                disabled={!formData.title.trim() || !formData.content.trim()}
              >
                <span>메시지 전송하기</span>
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
