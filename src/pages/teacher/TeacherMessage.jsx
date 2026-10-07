import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../firebase/auth'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherMessage.css'
import './TeacherPage.css'

function TeacherMessage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('messages')
  const [teacherData, setTeacherData] = useState(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: '1',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '근정전 미션 힌트 도착! 🕵️',
      content: '근정전의 월대에는 사방신이 조각되어 있습니다. 남쪽을 지키는 동물은 무엇일까요? 힌트를 확인하고 정답을 입력하세요.',
      time: '14:05',
      date: '오늘',
      unread: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdMahZwk3CKqk_U4LTnQjEW9g0Ny_C3zbIMZrpZRtM7EMABGf6afEQ8hz3VkX7fgE8Qs66kgjFLw9bpl0PQzmFnSPU92YWkkspsGPFbrdFKAXct2oHc_ZSX8uhc24-3Yepj525DdT3HSI8A7k9nUiN01COPM24tbkv4XuOE90smcjTh2LS1LU7RXQfDb5HwB-d6b4uCS8-a1BHj0k1dTYW_m3wb3vncRdnczH7UTKMd5IbEdpdZmvkmfQLDQXXwISCRv_rhdrFzeJX'
    },
    {
      id: '2',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '📢 모임 장소 변경 안내',
      content: '현재 근정전 앞이 매우 혼잡합니다. 3조 학생들은 1층 로비가 아닌 경회루 앞 벤치로 14:30까지 모여주세요.',
      time: '13:30',
      date: '오늘',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSsAS4NS_-0_uAO-qADVvhJNjvN5goq1zPVdNjDHolS25A7CR6-aREWy2lxGiAmydzTRpYNUMcfwKbGg86mwVCxQs8imneHp_7PvS8SflYe8nvOmcAMRrDwV5fKCaYe4ufFP3UL7Nrv4ous3m2J9bbVgRWWq608vLfHve54bpASmc1cqL8vhzpiR50riHo5j5LklrH1ExAGd2-Bt3JWAkS8qN2zHBd3TCbRS5Hrv-UUXjXZjQ9VD1GdrIwClDajnw8egX_ufHjrW4C'
    },
    {
      id: '3',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '박물관 관람 에티켓 🤫',
      content: '박물관 내에서는 뛰지 않고 조용히 관람해주세요. 사진 촬영 시 플래시는 꺼주시기 바랍니다. 즐거운 관람 되세요!',
      time: '09:00',
      date: '오늘',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc_e2Y6VXcKfAlB_G96NC5N_y_9APaO8iA6H5AwxLNIMOTp4WivcsvKy7TOFCOHdAchsjGfQcaVCgK_L7hxMvemUSQsCf-4gIOp_UTyBrY1wpH8to5CojlqnucGku_hWXbpWTLtIbcjKQXY7l3XMz8MsYtD860FXM8ly1hA2nk6c1DrSg1pku7gRIaJBybNzhs1lpPCrs5BeotU3Y_k_3OKowNajSPOfCanQPO0gYokvejx0NsNVqZwymD6uzjnAAXwMHSHs0R7yYj'
    },
    {
      id: '4',
      senderName: '시스템 알림',
      senderType: 'system',
      title: '앱 업데이트 안내',
      content: '원활한 미션 수행을 위해 최신 버전으로 업데이트 해주세요.',
      time: '18:00',
      date: '어제',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo92I3DGyOBFmvMQGRc8eNC6M15bIPzGjpJ9B_qzc4_QI-IM8C7iOW6jC4pveM-qhHfhzTBmSHTd1-OynulEKfxG0BfQUdc6CODet4f8iiumR-93Vnf7vgInPKSlkNoHMPBhJccY_ceRfFHAvoT2R2wM7CN7o5AwAGuqVeTG0ORvSDa96FOiOl87MOSIXCWOAZc7JDlA-c8ZedQCey_2at12kZGO5zQXLIPScueAoPAYpQsyiSG1P3Wt6Ocq5q5wHpMi5jbQQ4PIS3'
    }
  ])

  useEffect(() => {
    loadTeacherData()
  }, [])

  const loadTeacherData = async () => {
    try {
      const savedTeacherData = localStorage.getItem('teacherData')
      if (savedTeacherData) {
        const data = JSON.parse(savedTeacherData)
        setTeacherData(data)
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
          <h1 className="teacher-header-title">수신 메시지함</h1>
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
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="teacher-message-date-divider">
                <span className="teacher-message-date-badge">{date}</span>
              </div>
              {dateMessages.map((message) => (
                <article
                  key={message.id}
                  className={`teacher-message-item ${message.unread ? 'teacher-message-item-unread' : ''} ${date === '어제' ? 'teacher-message-item-old' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  {message.unread && (
                    <div className="teacher-message-unread-indicator"></div>
                  )}
                  <div className="teacher-message-avatar">
                    <div 
                      className="teacher-message-avatar-image"
                      style={{ backgroundImage: `url(${message.avatar})` }}
                    ></div>
                    {message.senderType === 'teacher' && (
                      <div className="teacher-message-avatar-badge teacher-message-avatar-badge-teacher">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                    )}
                    {message.senderType === 'system' && (
                      <div className="teacher-message-avatar-badge teacher-message-avatar-badge-system">
                        <span className="material-symbols-outlined">settings</span>
                      </div>
                    )}
                  </div>
                  <div className="teacher-message-content">
                    <div className="teacher-message-header-row">
                      <h3 className="teacher-message-sender">{message.senderName}</h3>
                      <time className={`teacher-message-time ${message.unread ? 'teacher-message-time-unread' : ''}`}>
                        {message.time}
                      </time>
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

