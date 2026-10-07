import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { onAuthChange, logout } from '../../firebase/auth'
import { getTeacherInfo, getStudentsProgress, getActiveStudentsCount, deleteAllSchoolData } from '../../firebase/firestore'
import { formatTeacherGroupLabel } from '../../utils/teacherGroupLabel'
import './TeacherPage.css'

function TeacherPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [teacherData, setTeacherData] = useState(null)
  const [schoolInfo, setSchoolInfo] = useState('')
  const [participatingStudents, setParticipatingStudents] = useState(0)
  const [averageProgress, setAverageProgress] = useState(0)
  const [completedStudents, setCompletedStudents] = useState(0)
  const [helpRequests, setHelpRequests] = useState(0)
  const [previousCompletedCount, setPreviousCompletedCount] = useState(0)
  const [showEndActivityModal, setShowEndActivityModal] = useState(false)
  const [endActivityForm, setEndActivityForm] = useState({
    schoolCode: '',
    password: ''
  })
  const [endActivityError, setEndActivityError] = useState('')
  const [endActivityLoading, setEndActivityLoading] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    loadTeacherData()
    
    // 주기적으로 데이터 갱신 (30초마다)
    const interval = setInterval(() => {
      if (teacherData) {
        loadStudentData(teacherData.schoolCode, teacherData.grade, teacherData.classNum)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const loadTeacherData = async () => {
    try {
      // localStorage에서 교사 정보 가져오기
      const savedTeacherData = localStorage.getItem('teacherData')
      if (savedTeacherData) {
        const data = JSON.parse(savedTeacherData)
        setTeacherData(data)
        setSchoolInfo(formatTeacherGroupLabel(data))
        await loadStudentData(data.schoolCode, data.grade, data.classNum)
      } else {
        // Firebase Auth에서 현재 사용자 확인
        onAuthChange(async (user) => {
          if (user) {
            // 이메일에서 교사 정보 추출
            const email = user.email
            if (email && email.includes('@teacher.local')) {
              const parts = email.replace('@teacher.local', '').split('-')
              if (parts.length === 3) {
                const [schoolCode, grade, classNum] = parts
                const teacherInfo = {
                  schoolCode,
                  grade: parseInt(grade),
                  classNum: parseInt(classNum)
                }
                setTeacherData(teacherInfo)
                setSchoolInfo(formatTeacherGroupLabel(teacherInfo))
                localStorage.setItem('teacherData', JSON.stringify(teacherInfo))
                await loadStudentData(schoolCode, parseInt(grade), parseInt(classNum))
              }
            }
          } else {
            // 로그인되지 않은 경우 로그인 페이지로 이동
            navigate('/teacher-login')
          }
        })
      }
    } catch (error) {
      console.error('교사 데이터 로드 오류:', error)
      setLoading(false)
    }
  }

  const loadStudentData = async (schoolCode, grade, classNum) => {
    try {
      setLoading(true)
      
      // 학생 진행률 가져오기
      const progressResult = await getStudentsProgress(schoolCode, grade, classNum)
      if (progressResult.success) {
        setParticipatingStudents(progressResult.totalStudents)
        setAverageProgress(progressResult.averageProgress)
        
        // 모두 탐험한 학생 수 계산 (진행률 100%인 학생)
        const completedCount = Object.values(progressResult.progress).filter(
          p => p.progress >= 100
        ).length
        setPreviousCompletedCount(completedStudents)
        setCompletedStudents(completedCount)
      }

      // 도움 요청은 임시로 0 (추후 구현)
      setHelpRequests(0)
      
      setLoading(false)
    } catch (error) {
      console.error('학생 데이터 로드 오류:', error)
      setLoading(false)
    }
  }

  // 완료 학생 증가량 계산
  const completedIncrease = completedStudents - previousCompletedCount

  const handleMenuClick = () => {
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
  }

  const handleMessageClick = () => {
    navigate('/teacher/messages')
  }

  const handleStudentProgress = () => {
    navigate('/teacher/class')
  }

  const handleQuestionManagement = () => {
    setActiveTab('questions')
    navigate('/teacher/questions')
  }

  const handleStudentManagement = () => {
    navigate('/teacher/students')
  }

  const handleEndActivity = () => {
    // 현재 교사 정보로 학교 코드 자동 입력
    if (teacherData) {
      setEndActivityForm({
        schoolCode: teacherData.schoolCode || '',
        password: ''
      })
    }
    setShowEndActivityModal(true)
    setEndActivityError('')
  }

  const handleEndActivitySubmit = async (e) => {
    e.preventDefault()
    setEndActivityError('')
    
    if (!endActivityForm.schoolCode || !endActivityForm.password) {
      setEndActivityError('학교 코드와 비밀번호를 모두 입력해주세요.')
      return
    }
    
    // 확인 모달 표시
    setShowConfirmModal(true)
  }

  const handleConfirmEndActivity = async () => {
    setEndActivityLoading(true)
    setEndActivityError('')
    
    try {
      const result = await deleteAllSchoolData(endActivityForm.schoolCode, endActivityForm.password)
      
      if (result.success) {
        // 성공 시 로그아웃 및 로그인 페이지로 이동
        await logout()
        localStorage.removeItem('teacherData')
        localStorage.removeItem('teacherRemember')
        setShowEndActivityModal(false)
        setShowConfirmModal(false)
        navigate('/teacher-login')
        alert('활동이 종료되었습니다. 모든 데이터가 삭제되었습니다.')
      } else {
        setEndActivityError(result.error || '활동 종료에 실패했습니다.')
        setShowConfirmModal(false)
      }
    } catch (error) {
      console.error('활동 종료 오류:', error)
      setEndActivityError('활동 종료 중 오류가 발생했습니다.')
      setShowConfirmModal(false)
    } finally {
      setEndActivityLoading(false)
    }
  }

  const handleCancelEndActivity = () => {
    setShowEndActivityModal(false)
    setShowConfirmModal(false)
    setEndActivityForm({ schoolCode: '', password: '' })
    setEndActivityError('')
  }

  const handleHome = () => {
    // 홈으로 이동 (현재 페이지 유지)
    setActiveTab('home')
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
          <h1 className="teacher-header-title">선생님 대시보드</h1>
          <button 
            className="teacher-header-btn teacher-header-btn-notification"
            onClick={handleMessageClick}
            type="button"
          >
            <span className="material-symbols-outlined">mail</span>
          </button>
        </header>

        <main className="teacher-main">
          {loading ? (
            <div className="teacher-loading">
              <p>데이터를 불러오는 중...</p>
            </div>
          ) : (
            <>
              <section className="teacher-welcome">
                <h2 className="teacher-welcome-title">
                  안녕하세요,<br/>
                  <span className="teacher-welcome-name">선생님!</span> 👋
                </h2>
                <p className="teacher-welcome-subtitle">
                  오늘도 학생들과 즐거운 박물관 탐험 되세요.
                </p>
              </section>

          <section 
            className="teacher-activity-card teacher-activity-card-clickable"
            onClick={handleStudentProgress}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleStudentProgress()
              }
            }}
          >
            <div className="teacher-activity-bg"></div>
            <div className="teacher-activity-overlay"></div>
            <div className="teacher-activity-content">
              <div className="teacher-activity-header">
                <div>
                  <span className="teacher-activity-badge">진행 중</span>
                  <h3 className="teacher-activity-title">박물관 탐험</h3>
                  <p className="teacher-activity-subtitle">{schoolInfo} • 현장학습</p>
                </div>
                <div className="teacher-activity-icon">
                  <span className="material-symbols-outlined">museum</span>
                </div>
              </div>
              <div className="teacher-activity-divider"></div>
              <div className="teacher-activity-stats">
                <div className="teacher-activity-stat">
                  <p className="teacher-activity-stat-label">참여 학생</p>
                  <p className="teacher-activity-stat-value">
                    {participatingStudents}
                    <span className="teacher-activity-stat-unit">명</span>
                  </p>
                </div>
                <div className="teacher-activity-stat">
                  <p className="teacher-activity-stat-label">평균 진행률</p>
                  <p className="teacher-activity-stat-value">
                    {averageProgress}
                    <span className="teacher-activity-stat-unit">%</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="teacher-stats-grid">
            <div className="teacher-stat-card teacher-stat-card-active">
              <div className="teacher-stat-header">
                <span className="material-symbols-outlined teacher-stat-icon teacher-stat-icon-green">check_circle</span>
                <span className="teacher-stat-label">모두 탐험한 학생</span>
              </div>
              <div className="teacher-stat-content">
                <p className="teacher-stat-value">{completedStudents}</p>
                {completedIncrease > 0 && (
                  <span className="teacher-stat-badge teacher-stat-badge-green">+{completedIncrease}명 증가</span>
                )}
                {completedIncrease === 0 && completedStudents > 0 && (
                  <span className="teacher-stat-badge teacher-stat-badge-green">완료</span>
                )}
              </div>
            </div>
            <div className="teacher-stat-card teacher-stat-card-help">
              <div className="teacher-stat-header">
                <span className="material-symbols-outlined teacher-stat-icon teacher-stat-icon-red teacher-stat-icon-pulse">notifications_active</span>
                <span className="teacher-stat-label teacher-stat-label-red">도움 요청</span>
              </div>
              <div className="teacher-stat-content">
                <p className="teacher-stat-value teacher-stat-value-red">
                  {helpRequests}
                  <span className="teacher-stat-value-unit">건</span>
                </p>
                <span className="material-symbols-outlined teacher-stat-arrow">arrow_forward</span>
              </div>
            </div>
          </section>

          <section className="teacher-features">
            <h3 className="teacher-features-title">주요 기능</h3>
            <button 
              className="teacher-feature-btn"
              onClick={handleStudentProgress}
              type="button"
            >
              <div className="teacher-feature-icon teacher-feature-icon-primary">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <div className="teacher-feature-content">
                <h4 className="teacher-feature-title">학생 진도 상세 확인</h4>
                <p className="teacher-feature-subtitle">학생별 위치 및 문제 해결 현황</p>
              </div>
              <span className="material-symbols-outlined teacher-feature-arrow">chevron_right</span>
            </button>
            <button 
              className="teacher-feature-btn"
              onClick={handleQuestionManagement}
              type="button"
            >
              <div className="teacher-feature-icon teacher-feature-icon-blue">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <div className="teacher-feature-content">
                <h4 className="teacher-feature-title">문제 및 정답 관리</h4>
                <p className="teacher-feature-subtitle">미스터리 문제 수정 및 힌트 설정</p>
              </div>
              <span className="material-symbols-outlined teacher-feature-arrow">chevron_right</span>
            </button>
          </section>
            </>
          )}
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

      {/* 활동 종료 모달 */}
      {showEndActivityModal && (
        <div className="teacher-modal-overlay" onClick={handleCancelEndActivity}>
          <div className="teacher-modal" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">활동 종료</h2>
              <button 
                className="teacher-modal-close"
                onClick={handleCancelEndActivity}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEndActivitySubmit} className="teacher-modal-form">
              <div className="teacher-modal-field">
                <label className="teacher-modal-label">학교 코드</label>
                <input
                  type="text"
                  className="teacher-modal-input"
                  value={endActivityForm.schoolCode}
                  onChange={(e) => setEndActivityForm({ ...endActivityForm, schoolCode: e.target.value })}
                  placeholder="학교 코드를 입력하세요"
                  required
                />
              </div>
              
              <div className="teacher-modal-field">
                <label className="teacher-modal-label">비밀번호</label>
                <input
                  type="password"
                  className="teacher-modal-input"
                  value={endActivityForm.password}
                  onChange={(e) => setEndActivityForm({ ...endActivityForm, password: e.target.value })}
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>
              
              {endActivityError && (
                <div className="teacher-modal-error">
                  {endActivityError}
                </div>
              )}
              
              <div className="teacher-modal-actions">
                <button
                  type="button"
                  className="teacher-modal-btn teacher-modal-btn-cancel"
                  onClick={handleCancelEndActivity}
                  disabled={endActivityLoading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="teacher-modal-btn teacher-modal-btn-primary"
                  disabled={endActivityLoading}
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                handleMessageClick()
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
                // 설정 기능 (추후 구현)
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

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="teacher-modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="teacher-modal teacher-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <div className="teacher-modal-header">
              <h2 className="teacher-modal-title">활동 종료 확인</h2>
            </div>
            
            <div className="teacher-modal-body">
              <p className="teacher-modal-message">
                학교의 모든 데이터가 삭제됩니다. 다른 반 데이터도 전부 삭제됩니다.
              </p>
              <p className="teacher-modal-question">
                활동을 종료하시겠습니까?
              </p>
            </div>
            
            <div className="teacher-modal-actions">
              <button
                type="button"
                className="teacher-modal-btn teacher-modal-btn-cancel"
                onClick={() => setShowConfirmModal(false)}
                disabled={endActivityLoading}
              >
                취소
              </button>
              <button
                type="button"
                className="teacher-modal-btn teacher-modal-btn-danger"
                onClick={handleConfirmEndActivity}
                disabled={endActivityLoading}
              >
                {endActivityLoading ? '처리 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeacherPage


