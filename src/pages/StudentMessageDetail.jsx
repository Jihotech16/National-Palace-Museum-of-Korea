import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { logout } from '../firebase/auth'
import './StudentMessageDetail.css'

function StudentMessageDetail({ user }) {
  const navigate = useNavigate()
  const { messageId } = useParams()
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)

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
    if (!user) {
      navigate('/login')
    }
    loadMessage()
  }, [messageId, user, navigate])

  const loadMessage = () => {
    // 실제로는 Firebase에서 메시지 조회
    if (messageId && mockMessages[messageId]) {
      setMessage(mockMessages[messageId])
      setLoading(false)
    } else {
      // 메시지를 찾을 수 없으면 목록으로 돌아가기
      navigate('/student/messages')
    }
  }

  const handleBack = () => {
    navigate('/student/messages')
  }

  const handleMissionClick = () => {
    // 미션 정답 입력 화면으로 이동 (추후 구현)
    console.log('미션 정답 입력하러 가기')
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('로그아웃 오류:', error)
    }
  }

  if (loading || !message) {
    return (
      <div className="student-message-detail-page">
        <div className="student-message-detail-container">
          <div className="student-message-detail-loading">
            <p>메시지를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="student-message-detail-page">
      <div className="student-message-detail-container">
        <header className="student-message-detail-header">
          <button 
            className="student-message-detail-header-btn"
            onClick={handleBack}
            type="button"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="student-message-detail-header-title">메시지 상세</h1>
          <div className="student-message-detail-header-btn" style={{ visibility: 'hidden' }}>
            <span className="material-symbols-outlined">mail</span>
          </div>
        </header>

        <main className="student-message-detail-main">
          <div className="student-message-detail-card">
            <div className="student-message-detail-header-section">
              <div className="student-message-detail-avatar">
                <div 
                  className="student-message-detail-avatar-image"
                  style={{ backgroundImage: `url(${message.avatar})` }}
                ></div>
                {message.senderType === 'teacher' && (
                  <div className="student-message-detail-avatar-badge student-message-detail-avatar-badge-teacher">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                )}
                {message.senderType === 'system' && (
                  <div className="student-message-detail-avatar-badge student-message-detail-avatar-badge-system">
                    <span className="material-symbols-outlined">settings</span>
                  </div>
                )}
              </div>
              <div className="student-message-detail-sender-info">
                <span className="student-message-detail-sender-label">보낸 사람</span>
                <h2 className="student-message-detail-sender-name">{message.senderName}</h2>
                <time className="student-message-detail-time">{message.fullDateTime}</time>
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
                {message.hint && (
                  <div className="student-message-detail-hint">
                    <div className="student-message-detail-hint-header">
                      <span className="material-symbols-outlined filled">lightbulb</span>
                      <span className="student-message-detail-hint-label">결정적 힌트</span>
                    </div>
                    <p className="student-message-detail-hint-text">{message.hint}</p>
                  </div>
                )}
              </div>
            </div>
            {message.hint && (
              <div className="student-message-detail-action">
                <button 
                  className="student-message-detail-action-btn"
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

        <nav className="student-message-detail-navbar">
          <button 
            className="student-message-detail-nav-item"
            onClick={() => navigate('/exhibition-hall-list')}
          >
            <span className="material-symbols-outlined">museum</span>
            <span>전시관</span>
          </button>
          <button className="student-message-detail-nav-item active">
            <span className="material-symbols-outlined">mail</span>
            <span>메시지</span>
          </button>
          <button 
            className="student-message-detail-nav-item"
            onClick={() => navigate('/student-clear')}
          >
            <span className="material-symbols-outlined">verified</span>
            <span>수료증 확인</span>
          </button>
          <button 
            className="student-message-detail-nav-item"
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

export default StudentMessageDetail

