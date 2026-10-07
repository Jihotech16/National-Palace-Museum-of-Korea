import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { logout } from '../../firebase/auth'
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

  // 임시 메시지 데이터 (실제로는 messageId로 조회)
  const mockMessages = {
    '1': {
      id: '1',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '근정전 미션 힌트 도착! 🕵️',
      content: `안녕하세요, 3조 학생 여러분! 👋

현재 여러분이 탐험하고 있는 근정전의 월대에는 사방신이 조각되어 있습니다. 동, 서, 남, 북 각 방향을 지키는 동물들이 있는데, 그 중에서 **'남쪽'**을 지키는 동물은 무엇일까요?

힌트를 잘 확인하고 아래 미션 탭에서 정답을 입력해주세요. 친구들과 상의해서 맞춰보세요! 화이팅! 🚀`,
      hint: '이 동물은 붉은 색을 상징하며, 불을 다스리는 상상의 새입니다. 닭과 비슷하게 생겼지만 훨씬 화려해요!',
      time: '14:05',
      date: '2023.10.24',
      fullDateTime: '2023.10.24 14:05',
      unread: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdMahZwk3CKqk_U4LTnQjEW9g0Ny_C3zbIMZrpZRtM7EMABGf6afEQ8hz3VkX7fgE8Qs66kgjFLw9bpl0PQzmFnSPU92YWkkspsGPFbrdFKAXct2oHc_ZSX8uhc24-3Yepj525DdT3HSI8A7k9nUiN01COPM24tbkv4XuOE90smcjTh2LS1LU7RXQfDb5HwB-d6b4uCS8-a1BHj0k1dTYW_m3wb3vncRdnczH7UTKMd5IbEdpdZmvkmfQLDQXXwISCRv_rhdrFzeJX'
    },
    '2': {
      id: '2',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '📢 모임 장소 변경 안내',
      content: '현재 근정전 앞이 매우 혼잡합니다. 3조 학생들은 1층 로비가 아닌 경회루 앞 벤치로 14:30까지 모여주세요.',
      time: '13:30',
      date: '2023.10.24',
      fullDateTime: '2023.10.24 13:30',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSsAS4NS_-0_uAO-qADVvhJNjvN5goq1zPVdNjDHolS25A7CR6-aREWy2lxGiAmydzTRpYNUMcfwKbGg86mwVCxQs8imneHp_7PvS8SflYe8nvOmcAMRrDwV5fKCaYe4ufFP3UL7Nrv4ous3m2J9bbVgRWWq608vLfHve54bpASmc1cqL8vhzpiR50riHo5j5LklrH1ExAGd2-Bt3JWAkS8qN2zHBd3TCbRS5Hrv-UUXjXZjQ9VD1GdrIwClDajnw8egX_ufHjrW4C'
    },
    '3': {
      id: '3',
      senderName: '담임 선생님',
      senderType: 'teacher',
      title: '박물관 관람 에티켓 🤫',
      content: '박물관 내에서는 뛰지 않고 조용히 관람해주세요. 사진 촬영 시 플래시는 꺼주시기 바랍니다. 즐거운 관람 되세요!',
      time: '09:00',
      date: '2023.10.24',
      fullDateTime: '2023.10.24 09:00',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCc_e2Y6VXcKfAlB_G96NC5N_y_9APaO8iA6H5AwxLNIMOTp4WivcsvKy7TOFCOHdAchsjGfQcaVCgK_L7hxMvemUSQsCf-4gIOp_UTyBrY1wpH8to5CojlqnucGku_hWXbpWTLtIbcjKQXY7l3XMz8MsYtD860FXM8ly1hA2nk6c1DrSg1pku7gRIaJBybNzhs1lpPCrs5BeotU3Y_k_3OKowNajSPOfCanQPO0gYokvejx0NsNVqZwymD6uzjnAAXwMHSHs0R7yYj'
    },
    '4': {
      id: '4',
      senderName: '시스템 알림',
      senderType: 'system',
      title: '앱 업데이트 안내',
      content: '원활한 미션 수행을 위해 최신 버전으로 업데이트 해주세요.',
      time: '18:00',
      date: '2023.10.23',
      fullDateTime: '2023.10.23 18:00',
      unread: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo92I3DGyOBFmvMQGRc8eNC6M15bIPzGjpJ9B_qzc4_QI-IM8C7iOW6jC4pveM-qhHfhzTBmSHTd1-OynulEKfxG0BfQUdc6CODet4f8iiumR-93Vnf7vgInPKSlkNoHMPBhJccY_ceRfFHAvoT2R2wM7CN7o5AwAGuqVeTG0ORvSDa96FOiOl87MOSIXCWOAZc7JDlA-c8ZedQCey_2at12kZGO5zQXLIPScueAoPAYpQsyiSG1P3Wt6Ocq5q5wHpMi5jbQQ4PIS3'
    }
  }

  useEffect(() => {
    loadTeacherData()
    loadMessage()
  }, [messageId])

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

  const loadMessage = () => {
    // 실제로는 Firebase에서 메시지 조회
    if (messageId && mockMessages[messageId]) {
      setMessage(mockMessages[messageId])
      setLoading(false)
    } else {
      // 메시지를 찾을 수 없으면 목록으로 돌아가기
      navigate('/teacher/messages')
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

  const handleMissionClick = () => {
    // 미션 정답 입력 화면으로 이동 (추후 구현)
    console.log('미션 정답 입력하러 가기')
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
                <div 
                  className="teacher-message-detail-avatar-image"
                  style={{ backgroundImage: `url(${message.avatar})` }}
                ></div>
                {message.senderType === 'teacher' && (
                  <div className="teacher-message-detail-avatar-badge teacher-message-detail-avatar-badge-teacher">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                )}
                {message.senderType === 'system' && (
                  <div className="teacher-message-detail-avatar-badge teacher-message-detail-avatar-badge-system">
                    <span className="material-symbols-outlined">settings</span>
                  </div>
                )}
              </div>
              <div className="teacher-message-detail-sender-info">
                <span className="teacher-message-detail-sender-label">보낸 사람</span>
                <h2 className="teacher-message-detail-sender-name">{message.senderName}</h2>
                <time className="teacher-message-detail-time">{message.fullDateTime}</time>
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
                {message.hint && (
                  <div className="teacher-message-detail-hint">
                    <div className="teacher-message-detail-hint-header">
                      <span className="material-symbols-outlined filled">lightbulb</span>
                      <span className="teacher-message-detail-hint-label">결정적 힌트</span>
                    </div>
                    <p className="teacher-message-detail-hint-text">{message.hint}</p>
                  </div>
                )}
              </div>
            </div>
            {message.hint && (
              <div className="teacher-message-detail-action">
                <button 
                  className="teacher-message-detail-action-btn"
                  onClick={handleMissionClick}
                  type="button"
                >
                  <span>미션 정답 입력하러 가기</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            )}
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

